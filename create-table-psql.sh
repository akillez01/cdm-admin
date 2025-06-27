#!/bin/bash

# Script para conectar diretamente ao PostgreSQL do Supabase
# Requer instalação do postgresql-client

echo "🚀 Criando tabela daime_inventory via psql..."
echo "⚠️  Você precisa ter o postgresql-client instalado"
echo "   Ubuntu/Debian: sudo apt install postgresql-client"
echo "   Fedora/RHEL: sudo dnf install postgresql"

# Carrega variáveis do .env
source .env

# Extrair dados da URL do Supabase
PROJECT_ID=$(echo $VITE_SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')
DB_HOST="db.${PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

echo ""
echo "📋 Configuração da conexão:"
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

read -p "Digite a senha do banco PostgreSQL: " -s DB_PASSWORD
echo ""

# Criar arquivo SQL temporário
cat > /tmp/create_daime_table.sql << 'EOF'
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

-- Verificar resultado
SELECT COUNT(*) AS total_registros FROM daime_inventory;
SELECT codigo, graduacao, litros, status FROM daime_inventory LIMIT 3;
EOF

echo "📤 Executando SQL no banco..."
export PGPASSWORD="$DB_PASSWORD"

psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f /tmp/create_daime_table.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Tabela criada com sucesso!"
  echo "🎉 Execute: npm run dev"
else
  echo ""
  echo "❌ Erro na execução"
  echo "💡 Verifique se:"
  echo "   1. postgresql-client está instalado"
  echo "   2. A senha está correta"
  echo "   3. O firewall permite conexão"
fi

# Limpar arquivo temporário
rm -f /tmp/create_daime_table.sql
unset PGPASSWORD
