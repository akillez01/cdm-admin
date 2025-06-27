#!/bin/bash

# Script para iniciar o servidor de desenvolvimento local
# Execute: ./start-dev-server.sh

echo "🚀 Iniciando servidor CDM Admin..."

# Verificar se estamos na pasta correta
if [ ! -f "server/package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    echo "📁 Certifique-se de estar em: /path/to/cdm-admin/"
    exit 1
fi

# Navegar para pasta do servidor
cd server

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do servidor..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
fi

# Verificar se existe arquivo .env
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo .env..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANTE: Configure o arquivo server/.env com suas credenciais!"
    echo "📝 Edite as seguintes variáveis:"
    echo "   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME"
    echo "   - JWT_SECRET"
    echo ""
    echo "💡 Exemplo de configuração para desenvolvimento local:"
    echo "   DB_HOST=localhost"
    echo "   DB_USER=root"
    echo "   DB_PASSWORD=sua_senha"
    echo "   DB_NAME=cdm_admin"
    echo ""
    read -p "Pressione Enter para continuar após configurar o .env..."
fi

# Verificar conexão com banco (opcional)
echo "🔍 Testando conexão com banco de dados..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306
        });
        
        await connection.execute('SELECT 1');
        await connection.end();
        console.log('✅ Conexão com banco OK');
        process.exit(0);
    } catch (error) {
        console.log('❌ Erro de conexão:', error.message);
        console.log('💡 Verifique as configurações do banco no .env');
        process.exit(1);
    }
}

testConnection();
" 2>/dev/null

if [ $? -ne 0 ]; then
    echo "⚠️  Aviso: Não foi possível testar a conexão com o banco"
    echo "   Certifique-se de que o banco MySQL está rodando"
    echo "   e as credenciais no .env estão corretas"
    echo ""
fi

# Iniciar servidor
echo "🎯 Iniciando servidor na porta 3001..."
echo "📍 API estará disponível em: http://localhost:3001/api"
echo "🔧 Modo: development"
echo ""
echo "Para parar o servidor: Ctrl+C"
echo "----------------------------------------"

npm run dev
