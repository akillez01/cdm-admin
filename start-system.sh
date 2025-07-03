#!/bin/bash

echo "🚀 Iniciando CDM Admin - Sistema Completo"
echo "========================================"

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto CDM Admin"
    exit 1
fi

# Verificar dependências
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependências do servidor..."
    cd server && npm install && cd ..
fi

# Verificar arquivo .env do servidor
if [ ! -f "server/.env" ]; then
    echo "⚙️  Copiando arquivo .env.example..."
    cp server/.env.example server/.env
    echo "📝 IMPORTANTE: Configure as credenciais do banco em server/.env"
    echo "   Edite: server/.env"
fi

echo ""
echo "🗄️  Verificando banco de dados..."

# Carregar variáveis do .env se existir
if [ -f "server/.env" ]; then
    export $(cat server/.env | grep -v ^# | xargs) 2>/dev/null || true
fi

# Verificar se MySQL está rodando
if command -v mysql >/dev/null 2>&1; then
    echo "✅ MySQL encontrado"
    
    # Tentar conectar (sem mostrar erro se falhar)
    if mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" --password="${DB_PASSWORD}" -e "SELECT 1;" >/dev/null 2>&1; then
        echo "✅ Conexão com banco funcionando"
        
        # Verificar se banco existe
        if mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" --password="${DB_PASSWORD}" -e "USE ${DB_NAME:-cdm_admin};" >/dev/null 2>&1; then
            echo "✅ Banco '${DB_NAME:-cdm_admin}' existe"
            
            # Verificar se tabela users existe
            USER_TABLE_EXISTS=$(mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" --password="${DB_PASSWORD}" -D"${DB_NAME:-cdm_admin}" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '${DB_NAME:-cdm_admin}' AND table_name = 'users';" 2>/dev/null || echo "0")
            
            if [ "$USER_TABLE_EXISTS" -gt 0 ]; then
                echo "✅ Tabela 'users' existe"
                
                # Verificar usuários administradores
                ADMIN_COUNT=$(mysql -h"${DB_HOST:-localhost}" -P"${DB_PORT:-3306}" -u"${DB_USER:-root}" --password="${DB_PASSWORD}" -D"${DB_NAME:-cdm_admin}" -se "SELECT COUNT(*) FROM users WHERE role = 'admin';" 2>/dev/null || echo "0")
                
                if [ "$ADMIN_COUNT" -gt 0 ]; then
                    echo "✅ $ADMIN_COUNT usuário(s) administrador(es) encontrado(s)"
                else
                    echo "⚠️  Nenhum usuário administrador encontrado"
                    echo "   Execute: node scripts/create-admin-users.js"
                fi
            else
                echo "❌ Tabela 'users' não existe"
                echo "   Execute o script SQL: mysql -u root -p ${DB_NAME:-cdm_admin} < server/database/mysql_schema.sql"
            fi
        else
            echo "❌ Banco '${DB_NAME:-cdm_admin}' não existe"
            echo "   Crie o banco: CREATE DATABASE ${DB_NAME:-cdm_admin};"
        fi
    else
        echo "❌ Erro na conexão com MySQL"
        echo "   Verifique as credenciais em server/.env"
        echo "   Host: ${DB_HOST:-localhost}, Port: ${DB_PORT:-3306}, User: ${DB_USER:-root}"
    fi
else
    echo "⚠️  MySQL não encontrado. Instale MySQL para continuar."
fi

echo ""
echo "🚀 Iniciando serviços..."

# Função para cleanup ao sair
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $SERVER_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Capturar sinais para cleanup
trap cleanup SIGINT SIGTERM

# Iniciar servidor
echo "📡 Iniciando servidor na porta 3001..."
cd server
npm start > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Aguardar servidor inicializar
sleep 3

# Verificar se servidor está rodando
if curl -s http://localhost:3001/api >/dev/null 2>&1; then
    echo "✅ Servidor rodando na porta 3001"
else
    echo "❌ Erro ao iniciar servidor. Verificando logs..."
    tail -10 server.log
    exit 1
fi

# Iniciar frontend
echo "🌐 Iniciando frontend na porta 5173..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

# Aguardar frontend inicializar
sleep 3

echo ""
echo "🎉 Sistema iniciado com sucesso!"
echo "================================"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "📡 API: http://localhost:3001/api"
echo ""
echo "👥 Credenciais de teste:"
echo "  Yan: yan@cdm.local / yan123cdm"
echo "  Michel: michel@cdm.local / michel123cdm"
echo "  Admin: admin@cdm.local / admin123"
echo ""
echo "📝 Logs:"
echo "  Servidor: tail -f server.log"
echo "  Frontend: tail -f frontend.log"
echo ""
echo "🛑 Para parar: Ctrl+C"
echo ""

# Aguardar indefinidamente
wait
