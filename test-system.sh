#!/bin/bash

# Script de Teste - CDM Admin
# Verifica se o sistema está funcionando corretamente

echo "🧪 Testando Sistema CDM Admin"
echo "=============================="

# Verificar se as dependências estão instaladas
echo "📦 Verificando dependências..."

if [ ! -d "node_modules" ]; then
    echo "❌ Dependências do frontend não instaladas. Execute: npm install"
    exit 1
fi

if [ ! -d "server/node_modules" ]; then
    echo "❌ Dependências do servidor não instaladas. Execute: cd server && npm install"
    exit 1
fi

echo "✅ Dependências instaladas"

# Verificar arquivo .env
if [ ! -f "server/.env" ]; then
    echo "❌ Arquivo server/.env não encontrado"
    echo "   Execute: cp server/.env.example server/.env"
    echo "   E configure as variáveis do banco de dados"
    exit 1
fi

echo "✅ Arquivo .env encontrado"

# Verificar se as portas estão livres
if lsof -i :3001 >/dev/null 2>&1; then
    echo "⚠️  Porta 3001 já está em uso (servidor)"
else
    echo "✅ Porta 3001 livre"
fi

if lsof -i :5173 >/dev/null 2>&1; then
    echo "⚠️  Porta 5173 já está em uso (frontend)"
else
    echo "✅ Porta 5173 livre"
fi

# Testar conexão com o banco
echo ""
echo "🗄️  Testando conexão com o banco..."

# Carregar variáveis do .env
export $(cat server/.env | grep -v ^# | xargs)

if command -v mysql >/dev/null 2>&1; then
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "USE $DB_NAME; SELECT 1;" >/dev/null 2>&1; then
        echo "✅ Conexão com banco funcionando"
        
        # Verificar se as tabelas existem
        TABLE_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -D"$DB_NAME" -se "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = '$DB_NAME';")
        
        if [ "$TABLE_COUNT" -gt 0 ]; then
            echo "✅ Tabelas encontradas no banco ($TABLE_COUNT tabelas)"
        else
            echo "⚠️  Nenhuma tabela encontrada. Execute o script SQL para criar as tabelas."
        fi
    else
        echo "❌ Erro na conexão com o banco. Verifique as configurações em server/.env"
    fi
else
    echo "⚠️  MySQL client não encontrado. Não foi possível testar conexão com banco."
fi

echo ""
echo "🚀 Iniciando testes de funcionamento..."

# Iniciar servidor em background
echo "📡 Iniciando servidor..."
cd server
npm start > ../test-server.log 2>&1 &
SERVER_PID=$!
cd ..

# Aguardar servidor inicializar
sleep 5

# Testar se servidor está respondendo
echo "🔍 Testando se servidor está respondendo..."
if curl -s http://localhost:3001/api >/dev/null 2>&1; then
    echo "✅ Servidor respondendo na porta 3001"
else
    echo "❌ Servidor não está respondendo"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Testar login
echo "🔐 Testando login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@cdm.local","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo "✅ Login funcionando"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "🔑 Token obtido com sucesso"
else
    echo "❌ Erro no login:"
    echo "$LOGIN_RESPONSE"
fi

# Testar rota protegida
if [ ! -z "$TOKEN" ]; then
    echo "🛡️  Testando rota protegida..."
    AUTH_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/auth/me)
    
    if echo "$AUTH_RESPONSE" | grep -q "admin"; then
        echo "✅ Rotas protegidas funcionando"
    else
        echo "❌ Erro em rotas protegidas:"
        echo "$AUTH_RESPONSE"
    fi
fi

# Parar servidor
echo "🛑 Parando servidor de teste..."
kill $SERVER_PID 2>/dev/null
sleep 2

# Limpar logs de teste
rm -f test-server.log

echo ""
echo "📊 Resumo dos Testes:"
echo "===================="

if [ -f "server/.env" ] && [ -d "node_modules" ] && [ -d "server/node_modules" ]; then
    echo "✅ Configuração: OK"
else
    echo "❌ Configuração: Incompleta"
fi

if [ ! -z "$TOKEN" ]; then
    echo "✅ Autenticação: OK"
else
    echo "❌ Autenticação: Falhou"
fi

echo ""
echo "🎯 Para iniciar o sistema completo:"
echo "  Terminal 1: npm run server:dev"
echo "  Terminal 2: npm run dev"
echo ""
echo "🌐 Acesse: http://localhost:5173"
echo ""

if [ ! -z "$TOKEN" ]; then
    echo "🎉 Sistema testado e funcionando!"
    exit 0
else
    echo "⚠️  Sistema com problemas. Verifique os logs acima."
    exit 1
fi
