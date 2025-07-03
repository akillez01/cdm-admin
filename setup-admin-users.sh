#!/bin/bash

# Script de Configuração - CDM Admin
# Configura o ambiente e cria os usuários administradores

set -e

echo "🚀 Configurando CDM Admin - Sistema de Gestão da Igreja"
echo "========================================================="

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto CDM Admin"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Instale a versão 18 ou superior."
    exit 1
fi

echo "✅ Node.js versão: $(node --version)"

# Instalar dependências do frontend
echo ""
echo "📦 Instalando dependências do frontend..."
npm install

# Instalar dependências do servidor
echo ""
echo "📦 Instalando dependências do servidor..."
cd server
npm install
cd ..

# Verificar se existe arquivo .env no servidor
if [ ! -f "server/.env" ]; then
    echo ""
    echo "⚙️  Configurando variáveis de ambiente..."
    
    # Gerar chave JWT
    JWT_SECRET=$(openssl rand -base64 32 2>/dev/null || echo "sua_chave_jwt_super_secreta_$(date +%s)")
    
    # Criar arquivo .env
    cat > server/.env << EOF
# Configuração do Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cdm_admin
DB_PORT=3306
DB_SSL=false

# JWT Secret
JWT_SECRET=${JWT_SECRET}

# Configuração do Servidor
PORT=3001
NODE_ENV=development

# URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3001/api
EOF

    echo "✅ Arquivo .env criado em server/.env"
    echo "📝 Edite as configurações do banco de dados conforme necessário"
else
    echo "✅ Arquivo .env já existe"
fi

# Verificar se o banco está configurado
echo ""
echo "🗄️  Verificando configuração do banco de dados..."

# Verificar se MySQL está instalado
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL não encontrado. Certifique-se de ter o MySQL instalado e rodando."
    echo "   Você pode instalar com:"
    echo "   - Ubuntu: sudo apt install mysql-server"
    echo "   - macOS: brew install mysql"
    echo "   - Windows: Baixe do site oficial do MySQL"
fi

echo ""
echo "🎯 Próximos passos:"
echo "1. Certifique-se de que o MySQL está rodando"
echo "2. Configure as credenciais do banco em server/.env"
echo "3. Execute: node scripts/create-admin-users.js para criar os usuários administradores"
echo "4. Inicie o servidor: npm run server:dev"
echo "5. Inicie o frontend: npm run dev"

echo ""
echo "👥 Este script criará os seguintes usuários administradores:"
echo "   • Yan (yan@cdm.local / yan123cdm)"
echo "   • Michel (michel@cdm.local / michel123cdm)"

echo ""
read -p "🔑 Deseja criar os usuários administradores agora? (y/N): " create_users

if [[ $create_users =~ ^[Yy]$ ]]; then
    echo ""
    echo "🔐 Criando usuários administradores..."
    
    # Verificar se o banco existe
    echo "Certifique-se de que o banco 'cdm_admin' existe antes de continuar."
    read -p "O banco de dados 'cdm_admin' está criado e as tabelas estão configuradas? (y/N): " db_ready
    
    if [[ $db_ready =~ ^[Yy]$ ]]; then
        node scripts/create-admin-users.js
        echo ""
        echo "🎉 Usuários administradores criados com sucesso!"
    else
        echo "⚠️  Configure o banco de dados primeiro e execute depois:"
        echo "   node scripts/create-admin-users.js"
    fi
else
    echo "⏭️  Usuários não criados. Execute depois:"
    echo "   node scripts/create-admin-users.js"
fi

echo ""
echo "🚀 Configuração concluída!"
echo ""
echo "Para iniciar o projeto:"
echo "  Terminal 1: npm run server:dev  (porta 3001)"
echo "  Terminal 2: npm run dev         (porta 5173)"
echo ""
echo "Acesse: http://localhost:5173"
