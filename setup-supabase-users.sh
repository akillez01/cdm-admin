#!/bin/bash

# Script para criar usuários administradores no Supabase
# CDM Admin - Setup de Usuários

echo "🚀 CDM Admin - Setup de Usuários Administradores no Supabase"
echo "============================================================"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Verificar se o arquivo .env.local existe
if [ ! -f ".env.local" ]; then
    log_error "Arquivo .env.local não encontrado!"
    echo "Crie o arquivo .env.local com as configurações do Supabase."
    exit 1
fi

# Carregar variáveis do .env.local
source .env.local

# Verificar configurações do Supabase
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    log_error "Configurações do Supabase não encontradas no .env.local"
    echo "Verifique se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas."
    exit 1
fi

log_info "Configurações do Supabase encontradas:"
echo "URL: $VITE_SUPABASE_URL"
echo "Key: ${VITE_SUPABASE_ANON_KEY:0:20}..."

echo ""
log_warning "IMPORTANTE: Para criar usuários no Supabase, você precisa:"
echo "1. Acessar o dashboard do Supabase: https://supabase.com/dashboard"
echo "2. Ir para o seu projeto: $(basename $VITE_SUPABASE_URL)"
echo "3. Navegar para Authentication > Users"
echo "4. Clicar em 'Add user' para cada administrador"
echo ""

echo "📋 Usuários que devem ser criados:"
echo "=================================="
echo "1. Email: yan@cdm.com"
echo "   Nome: Yan"
echo "   Role: Admin"
echo "   Senha: [definir uma senha segura]"
echo ""
echo "2. Email: michel@cdm.com"
echo "   Nome: Michel"
echo "   Role: Admin"
echo "   Senha: [definir uma senha segura]"
echo ""
echo "3. Email: admin@cdm.com"
echo "   Nome: Administrador"
echo "   Role: Admin"
echo "   Senha: [definir uma senha segura]"
echo ""

log_info "Passos para criar os usuários:"
echo "1. Acesse: https://supabase.com/dashboard/project/$(basename $VITE_SUPABASE_URL .supabase.co)/auth/users"
echo "2. Clique em 'Add user'"
echo "3. Preencha o email e senha"
echo "4. Confirme que o email está verificado"
echo "5. Repita para todos os usuários"

echo ""
log_success "Após criar os usuários, você poderá fazer login no sistema!"
echo ""

# Verificar se o frontend está rodando
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_success "Frontend está rodando em http://localhost:5173"
    echo "Você pode fazer login após criar os usuários no Supabase."
else
    log_info "Para iniciar o frontend, execute:"
    echo "npm run dev"
fi

echo ""
log_info "Para testar a autenticação após criar os usuários:"
echo "1. Acesse http://localhost:5173"
echo "2. Use um dos emails criados (yan@cdm.com, michel@cdm.com, ou admin@cdm.com)"
echo "3. Digite a senha que você definiu no Supabase"
echo ""

log_success "Setup concluído! ✨"
