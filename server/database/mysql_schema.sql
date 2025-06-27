-- =============================================
-- Schema MySQL para CDM Admin
-- Sistema de Gestão da Igreja - Santo Daime
-- =============================================

-- Configurações iniciais
SET FOREIGN_KEY_CHECKS = 0;
SET sql_mode = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

-- =============================================
-- TABELA DE USUÁRIOS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE LOGS DE ACESSO
-- =============================================
CREATE TABLE IF NOT EXISTS access_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36),
    ip_address VARCHAR(45),
    user_agent TEXT,
    action VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_access_logs_user_id (user_id),
    INDEX idx_access_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE MEMBROS
-- =============================================
CREATE TABLE IF NOT EXISTS members (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    baptism_date DATE,
    join_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'visitor') DEFAULT 'active',
    groups JSON,
    ministries JSON,
    skills JSON,
    photo VARCHAR(500),
    notes TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_members_email (email),
    INDEX idx_members_status (status),
    INDEX idx_members_name (first_name, last_name),
    INDEX idx_members_join_date (join_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE TRANSAÇÕES FINANCEIRAS
-- =============================================
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_id VARCHAR(36) NULL,
    member_name VARCHAR(255),
    type ENUM('tithe', 'offering', 'donation', 'expense') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    payment_method ENUM('cash', 'check', 'card', 'pix', 'transfer') NOT NULL,
    reference_number VARCHAR(100),
    approved_by VARCHAR(255),
    receipt_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_transactions_date (date),
    INDEX idx_transactions_type (type),
    INDEX idx_transactions_category (category),
    INDEX idx_transactions_member_id (member_id),
    INDEX idx_transactions_amount (amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE INVENTÁRIO GERAL
-- =============================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    location VARCHAR(255),
    value DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    purchase_date DATE,
    min_quantity INT DEFAULT 0,
    max_quantity INT DEFAULT NULL,
    unit VARCHAR(50) DEFAULT 'unidade',
    status ENUM('available', 'low', 'depleted', 'discontinued') DEFAULT 'available',
    notes TEXT,
    barcode VARCHAR(100),
    serial_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_inventory_status (status),
    INDEX idx_inventory_category (category),
    INDEX idx_inventory_name (name),
    INDEX idx_inventory_quantity (quantity),
    INDEX idx_inventory_barcode (barcode)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DO INVENTÁRIO DO DAIME (PRINCIPAL)
-- =============================================
CREATE TABLE IF NOT EXISTS daime_inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    graduacao ENUM('Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5') NOT NULL,
    litros DECIMAL(8,2) NOT NULL,
    data_feitio DATE NOT NULL,
    responsavel_feitio VARCHAR(255) NOT NULL,
    local_feitio VARCHAR(255),
    tipo_feitio ENUM('Novo', 'Concentração', 'Reforço') DEFAULT 'Novo',
    panela VARCHAR(100),
    observacoes TEXT,
    status ENUM('disponivel', 'reservado', 'consumido', 'vencido') DEFAULT 'disponivel',
    data_validade DATE,
    local_armazenamento VARCHAR(255),
    temperatura DECIMAL(4,1),
    ph DECIMAL(3,1),
    cor ENUM('Amarelo', 'Marrom Claro', 'Marrom', 'Marrom Escuro', 'Roxo') DEFAULT 'Amarelo',
    consistencia ENUM('Líquida', 'Densa', 'Muito Densa') DEFAULT 'Líquida',
    
    -- Campos adicionais para controle
    lote_origem VARCHAR(100),
    origem_plantas TEXT, -- Informações sobre as plantas utilizadas
    tempo_cozimento INT, -- Em horas
    data_inicio_preparo DATE,
    data_fim_preparo DATE,
    metodo_preparacao TEXT,
    equipamentos_utilizados TEXT,
    condicoes_climaticas TEXT,
    
    -- Controle de qualidade
    aprovado_por VARCHAR(255),
    data_aprovacao DATE,
    certificado_qualidade BOOLEAN DEFAULT FALSE,
    
    -- Histórico de uso
    litros_originais DECIMAL(8,2), -- Quantidade original
    historico_uso JSON, -- Log de uso/distribuição
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_daime_codigo (codigo),
    INDEX idx_daime_status (status),
    INDEX idx_daime_graduacao (graduacao),
    INDEX idx_daime_data_feitio (data_feitio),
    INDEX idx_daime_responsavel (responsavel_feitio),
    INDEX idx_daime_local (local_feitio),
    INDEX idx_daime_validade (data_validade),
    INDEX idx_daime_tipo (tipo_feitio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA HISTÓRICO DE MOVIMENTAÇÃO DO DAIME
-- =============================================
CREATE TABLE IF NOT EXISTS daime_movements (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    daime_inventory_id VARCHAR(36) NOT NULL,
    tipo_movimento ENUM('entrada', 'saida', 'transferencia', 'perda', 'ajuste') NOT NULL,
    quantidade DECIMAL(8,2) NOT NULL,
    quantidade_anterior DECIMAL(8,2) NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    responsavel VARCHAR(255) NOT NULL,
    destino VARCHAR(255), -- Para transferências
    observacoes TEXT,
    data_movimento TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (daime_inventory_id) REFERENCES daime_inventory(id) ON DELETE CASCADE,
    INDEX idx_daime_movements_inventory_id (daime_inventory_id),
    INDEX idx_daime_movements_tipo (tipo_movimento),
    INDEX idx_daime_movements_data (data_movimento),
    INDEX idx_daime_movements_responsavel (responsavel)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE EVENTOS
-- =============================================
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    location VARCHAR(255),
    address TEXT,
    organizer VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    max_participants INT,
    current_participants INT DEFAULT 0,
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    event_type ENUM('trabalho', 'concentracao', 'cura', 'feitio', 'administrativo', 'social', 'outro') DEFAULT 'outro',
    budget DECIMAL(10,2),
    expenses DECIMAL(10,2) DEFAULT 0,
    participants JSON,
    resources JSON,
    requirements TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_events_start_date (start_date),
    INDEX idx_events_status (status),
    INDEX idx_events_type (event_type),
    INDEX idx_events_organizer (organizer)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE PARTICIPAÇÃO EM EVENTOS
-- =============================================
CREATE TABLE IF NOT EXISTS event_participants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    event_id VARCHAR(36) NOT NULL,
    member_id VARCHAR(36) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attendance_status ENUM('registered', 'confirmed', 'attended', 'absent', 'cancelled') DEFAULT 'registered',
    role VARCHAR(100), -- função no evento
    notes TEXT,
    
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_member (event_id, member_id),
    INDEX idx_event_participants_event_id (event_id),
    INDEX idx_event_participants_member_id (member_id),
    INDEX idx_event_participants_status (attendance_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABELA DE CONFIGURAÇÕES DO SISTEMA
-- =============================================
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_settings_key (setting_key),
    INDEX idx_settings_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DADOS INICIAIS
-- =============================================

-- Usuário administrador padrão
INSERT INTO users (id, name, email, password_hash, role) VALUES
('admin-001', 'Administrador', 'admin@cdm.local', '$2a$10$rXnqG8QT8C.mBqK5Y9Z7VOsK3.lXKx8A2GKjK2L3Q8M7X9Y1Z3A5e', 'admin');

-- Configurações do sistema
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('app_name', 'CDM Admin', 'string', 'Nome da aplicação', 'general'),
('app_version', '1.0.0', 'string', 'Versão da aplicação', 'general'),
('max_upload_size', '10485760', 'number', 'Tamanho máximo de upload em bytes (10MB)', 'files'),
('backup_frequency', '24', 'number', 'Frequência de backup em horas', 'backup'),
('session_timeout', '86400', 'number', 'Timeout da sessão em segundos (24h)', 'auth'),
('daime_min_stock_alert', '5', 'number', 'Alerta de estoque mínimo do Daime em litros', 'inventory'),
('enable_email_notifications', 'false', 'boolean', 'Habilitar notificações por email', 'notifications');

-- Dados de exemplo para o inventário do Daime
INSERT INTO daime_inventory (
    codigo, graduacao, litros, litros_originais, data_feitio, responsavel_feitio, 
    local_feitio, tipo_feitio, panela, observacoes, status,
    local_armazenamento, temperatura, ph, cor, consistencia,
    data_inicio_preparo, data_fim_preparo, aprovado_por, data_aprovacao
) VALUES 
(
    'DM2024-001', 'Força 3', 25.5, 25.5, '2024-12-01', 'Padrinho José Silva',
    'Casa de Feitio - Núcleo Central', 'Concentração', 'Panela Grande',
    'Feitio realizado com jagube do Rio Jordão e rainha do sítio. Concentração feita a partir de 45 litros de Daime Força 2.',
    'disponivel', 
    'Despensa Principal - Prateleira A - Container 001', 18.5, 3.2, 'Marrom', 'Densa',
    '2024-11-29', '2024-12-01', 'Padrinho José Silva', '2024-12-02'
),
(
    'DM2024-002', 'Força 4', 12.0, 12.0, '2024-11-15', 'Madrinha Maria Santos',
    'Casa de Feitio - Núcleo Norte', 'Novo', 'Panela Média',
    'Primeiro feitio do ano com plantas do próprio terreno. Muito concentrado e de excelente qualidade.',
    'disponivel',
    'Despensa Principal - Prateleira B - Container 002', 17.0, 3.1, 'Marrom Escuro', 'Muito Densa',
    '2024-11-13', '2024-11-15', 'Padrinho José Silva', '2024-11-16'
),
(
    'DM2024-003', 'Força 2', 18.2, 20.0, '2024-10-20', 'Irmão João Mendes',
    'Casa de Feitio - Núcleo Sul', 'Novo', 'Panela Pequena',
    'Feitio para uso nos trabalhos de cura. Feito com muito amor e dedicação.',
    'disponivel',
    'Despensa Secundária - Prateleira C - Container 003', 19.0, 3.3, 'Marrom Claro', 'Líquida',
    '2024-10-18', '2024-10-20', 'Madrinha Maria Santos', '2024-10-21'
);

-- Exemplo de membros
INSERT INTO members (
    first_name, last_name, email, phone, join_date, status,
    birth_date, baptism_date, address
) VALUES 
(
    'José', 'Silva', 'jose.silva@email.com', '(11) 99999-1111', '2020-03-15', 'active',
    '1975-06-10', '2020-06-21', 'Rua das Flores, 123 - São Paulo, SP'
),
(
    'Maria', 'Santos', 'maria.santos@email.com', '(11) 99999-2222', '2019-05-20', 'active',
    '1982-11-22', '2019-09-23', 'Av. Principal, 456 - São Paulo, SP'
),
(
    'João', 'Mendes', 'joao.mendes@email.com', '(11) 99999-3333', '2021-01-10', 'active',
    '1990-03-15', '2021-04-18', 'Rua da Paz, 789 - São Paulo, SP'
);

-- Exemplo de transações
INSERT INTO transactions (
    member_name, type, amount, date, category, description, payment_method
) VALUES 
('José Silva', 'tithe', 150.00, '2024-12-01', 'Dízimo', 'Dízimo mensal', 'pix'),
('Maria Santos', 'offering', 50.00, '2024-12-01', 'Oferta', 'Oferta para obras', 'cash'),
('João Mendes', 'donation', 200.00, '2024-11-28', 'Doação', 'Doação para feitio', 'transfer'),
('Despesas Gerais', 'expense', 300.00, '2024-11-25', 'Mantimentos', 'Compra de ingredientes para feitio', 'cash');

-- Exemplo de evento
INSERT INTO events (
    title, description, start_date, end_date, location, organizer,
    event_type, status, max_participants
) VALUES 
(
    'Trabalho de Concentração', 
    'Trabalho mensal de concentração para toda a comunidade',
    '2024-12-15 19:00:00', '2024-12-15 23:00:00',
    'Salão Principal', 'Padrinho José Silva',
    'concentracao', 'planned', 50
);

-- =============================================
-- TRIGGERS PARA AUDITORIA
-- =============================================

-- Trigger para registrar movimentação do Daime
DELIMITER $$
CREATE TRIGGER daime_inventory_after_update
AFTER UPDATE ON daime_inventory
FOR EACH ROW
BEGIN
    IF OLD.litros != NEW.litros THEN
        INSERT INTO daime_movements (
            daime_inventory_id, tipo_movimento, quantidade, quantidade_anterior,
            motivo, responsavel, data_movimento
        ) VALUES (
            NEW.id, 
            CASE 
                WHEN NEW.litros > OLD.litros THEN 'entrada'
                ELSE 'saida'
            END,
            ABS(NEW.litros - OLD.litros),
            OLD.litros,
            CONCAT('Atualização via sistema - Status: ', NEW.status),
            'Sistema',
            NOW()
        );
    END IF;
END$$
DELIMITER ;

-- =============================================
-- VIEWS ÚTEIS
-- =============================================

-- View para estatísticas do Daime
CREATE OR REPLACE VIEW daime_stats AS
SELECT 
    graduacao,
    COUNT(*) as total_lotes,
    SUM(litros) as total_litros,
    AVG(litros) as media_litros,
    MIN(data_feitio) as primeiro_feitio,
    MAX(data_feitio) as ultimo_feitio,
    SUM(CASE WHEN status = 'disponivel' THEN litros ELSE 0 END) as litros_disponiveis,
    SUM(CASE WHEN status = 'reservado' THEN litros ELSE 0 END) as litros_reservados
FROM daime_inventory 
WHERE status != 'consumido'
GROUP BY graduacao;

-- View para membros ativos com estatísticas
CREATE OR REPLACE VIEW members_summary AS
SELECT 
    m.*,
    COALESCE(t.total_contribuicoes, 0) as total_contribuicoes,
    COALESCE(t.ultima_contribuicao, NULL) as ultima_contribuicao,
    COALESCE(e.total_eventos, 0) as total_eventos_participados
FROM members m
LEFT JOIN (
    SELECT 
        member_name,
        SUM(amount) as total_contribuicoes,
        MAX(date) as ultima_contribuicao
    FROM transactions 
    WHERE type IN ('tithe', 'offering', 'donation')
    GROUP BY member_name
) t ON CONCAT(m.first_name, ' ', m.last_name) = t.member_name
LEFT JOIN (
    SELECT 
        member_id,
        COUNT(*) as total_eventos
    FROM event_participants
    WHERE attendance_status = 'attended'
    GROUP BY member_id
) e ON m.id = e.member_id;

-- =============================================
-- PROCEDURES ÚTEIS
-- =============================================

-- Procedure para backup de dados importantes
DELIMITER $$
CREATE PROCEDURE BackupDaimeData(
    IN backup_date DATE
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Criar tabela de backup se não existir
    CREATE TABLE IF NOT EXISTS daime_inventory_backup (
        backup_id VARCHAR(36) DEFAULT (UUID()),
        backup_date DATE,
        original_id VARCHAR(36),
        codigo VARCHAR(50),
        graduacao ENUM('Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5'),
        litros DECIMAL(8,2),
        data_feitio DATE,
        responsavel_feitio VARCHAR(255),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_backup_date (backup_date)
    );
    
    -- Inserir dados atuais no backup
    INSERT INTO daime_inventory_backup (
        backup_date, original_id, codigo, graduacao, litros,
        data_feitio, responsavel_feitio, status
    )
    SELECT 
        backup_date, id, codigo, graduacao, litros,
        data_feitio, responsavel_feitio, status
    FROM daime_inventory
    WHERE DATE(updated_at) = backup_date OR backup_date IS NULL;
    
    COMMIT;
    
    SELECT CONCAT('Backup realizado com sucesso para ', COALESCE(backup_date, 'todos os dados')) as resultado;
END$$
DELIMITER ;

-- =============================================
-- FINALIZAÇÃO
-- =============================================

SET FOREIGN_KEY_CHECKS = 1;

-- Mostrar estatísticas após criação
SELECT 
    'Tabelas criadas com sucesso!' as status,
    (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE()) as total_tabelas,
    (SELECT COUNT(*) FROM users) as total_usuarios,
    (SELECT COUNT(*) FROM daime_inventory) as total_daime_registros;

-- Mostrar próximos passos
SELECT '
🎉 SCHEMA MYSQL CRIADO COM SUCESSO!

📋 PRÓXIMOS PASSOS:
1. Configurar as variáveis de ambiente (.env)
2. Instalar dependências do backend (npm install)  
3. Iniciar o servidor Node.js (npm start)
4. Configurar o frontend para usar a nova API
5. Migrar dados do Supabase (se necessário)

🔐 USUÁRIO PADRÃO:
Email: admin@cdm.local
Senha: admin123 (ALTERE IMEDIATAMENTE!)

📊 DADOS DE EXEMPLO:
- 3 registros no inventário do Daime
- 3 membros de exemplo
- 4 transações de exemplo
- 1 evento de exemplo

🛡️ RECURSOS DE SEGURANÇA:
- Triggers para auditoria
- Views para relatórios
- Procedures para backup
- Índices para performance

' as proximos_passos;
