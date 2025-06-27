#!/bin/bash

echo "🚀 Criando tabela daime_inventory via Supabase CLI..."
echo ""

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI não encontrado!"
  echo ""
  echo "📥 INSTALAÇÃO DO SUPABASE CLI:"
  echo ""
  echo "Via npm (recomendado):"
  echo "  npm install -g supabase"
  echo ""
  echo "Via Homebrew (macOS/Linux):"
  echo "  brew install supabase/tap/supabase"
  echo ""
  echo "Via curl (Linux):"
  echo "  curl -fsSL https://supabase.com/install.sh | sh"
  echo ""
  echo "Após instalar, execute este script novamente."
  exit 1
fi

echo "✅ Supabase CLI encontrado!"
echo ""

# Verificar se está logado
if ! supabase status &> /dev/null; then
  echo "🔑 Fazendo login no Supabase..."
  supabase login
fi

# Criar arquivo de migração
MIGRATION_FILE="supabase/migrations/$(date +%Y%m%d%H%M%S)_create_daime_inventory.sql"
mkdir -p supabase/migrations

cat > "$MIGRATION_FILE" << 'EOF'
-- Criar tabela daime_inventory
CREATE TABLE IF NOT EXISTS daime_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  graduacao TEXT NOT NULL,
  litros DECIMAL(8,2) NOT NULL,
  data_feitio DATE NOT NULL,
  responsavel_feitio TEXT NOT NULL,
  local_feitio TEXT,
  tipo_feitio TEXT DEFAULT 'Novo',
  panela TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'disponivel',
  data_validade DATE,
  local_armazenamento TEXT,
  temperatura DECIMAL(4,1),
  ph DECIMAL(3,1),
  cor TEXT DEFAULT 'Amarelo',
  consistencia TEXT DEFAULT 'Líquida',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desabilitar RLS para desenvolvimento
ALTER TABLE daime_inventory DISABLE ROW LEVEL SECURITY;

-- Inserir dados de exemplo
INSERT INTO daime_inventory (
  codigo, graduacao, litros, data_feitio, responsavel_feitio, 
  local_feitio, tipo_feitio, panela, observacoes, status,
  local_armazenamento, temperatura, ph, cor, consistencia
) VALUES 
(
  'DM001', 'Força 3', 15.5, '2024-12-15', 'Padrinho João',
  'Casa de Feitio - Núcleo Central', 'Concentração', 'Panela 1',
  'Feitio realizado com jagube do Rio Jordão', 'disponivel',
  'Despensa Principal - Prateleira A', 18.0, 3.2, 'Marrom', 'Densa'
),
(
  'DM002', 'Força 4', 8.2, '2024-11-28', 'Madrinha Maria',
  'Casa de Feitio - Núcleo Norte', 'Novo', 'Panela 2',
  'Primeira força do ano, muito concentrada', 'reservado',
  'Despensa Principal - Prateleira B', 16.0, 3.1, 'Marrom Escuro', 'Muito Densa'
),
(
  'DM003', 'Força 2', 22.0, '2024-10-05', 'Padrinho Carlos',
  'Casa de Feitio - Núcleo Sul', 'Novo', 'Panela 3',
  'Feitio para iniciantes, suave e equilibrado', 'disponivel',
  'Despensa Secundária - Prateleira C', 20.0, 3.3, 'Amarelo', 'Líquida'
);
EOF

echo "📝 Arquivo de migração criado: $MIGRATION_FILE"
echo ""

# Carregar variáveis do .env
source .env

# Extrair Project ID da URL
PROJECT_ID=$(echo $VITE_SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

echo "🔗 Conectando ao projeto: $PROJECT_ID"

# Aplicar migração
echo "📤 Aplicando migração..."
supabase db push --project-ref "$PROJECT_ID"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Migração aplicada com sucesso!"
  echo ""
  echo "🔍 Verificando resultado..."
  
  # Verificar dados
  echo "SELECT COUNT(*) FROM daime_inventory;" | supabase db query --project-ref "$PROJECT_ID"
  
  echo ""
  echo "🎉 TABELA CRIADA COM SUCESSO!"
  echo "📋 Execute: npm run dev"
else
  echo ""
  echo "❌ Erro na migração"
  echo "💡 Tente um dos outros métodos ou use o Dashboard"
fi
