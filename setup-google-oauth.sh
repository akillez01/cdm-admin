#!/bin/bash

# Script para configurar Google OAuth no Supabase
# CDM Admin - Setup Google Authentication

echo "🔐 CDM Admin - Configuração Google OAuth no Supabase"
echo "===================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

echo ""
log_info "Para configurar o Google OAuth, você precisa:"

echo ""
echo "🚀 PASSO 1: Configurar Google Cloud Console"
echo "============================================"
echo "1. Acesse: https://console.cloud.google.com/"
echo "2. Crie um novo projeto ou selecione um existente"
echo "3. Ative a API 'Google+ API' ou 'Google Identity'"
echo "4. Vá para 'APIs & Services' > 'Credentials'"
echo "5. Clique em 'Create Credentials' > 'OAuth 2.0 Client ID'"
echo "6. Selecione 'Web application'"
echo "7. Configure as URLs de redirecionamento:"
echo "   - https://xkkbeilbthmezeqizcch.supabase.co/auth/v1/callback"
echo "   - http://localhost:3000/auth/callback (para desenvolvimento)"
echo "8. Copie o Client ID e Client Secret"

echo ""
echo "🔧 PASSO 2: Configurar Supabase"
echo "================================"
echo "1. Acesse: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers"
echo "2. Encontre 'Google' na lista de provedores"
echo "3. Ative o provedor Google"
echo "4. Cole o Client ID do Google"
echo "5. Cole o Client Secret do Google"
echo "6. Salve as configurações"

echo ""
echo "👥 PASSO 3: Criar Usuários Administradores"
echo "==========================================="
echo "Acesse: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users"
echo ""
echo "Crie os seguintes usuários:"
echo "1. Email: yan@cdm.com (senha: sua escolha)"
echo "2. Email: michel@cdm.com (senha: sua escolha)"
echo "3. Email: admin@cdm.com (senha: sua escolha)"
echo ""
echo "✅ Marque 'Email confirmed' para cada usuário"

echo ""
echo "🌟 PASSO 4: (Opcional) Usuários Google"
echo "======================================"
echo "Para usar login via Google, os usuários podem:"
echo "1. Fazer login via Google com suas contas Gmail"
echo "2. Os emails autorizados via Google são:"
echo "   - yan.cdm@gmail.com"
echo "   - michel.cdm@gmail.com"
echo "   - admin.cdm@gmail.com"

echo ""
log_success "Após completar estes passos:"
echo "✅ Login com email/senha funcionará"
echo "✅ Login com Google funcionará"
echo "✅ Acesse: http://localhost:3000"

echo ""
log_info "URLs importantes:"
echo "🔗 Google Console: https://console.cloud.google.com/"
echo "🔗 Supabase Auth: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers"
echo "🔗 Supabase Users: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users"
echo "🔗 App Login: http://localhost:3000"

echo ""
log_warning "IMPORTANTE: Configure primeiro os usuários normais (email/senha) antes do Google OAuth"
echo "Isso garante que você possa acessar o sistema mesmo se houver problemas com o Google."

echo ""
log_success "Configuração preparada! Execute os passos acima para ativar todas as funcionalidades."
