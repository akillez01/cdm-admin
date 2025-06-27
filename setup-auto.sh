#!/bin/bash

# Script de Configuração Automática - CDM Admin
# Resolve o problema do Supabase automaticamente

echo "🚀 Configuração Automática CDM Admin"
echo "===================================="

# Verificar se estamos na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto CDM Admin"
    exit 1
fi

# 1. Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis de ambiente..."
cat > .env << EOF
# Configuração automática - CDM Admin
VITE_USE_SUPABASE=false
VITE_API_URL=http://localhost:3001/api

# App
VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin - Dev
VITE_APP_VERSION=1.0.0-dev

# Fallback Supabase
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo
EOF

echo "✅ Arquivo .env criado"

# 2. Limpar cache
echo "🧹 Limpando cache do Vite..."
rm -rf node_modules/.vite
rm -rf dist

# 3. Configurar backend
echo "🔧 Configurando backend..."
cd server

if [ ! -f ".env" ]; then
    echo "📝 Criando configuração do backend..."
    cat > .env << EOF
# Backend Development Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=cdm_admin
DB_PORT=3306
DB_SSL=false

JWT_SECRET=desenvolvimento_jwt_secret_chave_local_32_caracteres_minimo

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

LOG_LEVEL=debug
EOF
fi

# 4. Instalar dependências do backend se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    npm install
fi

cd ..

# 5. Verificar status
echo ""
echo "📊 Status da Configuração:"
echo "=========================="
echo "✅ Frontend configurado para usar API MySQL"
echo "✅ Cache limpo"
echo "✅ Backend configurado"

# 6. Verificar se MySQL está disponível
if command -v mysql >/dev/null 2>&1; then
    echo "✅ MySQL encontrado"
else
    echo "⚠️  MySQL não encontrado - será necessário instalar"
fi

# 7. Instruções finais
echo ""
echo "🎯 Próximos Passos:"
echo "=================="
echo "1. Iniciar backend:   ./start-dev-server.sh"
echo "2. Iniciar frontend:  npm run dev"
echo "3. Abrir navegador:   http://localhost:5173/cdm-admin"
echo ""
echo "🔍 Para verificar:"
echo "- Backend:  curl http://localhost:3001/api/stats"
echo "- Console:  Deve mostrar '🟢 Usando API MySQL'"
echo ""

# 8. Opção de iniciar automaticamente
read -p "🚀 Iniciar os serviços agora? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Iniciando serviços..."
    
    # Iniciar backend em background
    echo "📡 Iniciando backend..."
    cd server
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    echo "⏳ Aguardando backend inicializar..."
    sleep 5
    
    # Testar backend
    if curl -s http://localhost:3001/api/stats >/dev/null; then
        echo "✅ Backend rodando na porta 3001"
        
        echo "🌐 Iniciando frontend..."
        echo "💡 Use Ctrl+C para parar ambos os serviços"
        npm run dev
    else
        echo "❌ Backend não respondeu"
        echo "🔧 Verifique as configurações do banco de dados"
        kill $BACKEND_PID 2>/dev/null
    fi
else
    echo "✨ Configuração concluída!"
    echo "💡 Execute './start-dev-server.sh' quando estiver pronto"
fi
