-- Criar tabela daime_inventory no Supabase
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
