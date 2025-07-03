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

// Dados dos novos usuários administradores
const newAdmins = [
    {
        id: 'admin-yan-001',
        name: 'Yan',
        email: 'yan@cdm.local',
        password: 'yan123cdm',
        role: 'admin'
    },
    {
        id: 'admin-michel-001', 
        name: 'Michel',
        email: 'michel@cdm.local',
        password: 'michel123cdm',
        role: 'admin'
    }
];

async function createAdminUsers() {
    let connection;
    
    try {
        console.log('🔗 Conectando ao banco de dados...');
        connection = await mysql.createConnection(dbConfig);
        console.log('✅ Conexão estabelecida com sucesso!');

        console.log('\n🔐 Criando usuários administradores...\n');

        for (const admin of newAdmins) {
            try {
                // Verificar se o usuário já existe
                const [existing] = await connection.execute(
                    'SELECT id, email FROM users WHERE email = ? OR id = ?',
                    [admin.email, admin.id]
                );

                if (existing.length > 0) {
                    console.log(`⚠️  Usuário ${admin.name} (${admin.email}) já existe. Pulando...`);
                    continue;
                }

                // Gerar hash da senha
                console.log(`🔑 Gerando hash da senha para ${admin.name}...`);
                const passwordHash = await bcrypt.hash(admin.password, 10);

                // Inserir novo usuário
                await connection.execute(
                    'INSERT INTO users (id, name, email, password_hash, role, active, created_at) VALUES (?, ?, ?, ?, ?, TRUE, NOW())',
                    [admin.id, admin.name, admin.email, passwordHash, admin.role]
                );

                console.log(`✅ Usuário ${admin.name} criado com sucesso!`);
                console.log(`   📧 Email: ${admin.email}`);
                console.log(`   🔑 Senha: ${admin.password}`);
                console.log(`   👑 Role: ${admin.role}\n`);

            } catch (userError) {
                console.error(`❌ Erro ao criar usuário ${admin.name}:`, userError.message);
            }
        }

        // Listar todos os usuários administradores
        console.log('📋 Listando todos os usuários administradores:');
        console.log('=' .repeat(60));
        
        const [allAdmins] = await connection.execute(
            'SELECT id, name, email, role, active, created_at FROM users WHERE role = "admin" ORDER BY created_at'
        );

        allAdmins.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   🆔 ID: ${user.id}`);
            console.log(`   📊 Status: ${user.active ? 'Ativo' : 'Inativo'}`);
            console.log(`   📅 Criado em: ${user.created_at}`);
            console.log('');
        });

        console.log('🎉 Processo concluído com sucesso!');
        console.log('\n📝 Credenciais de acesso:');
        console.log('=' .repeat(40));
        console.log('Yan:');
        console.log('  Email: yan@cdm.local');
        console.log('  Senha: yan123cdm');
        console.log('');
        console.log('Michel:');
        console.log('  Email: michel@cdm.local');
        console.log('  Senha: michel123cdm');
        console.log('\n🔐 Todas as senhas devem ser alteradas no primeiro acesso!');

    } catch (error) {
        console.error('❌ Erro durante a execução:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Conexão com o banco encerrada.');
        }
    }
}

// Executar o script
if (require.main === module) {
    createAdminUsers().catch(console.error);
}

module.exports = { createAdminUsers };
