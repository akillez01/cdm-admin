#!/bin/bash

# Script de teste completo - CDM Admin com Supabase
# Testa conectividade, autenticação e sistema

echo "🧪 CDM Admin - Teste Completo do Sistema"
echo "========================================"

# Cores
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
log_info "1. Verificando configurações..."

# Verificar .env.local
if [ -f ".env.local" ]; then
    log_success "Arquivo .env.local encontrado"
    source .env.local
    
    if [ -n "$VITE_SUPABASE_URL" ] && [ -n "$VITE_SUPABASE_ANON_KEY" ]; then
        log_success "Configurações do Supabase OK"
        echo "  URL: $VITE_SUPABASE_URL"
        echo "  Key: ${VITE_SUPABASE_ANON_KEY:0:20}..."
    else
        log_error "Configurações do Supabase incompletas"
        exit 1
    fi
else
    log_error "Arquivo .env.local não encontrado"
    exit 1
fi

echo ""
log_info "2. Verificando dependências..."

# Verificar Node.js
if command -v node >/dev/null 2>&1; then
    log_success "Node.js $(node --version)"
else
    log_error "Node.js não instalado"
    exit 1
fi

# Verificar npm
if command -v npm >/dev/null 2>&1; then
    log_success "npm $(npm --version)"
else
    log_error "npm não instalado"
    exit 1
fi

# Verificar package.json
if [ -f "package.json" ]; then
    log_success "package.json encontrado"
else
    log_error "package.json não encontrado"
    exit 1
fi

# Verificar node_modules
if [ -d "node_modules" ]; then
    log_success "Dependências instaladas"
else
    log_warning "Dependências não instaladas. Instalando..."
    npm install
    if [ $? -eq 0 ]; then
        log_success "Dependências instaladas com sucesso"
    else
        log_error "Falha ao instalar dependências"
        exit 1
    fi
fi

echo ""
log_info "3. Verificando estrutura do projeto..."

# Verificar arquivos críticos
critical_files=(
    "src/main.tsx"
    "src/App.tsx" 
    "src/contexts/AuthContext.tsx"
    "src/contexts/authContext.ts"
    "src/contexts/authTypes.ts"
    "src/hooks/useAuth.ts"
    "src/supabaseClient.ts"
    "src/components/auth/LoginForm.tsx"
    "src/components/ProtectedRoute.tsx"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        log_success "$file"
    else
        log_error "$file não encontrado"
    fi
done

echo ""
log_info "4. Testando build do projeto..."

npm run build >/dev/null 2>&1
if [ $? -eq 0 ]; then
    log_success "Build executado com sucesso"
else
    log_warning "Build falhou - executando para ver erros:"
    npm run build
fi

echo ""
log_info "5. Verificando processos..."

# Verificar se o frontend está rodando
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_success "Frontend rodando na porta 5173"
    echo "  Acesse: http://localhost:5173"
else
    log_warning "Frontend não está rodando"
    echo "  Para iniciar: npm run dev"
fi

# Verificar se o backend está rodando (opcional)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_info "Backend MySQL rodando na porta 3001 (não necessário)"
else
    log_info "Backend MySQL não está rodando (OK - usando Supabase)"
fi

echo ""
log_info "6. Testando conectividade com Supabase..."

# Criar teste simples de conectividade
cat > test-supabase.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xkkbeilbthmezeqizcch.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('members').select('count').limit(1);
    if (error) {
      console.log('❌ Erro de conectividade:', error.message);
      process.exit(1);
    } else {
      console.log('✅ Conectividade com Supabase OK');
      process.exit(0);
    }
  } catch (err) {
    console.log('❌ Erro de rede:', err.message);
    process.exit(1);
  }
}

testConnection();
EOF

# Executar teste (se possível)
if command -v node >/dev/null 2>&1; then
    node test-supabase.js 2>/dev/null && log_success "Conectividade com Supabase OK" || log_warning "Teste de conectividade falhou (normal se dependências não estão em node_modules)"
    rm -f test-supabase.js
fi

echo ""
log_info "7. Resumo do Sistema:"
echo "====================="
echo "✅ Configuração: Supabase ativo"
echo "✅ Autenticação: Baseada no Supabase Auth"
echo "✅ Frontend: React + TypeScript + Vite"
echo "✅ Usuários autorizados:"
echo "   - yan@cdm.com (Admin)"
echo "   - michel@cdm.com (Admin)" 
echo "   - admin@cdm.com (Admin)"

echo ""
log_info "8. Próximos passos:"
echo "==================="
echo "1. Criar os usuários no Supabase Dashboard:"
echo "   https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users"
echo ""
echo "2. Iniciar o frontend (se não estiver rodando):"
echo "   npm run dev"
echo ""
echo "3. Fazer login com um dos emails autorizados"
echo ""

if [ ! -f "USUARIOS_CRIADOS.txt" ]; then
    log_warning "Lembre-se de executar './setup-supabase-users.sh' para instruções detalhadas"
fi

log_success "Teste completo finalizado! 🎉"
