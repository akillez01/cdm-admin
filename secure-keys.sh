#!/bin/bash

# Script para proteger chaves do Supabase
# Move chaves sensíveis para arquivos seguros

echo "🔐 Protegendo chaves do Supabase..."

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    exit 1
fi

# Backup do .env atual
cp .env .env.backup
echo "📋 Backup criado: .env.backup"

# Verificar se .env já está no .gitignore
if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
    echo ".env" >> .gitignore
    echo "🛡️  Arquivo .env adicionado ao .gitignore"
else
    echo "✅ Arquivo .env já está no .gitignore"
fi

# Verificar se outros arquivos sensíveis estão no .gitignore
SENSITIVE_FILES=(
    ".env.local"
    ".env.development"
    ".env.production"
    "server/.env"
    "server/.env.local"
    "server/.env.development" 
    "server/.env.production"
    "*.key"
    "*.pem"
    "*.p12"
    "*.pfx"
    "secrets/"
    ".vscode/settings.json"
)

echo "🔍 Verificando arquivos sensíveis no .gitignore..."

for file in "${SENSITIVE_FILES[@]}"; do
    if ! grep -q "^${file}$" .gitignore 2>/dev/null; then
        echo "$file" >> .gitignore
        echo "🛡️  Adicionado: $file"
    fi
done

# Criar .env.example sem as chaves reais
echo "📝 Criando .env.example..."

cat > .env.example << 'EOF'
# Configuração do Supabase (OBTENHA NO DASHBOARD)
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA_AQUI

# Configuração da API MySQL (se usar)
VITE_API_URL=http://localhost:3001/api

# Configurações da aplicação
VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin

# Ambiente
NODE_ENV=development
EOF

echo "✅ Arquivo .env.example criado"

# Verificar se as chaves estão expostas
echo ""
echo "🔍 VERIFICAÇÃO DE SEGURANÇA:"

if grep -q "VITE_SUPABASE_ANON_KEY=eyJ" .env 2>/dev/null; then
    echo "⚠️  CHAVE SUPABASE DETECTADA NO .ENV!"
    echo "   As chaves estão funcionando, mas certifique-se que:"
    echo "   1. O arquivo .env NÃO será commitado no git"
    echo "   2. Use variáveis de ambiente no servidor de produção"
    echo "   3. Considere rotacionar as chaves se foram expostas"
else
    echo "✅ Nenhuma chave sensível detectada no formato padrão"
fi

# Mostrar status do git
echo ""
echo "📊 STATUS DO GIT:"
if command -v git &> /dev/null && [ -d .git ]; then
    echo "🔍 Arquivos que serão ignorados pelo git:"
    git status --ignored | grep "\.env" || echo "   Nenhum arquivo .env detectado"
    
    echo ""
    echo "⚠️  Arquivos possivelmente sensíveis em staging:"
    git status --porcelain | grep -E "\.(env|key|pem|p12|pfx)" || echo "   Nenhum arquivo sensível em staging"
else
    echo "ℹ️  Git não inicializado neste diretório"
fi

echo ""
echo "🎯 RECOMENDAÇÕES DE SEGURANÇA:"
echo "1. ✅ Arquivos .env adicionados ao .gitignore"
echo "2. 🔄 Considere rotacionar chaves se foram expostas publicamente"
echo "3. 🏠 Use variáveis de ambiente no servidor de produção"
echo "4. 🚀 Para deploy, configure as variáveis no painel do Plesk/hosting"
echo "5. 📚 Documente as variáveis necessárias no README"

echo ""
echo "🔐 Proteção aplicada com sucesso!"
