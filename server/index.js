const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();

// Middlewares de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: 'Muitas tentativas, tente novamente em 15 minutos.'
});
app.use('/api/', limiter);

// Strict rate limit para login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  skipSuccessfulRequests: true,
  message: 'Muitas tentativas de login, tente novamente em 15 minutos.'
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configuração do banco MySQL
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    timezone: '+00:00',
    dateStrings: ['DATE', 'DATETIME'],
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Pool de conexões
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Token de acesso necessário' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado: apenas administradores' });
    }
    next();
};

// Middleware para lidar com erros de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Dados inválidos', 
            details: errors.array() 
        });
    }
    next();
};

// ===== ROTAS DE AUTENTICAÇÃO =====

// Login
app.post('/api/auth/login', 
    loginLimiter,
    [
        body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { email, password } = req.body;
            
            const [rows] = await pool.execute(
                'SELECT id, name, email, password_hash, role FROM users WHERE email = ? AND active = 1',
                [email]
            );
            
            if (rows.length === 0) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            
            const user = rows[0];
            const validPassword = await bcrypt.compare(password, user.password_hash);
            
            if (!validPassword) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            
            const token = jwt.sign(
                { 
                    id: user.id, 
                    email: user.email, 
                    role: user.role,
                    name: user.name
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            // Log de acesso
            await pool.execute(
                'INSERT INTO access_logs (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
                [user.id, req.ip, req.get('User-Agent')]
            );
            
            res.json({
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
            
        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// Verificar token
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, role FROM users WHERE id = ?',
            [req.user.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ===== ROTAS DO INVENTÁRIO DO DAIME =====

// Listar inventário do Daime
app.get('/api/daime-inventory', authenticateToken, async (req, res) => {
    try {
        const { status, graduacao, search } = req.query;
        
        let query = 'SELECT * FROM daime_inventory WHERE 1=1';
        const params = [];
        
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }
        
        if (graduacao) {
            query += ' AND graduacao = ?';
            params.push(graduacao);
        }
        
        if (search) {
            query += ' AND (codigo LIKE ? OR responsavel_feitio LIKE ? OR local_feitio LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await pool.execute(query, params);
        
        // Transformar os dados para o formato esperado pelo frontend
        const transformedData = rows.map(item => ({
            id: item.id,
            codigo: item.codigo,
            graduacao: item.graduacao,
            litros: parseFloat(item.litros),
            dataFeitio: item.data_feitio,
            responsavelFeitio: item.responsavel_feitio,
            localFeitio: item.local_feitio,
            tipoFeitio: item.tipo_feitio,
            panela: item.panela,
            observacoes: item.observacoes,
            status: item.status,
            dataValidade: item.data_validade,
            localArmazenamento: item.local_armazenamento,
            temperatura: item.temperatura ? parseFloat(item.temperatura) : null,
            ph: item.ph ? parseFloat(item.ph) : null,
            cor: item.cor,
            consistencia: item.consistencia,
            created_at: item.created_at,
            updated_at: item.updated_at
        }));
        
        res.json(transformedData);
    } catch (error) {
        console.error('Erro ao buscar inventário do Daime:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Adicionar item ao inventário do Daime
app.post('/api/daime-inventory',
    authenticateToken,
    requireAdmin,
    [
        body('codigo').notEmpty().withMessage('Código é obrigatório'),
        body('graduacao').isIn(['Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5']).withMessage('Graduação inválida'),
        body('litros').isFloat({ min: 0 }).withMessage('Litros deve ser um número positivo'),
        body('dataFeitio').isDate().withMessage('Data do feitio inválida'),
        body('responsavelFeitio').notEmpty().withMessage('Responsável pelo feitio é obrigatório')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const {
                codigo, graduacao, litros, dataFeitio, responsavelFeitio,
                localFeitio, tipoFeitio, panela, observacoes, status,
                dataValidade, localArmazenamento, temperatura, ph, cor, consistencia
            } = req.body;
            
            // Verificar se o código já existe
            const [existing] = await pool.execute(
                'SELECT id FROM daime_inventory WHERE codigo = ?',
                [codigo]
            );
            
            if (existing.length > 0) {
                return res.status(400).json({ error: 'Código já existe no inventário' });
            }
            
            const [result] = await pool.execute(
                `INSERT INTO daime_inventory (
                    codigo, graduacao, litros, data_feitio, responsavel_feitio,
                    local_feitio, tipo_feitio, panela, observacoes, status,
                    data_validade, local_armazenamento, temperatura, ph, cor, consistencia
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    codigo, graduacao, litros, dataFeitio, responsavelFeitio,
                    localFeitio || null, tipoFeitio || 'Novo', panela || null, 
                    observacoes || null, status || 'disponivel',
                    dataValidade || null, localArmazenamento || null, 
                    temperatura || null, ph || null, cor || 'Amarelo', 
                    consistencia || 'Líquida'
                ]
            );
            
            // Buscar o item criado para retornar
            const [created] = await pool.execute(
                'SELECT * FROM daime_inventory WHERE id = ?',
                [result.insertId]
            );
            
            const transformedData = {
                id: created[0].id,
                codigo: created[0].codigo,
                graduacao: created[0].graduacao,
                litros: parseFloat(created[0].litros),
                dataFeitio: created[0].data_feitio,
                responsavelFeitio: created[0].responsavel_feitio,
                localFeitio: created[0].local_feitio,
                tipoFeitio: created[0].tipo_feitio,
                panela: created[0].panela,
                observacoes: created[0].observacoes,
                status: created[0].status,
                dataValidade: created[0].data_validade,
                localArmazenamento: created[0].local_armazenamento,
                temperatura: created[0].temperatura ? parseFloat(created[0].temperatura) : null,
                ph: created[0].ph ? parseFloat(created[0].ph) : null,
                cor: created[0].cor,
                consistencia: created[0].consistencia,
                created_at: created[0].created_at,
                updated_at: created[0].updated_at
            };
            
            res.status(201).json(transformedData);
        } catch (error) {
            console.error('Erro ao adicionar item ao inventário do Daime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// Atualizar item do inventário do Daime
app.put('/api/daime-inventory/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
            
            // Construir query de update dinamicamente
            const updateFields = [];
            const updateValues = [];
            
            // Mapear campos do frontend para o banco
            const fieldMapping = {
                codigo: 'codigo',
                graduacao: 'graduacao',
                litros: 'litros',
                dataFeitio: 'data_feitio',
                responsavelFeitio: 'responsavel_feitio',
                localFeitio: 'local_feitio',
                tipoFeitio: 'tipo_feitio',
                panela: 'panela',
                observacoes: 'observacoes',
                status: 'status',
                dataValidade: 'data_validade',
                localArmazenamento: 'local_armazenamento',
                temperatura: 'temperatura',
                ph: 'ph',
                cor: 'cor',
                consistencia: 'consistencia'
            };
            
            for (const [frontendField, dbField] of Object.entries(fieldMapping)) {
                if (updateData[frontendField] !== undefined) {
                    updateFields.push(`${dbField} = ?`);
                    updateValues.push(updateData[frontendField]);
                }
            }
            
            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'Nenhum campo para atualizar' });
            }
            
            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateValues.push(id);
            
            const updateQuery = `UPDATE daime_inventory SET ${updateFields.join(', ')} WHERE id = ?`;
            
            await pool.execute(updateQuery, updateValues);
            
            // Buscar o item atualizado
            const [updated] = await pool.execute(
                'SELECT * FROM daime_inventory WHERE id = ?',
                [id]
            );
            
            if (updated.length === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            const transformedData = {
                id: updated[0].id,
                codigo: updated[0].codigo,
                graduacao: updated[0].graduacao,
                litros: parseFloat(updated[0].litros),
                dataFeitio: updated[0].data_feitio,
                responsavelFeitio: updated[0].responsavel_feitio,
                localFeitio: updated[0].local_feitio,
                tipoFeitio: updated[0].tipo_feitio,
                panela: updated[0].panela,
                observacoes: updated[0].observacoes,
                status: updated[0].status,
                dataValidade: updated[0].data_validade,
                localArmazenamento: updated[0].local_armazenamento,
                temperatura: updated[0].temperatura ? parseFloat(updated[0].temperatura) : null,
                ph: updated[0].ph ? parseFloat(updated[0].ph) : null,
                cor: updated[0].cor,
                consistencia: updated[0].consistencia,
                created_at: updated[0].created_at,
                updated_at: updated[0].updated_at
            };
            
            res.json(transformedData);
        } catch (error) {
            console.error('Erro ao atualizar item do inventário do Daime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// Deletar item do inventário do Daime
app.delete('/api/daime-inventory/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.execute(
                'DELETE FROM daime_inventory WHERE id = ?',
                [id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            res.json({ message: 'Item removido com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar item do inventário do Daime:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// ===== ROTAS DE MEMBROS =====

// Listar membros
app.get('/api/members', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM members ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar membros:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ===== ROTAS DE TRANSAÇÕES =====

// Listar transações
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM transactions ORDER BY date DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ===== ROTAS DE INVENTÁRIO GERAL =====

// ===== ROTAS DE INVENTÁRIO GERAL =====

// Listar inventário geral
app.get('/api/inventory', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM inventory_items ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar inventário:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Adicionar item ao inventário geral
app.post('/api/inventory',
    authenticateToken,
    requireAdmin,
    [
        body('name').notEmpty().withMessage('Nome é obrigatório'),
        body('category').notEmpty().withMessage('Categoria é obrigatória'),
        body('quantity').isNumeric().withMessage('Quantidade deve ser um número'),
        body('unit').notEmpty().withMessage('Unidade é obrigatória')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const {
                name, description, category, quantity, unit, 
                minimum_stock, location, notes, supplier, 
                purchase_date, expiry_date, cost
            } = req.body;
            
            const [result] = await pool.execute(
                `INSERT INTO inventory_items (
                    name, description, category, quantity, unit, 
                    minimum_stock, location, notes, supplier, 
                    purchase_date, expiry_date, cost
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    name, description || null, category, quantity, unit,
                    minimum_stock || 0, location || null, notes || null,
                    supplier || null, purchase_date || null, 
                    expiry_date || null, cost || null
                ]
            );
            
            // Buscar o item criado para retornar
            const [created] = await pool.execute(
                'SELECT * FROM inventory_items WHERE id = ?',
                [result.insertId]
            );
            
            res.status(201).json(created[0]);
        } catch (error) {
            console.error('Erro ao criar item do inventário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// Atualizar item do inventário geral
app.put('/api/inventory/:id',
    authenticateToken,
    requireAdmin,
    [
        body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
        body('category').optional().notEmpty().withMessage('Categoria não pode estar vazia'),
        body('quantity').optional().isNumeric().withMessage('Quantidade deve ser um número'),
        body('unit').optional().notEmpty().withMessage('Unidade não pode estar vazia')
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { id } = req.params;
            const updateFields = [];
            const updateValues = [];
            
            // Campos que podem ser atualizados
            const allowedFields = [
                'name', 'description', 'category', 'quantity', 'unit',
                'minimum_stock', 'location', 'notes', 'supplier',
                'purchase_date', 'expiry_date', 'cost'
            ];
            
            // Construir query dinâmica apenas com campos fornecidos
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updateFields.push(`${field} = ?`);
                    updateValues.push(req.body[field]);
                }
            });
            
            if (updateFields.length === 0) {
                return res.status(400).json({ error: 'Nenhum campo para atualizar fornecido' });
            }
            
            updateValues.push(id);
            
            const [result] = await pool.execute(
                `UPDATE inventory_items SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                updateValues
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            // Buscar o item atualizado para retornar
            const [updated] = await pool.execute(
                'SELECT * FROM inventory_items WHERE id = ?',
                [id]
            );
            
            res.json(updated[0]);
        } catch (error) {
            console.error('Erro ao atualizar item do inventário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// Deletar item do inventário geral
app.delete('/api/inventory/:id',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            
            const [result] = await pool.execute(
                'DELETE FROM inventory_items WHERE id = ?',
                [id]
            );
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            res.json({ message: 'Item deletado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar item do inventário:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
);

// ===== ROTAS DE EVENTOS =====

// Listar eventos
app.get('/api/events', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM events ORDER BY start_date DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar eventos:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ===== ROTAS DE ESTATÍSTICAS =====

// Dashboard stats
app.get('/api/stats', authenticateToken, async (req, res) => {
    try {
        const [membersCount] = await pool.execute(
            'SELECT COUNT(*) as count FROM members WHERE status = "active"'
        );
        
        const [dimeCount] = await pool.execute(
            'SELECT COUNT(*) as count, SUM(litros) as total_litros FROM daime_inventory WHERE status = "disponivel"'
        );
        
        const [revenueSum] = await pool.execute(
            'SELECT SUM(amount) as total FROM transactions WHERE type IN ("tithe", "offering", "donation") AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
        );
        
        const [expensesSum] = await pool.execute(
            'SELECT SUM(amount) as total FROM transactions WHERE type = "expense" AND date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)'
        );
        
        res.json({
            membersCount: membersCount[0].count,
            dimeItemsCount: dimeCount[0].count,
            totalLitros: parseFloat(dimeCount[0].total_litros || 0),
            monthlyRevenue: parseFloat(revenueSum[0].total || 0),
            monthlyExpenses: parseFloat(expensesSum[0].total || 0)
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ===== MIDDLEWARES DE ERRO =====

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Erro não capturado:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====

const PORT = process.env.PORT || 3001;

// Testar conexão com o banco antes de iniciar
async function initializeServer() {
    try {
        await pool.execute('SELECT 1');
        console.log('✅ Conexão com banco de dados estabelecida');
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor CDM Admin rodando na porta ${PORT}`);
            console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco:', error);
        process.exit(1);
    }
}

initializeServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🔄 Encerrando servidor...');
    await pool.end();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('🔄 Encerrando servidor...');
    await pool.end();
    process.exit(0);
});
