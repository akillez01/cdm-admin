const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Configuração do banco de dados
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

class UserManager {
    constructor() {
        this.connection = null;
    }

    async connect() {
        this.connection = await mysql.createConnection(dbConfig);
    }

    async disconnect() {
        if (this.connection) {
            await this.connection.end();
        }
    }

    async listUsers() {
        const [users] = await this.connection.execute(
            'SELECT id, name, email, role, active, created_at, last_login FROM users ORDER BY created_at'
        );
        return users;
    }

    async listAdmins() {
        const [admins] = await this.connection.execute(
            'SELECT id, name, email, role, active, created_at, last_login FROM users WHERE role = "admin" ORDER BY created_at'
        );
        return admins;
    }

    async createUser(userData) {
        const { name, email, password, role = 'viewer' } = userData;
        
        // Verificar se usuário já existe
        const [existing] = await this.connection.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existing.length > 0) {
            throw new Error(`Usuário com email ${email} já existe`);
        }

        // Gerar hash da senha
        const passwordHash = await bcrypt.hash(password, 10);
        const id = `user-${Date.now()}`;

        // Inserir usuário
        await this.connection.execute(
            'INSERT INTO users (id, name, email, password_hash, role, active, created_at) VALUES (?, ?, ?, ?, ?, TRUE, NOW())',
            [id, name, email, passwordHash, role]
        );

        return { id, name, email, role };
    }

    async updateUser(email, updates) {
        const allowedUpdates = ['name', 'role', 'active'];
        const setClause = [];
        const values = [];

        for (const [key, value] of Object.entries(updates)) {
            if (allowedUpdates.includes(key)) {
                setClause.push(`${key} = ?`);
                values.push(value);
            }
        }

        if (setClause.length === 0) {
            throw new Error('Nenhuma atualização válida fornecida');
        }

        values.push(email);
        await this.connection.execute(
            `UPDATE users SET ${setClause.join(', ')}, updated_at = NOW() WHERE email = ?`,
            values
        );
    }

    async changePassword(email, newPassword) {
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.connection.execute(
            'UPDATE users SET password_hash = ?, updated_at = NOW() WHERE email = ?',
            [passwordHash, email]
        );
    }

    async deactivateUser(email) {
        await this.connection.execute(
            'UPDATE users SET active = FALSE, updated_at = NOW() WHERE email = ?',
            [email]
        );
    }

    async activateUser(email) {
        await this.connection.execute(
            'UPDATE users SET active = TRUE, updated_at = NOW() WHERE email = ?',
            [email]
        );
    }

    async deleteUser(email) {
        // Verificar se não é o último admin
        const [adminCount] = await this.connection.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = "admin" AND active = TRUE'
        );

        const [userToDelete] = await this.connection.execute(
            'SELECT role FROM users WHERE email = ?',
            [email]
        );

        if (userToDelete.length > 0 && userToDelete[0].role === 'admin' && adminCount[0].count <= 1) {
            throw new Error('Não é possível deletar o último administrador ativo');
        }

        await this.connection.execute('DELETE FROM users WHERE email = ?', [email]);
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    const userManager = new UserManager();

    try {
        await userManager.connect();

        switch (command) {
            case 'list':
                await listUsers(userManager);
                break;
            case 'list-admins':
                await listAdmins(userManager);
                break;
            case 'create':
                await createUser(userManager, args.slice(1));
                break;
            case 'update':
                await updateUser(userManager, args.slice(1));
                break;
            case 'change-password':
                await changePassword(userManager, args.slice(1));
                break;
            case 'activate':
                await activateUser(userManager, args[1]);
                break;
            case 'deactivate':
                await deactivateUser(userManager, args[1]);
                break;
            case 'delete':
                await deleteUser(userManager, args[1]);
                break;
            default:
                showHelp();
        }
    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    } finally {
        await userManager.disconnect();
    }
}

