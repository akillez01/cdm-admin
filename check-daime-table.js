#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🔍 Verificando tabela daime_inventory especificamente...\n');

try {
  // Teste direto na tabela daime_inventory
  const { data, error } = await supabase
    .from('daime_inventory')
    .select('*')
    .limit(5);

  if (error) {
    console.log('❌ Erro ao acessar daime_inventory:');
    console.log('Mensagem:', error.message);
    console.log('Código:', error.code);
    console.log('Detalhes:', error.details);
    
    if (error.code === 'PGRST116') {
      console.log('\n🚫 A tabela "daime_inventory" não existe no banco de dados.');
      console.log('\n📋 SOLUÇÃO:');
      console.log('1. Acesse o Supabase Dashboard: https://app.supabase.com');
      console.log('2. Vá para seu projeto');
      console.log('3. Clique em "SQL Editor"');
      console.log('4. Execute o seguinte SQL:');
      console.log(`
-- Criação da tabela daime_inventory
CREATE TABLE daime_inventory (
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

-- Habilitar RLS
ALTER TABLE daime_inventory ENABLE ROW LEVEL SECURITY;

-- Policies básicas
CREATE POLICY "Enable read for authenticated users" ON daime_inventory
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON daime_inventory
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON daime_inventory
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON daime_inventory
FOR DELETE USING (auth.role() = 'authenticated');

-- Dados de exemplo
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
);
      `);
    }
  } else {
    console.log('✅ Tabela daime_inventory encontrada!');
    console.log(`📊 Registros encontrados: ${data.length}`);
    if (data.length > 0) {
      console.log('\n📋 Primeiros registros:');
      data.forEach((item, index) => {
        console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L`);
      });
    }
  }
  
} catch (err) {
  console.log('❌ Erro crítico:', err.message);
}
