-- Script para aplicar diretamente no SQL Editor do Supabase
-- Copie e cole no console SQL do seu projeto Supabase

-- Criação da tabela para inventário do Sacramento do Daime
CREATE TABLE IF NOT EXISTS daime_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  graduacao TEXT NOT NULL CHECK (graduacao IN ('Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5')),
  litros DECIMAL(8,2) NOT NULL CHECK (litros >= 0),
  data_feitio DATE NOT NULL,
  responsavel_feitio TEXT NOT NULL,
  local_feitio TEXT,
  tipo_feitio TEXT DEFAULT 'Novo' CHECK (tipo_feitio IN ('Novo', 'Concentração', 'Reforço')),
  panela TEXT,
  observacoes TEXT,
  status TEXT DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'reservado', 'consumido', 'vencido')),
  data_validade DATE,
  local_armazenamento TEXT,
  temperatura DECIMAL(4,1),
  ph DECIMAL(3,1) CHECK (ph >= 0 AND ph <= 14),
  cor TEXT DEFAULT 'Amarelo' CHECK (cor IN ('Amarelo', 'Marrom Claro', 'Marrom', 'Marrom Escuro', 'Roxo')),
  consistencia TEXT DEFAULT 'Líquida' CHECK (consistencia IN ('Líquida', 'Densa', 'Muito Densa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_daime_inventory_codigo ON daime_inventory(codigo);
CREATE INDEX IF NOT EXISTS idx_daime_inventory_status ON daime_inventory(status);
CREATE INDEX IF NOT EXISTS idx_daime_inventory_graduacao ON daime_inventory(graduacao);
CREATE INDEX IF NOT EXISTS idx_daime_inventory_data_feitio ON daime_inventory(data_feitio);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_daime_inventory_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_daime_inventory_updated_at 
  BEFORE UPDATE ON daime_inventory 
  FOR EACH ROW 
  EXECUTE FUNCTION update_daime_inventory_updated_at();

-- Políticas de segurança (RLS)
ALTER TABLE daime_inventory ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Usuários autenticados podem ler inventário do Daime" ON daime_inventory;
DROP POLICY IF EXISTS "Admins podem inserir inventário do Daime" ON daime_inventory;
DROP POLICY IF EXISTS "Admins podem editar inventário do Daime" ON daime_inventory;
DROP POLICY IF EXISTS "Admins podem deletar inventário do Daime" ON daime_inventory;

-- Policy para leitura - todos usuários autenticados podem ver
CREATE POLICY "Usuários autenticados podem ler inventário do Daime"
ON daime_inventory
FOR SELECT
TO authenticated
USING (true);

-- Policy para inserção - apenas administradores
CREATE POLICY "Admins podem inserir inventário do Daime"
ON daime_inventory
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy para atualização - apenas administradores
CREATE POLICY "Admins podem editar inventário do Daime"
ON daime_inventory
FOR UPDATE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Policy para exclusão - apenas administradores
CREATE POLICY "Admins podem deletar inventário do Daime"
ON daime_inventory
FOR DELETE
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Inserção de dados de exemplo
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
)
ON CONFLICT (codigo) DO NOTHING;

-- Verificar se a tabela foi criada corretamente
SELECT 'Tabela daime_inventory criada com sucesso!' as message;
SELECT COUNT(*) as total_registros FROM daime_inventory;