async function listUsers(userManager) {
    console.log('👥 Todos os usuários:');
    console.log('=' .repeat(80));
    
    const users = await userManager.listUsers();
    
    users.forEach((user, index) => {
        const status = user.active ? '🟢 Ativo' : '🔴 Inativo';
        const lastLogin = user.last_login ? new Date(user.last_login).toLocaleString('pt-BR') : 'Nunca';
        
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👑 Role: ${user.role}`);
        console.log(`   📊 Status: ${status}`);
        console.log(`   📅 Criado: ${new Date(user.created_at).toLocaleString('pt-BR')}`);
        console.log(`   🔐 Último login: ${lastLogin}`);
        console.log('');
    });
}

async function listAdmins(userManager) {
    console.log('👑 Usuários Administradores:');
    console.log('=' .repeat(50));
    
    const admins = await userManager.listAdmins();
    
    admins.forEach((admin, index) => {
        const status = admin.active ? '🟢 Ativo' : '🔴 Inativo';
        
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   📧 ${admin.email}`);
        console.log(`   📊 ${status}`);
        console.log('');
    });
}

async function createUser(userManager, args) {
    if (args.length < 4) {
        console.log('❌ Uso: node scripts/manage-users.js create <nome> <email> <senha> <role>');
        console.log('Roles: admin, manager, viewer');
        return;
    }

    const [name, email, password, role] = args;
    const user = await userManager.createUser({ name, email, password, role });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log(`👤 Nome: ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`👑 Role: ${user.role}`);
}

async function updateUser(userManager, args) {
    if (args.length < 3) {
        console.log('❌ Uso: node scripts/manage-users.js update <email> <campo> <valor>');
        console.log('Campos: name, role, active');
        return;
    }

    const [email, field, value] = args;
    const updates = { [field]: value === 'true' ? true : value === 'false' ? false : value };
    
    await userManager.updateUser(email, updates);
    console.log(`✅ Usuário ${email} atualizado com sucesso!`);
}

async function changePassword(userManager, args) {
    if (args.length < 2) {
        console.log('❌ Uso: node scripts/manage-users.js change-password <email> <nova-senha>');
        return;
    }

    const [email, newPassword] = args;
    await userManager.changePassword(email, newPassword);
    console.log(`✅ Senha do usuário ${email} alterada com sucesso!`);
}

async function activateUser(userManager, email) {
    if (!email) {
        console.log('❌ Uso: node scripts/manage-users.js activate <email>');
        return;
    }

    await userManager.activateUser(email);
    console.log(`✅ Usuário ${email} ativado com sucesso!`);
}

async function deactivateUser(userManager, email) {
    if (!email) {
        console.log('❌ Uso: node scripts/manage-users.js deactivate <email>');
        return;
    }

    await userManager.deactivateUser(email);
    console.log(`✅ Usuário ${email} desativado com sucesso!`);
}

async function deleteUser(userManager, email) {
    if (!email) {
        console.log('❌ Uso: node scripts/manage-users.js delete <email>');
        return;
    }

    await userManager.deleteUser(email);
    console.log(`✅ Usuário ${email} deletado com sucesso!`);
}

function showHelp() {
    console.log('🛠️  Gerenciador de Usuários - CDM Admin');
    console.log('=' .repeat(40));
    console.log('');
    console.log('Comandos disponíveis:');
    console.log('');
    console.log('📋 Listar:');
    console.log('  list                    - Lista todos os usuários');
    console.log('  list-admins            - Lista apenas administradores');
    console.log('');
    console.log('➕ Criar:');
    console.log('  create <nome> <email> <senha> <role>');
    console.log('                         - Cria novo usuário');
    console.log('');
    console.log('✏️  Atualizar:');
    console.log('  update <email> <campo> <valor>');
    console.log('                         - Atualiza dados do usuário');
    console.log('  change-password <email> <nova-senha>');
    console.log('                         - Altera senha do usuário');
    console.log('');
    console.log('🔄 Status:');
    console.log('  activate <email>       - Ativa usuário');
    console.log('  deactivate <email>     - Desativa usuário');
    console.log('');
    console.log('🗑️  Deletar:');
    console.log('  delete <email>         - Remove usuário (cuidado!)');
    console.log('');
    console.log('Exemplos:');
    console.log('  node scripts/manage-users.js list');
    console.log('  node scripts/manage-users.js create "João Silva" joao@cdm.local senha123 admin');
    console.log('  node scripts/manage-users.js update joao@cdm.local role manager');
    console.log('  node scripts/manage-users.js change-password joao@cdm.local nova_senha');
}

// Executar se chamado diretamente
if (require.main === module) {
    main();
}

module.exports = { UserManager };
