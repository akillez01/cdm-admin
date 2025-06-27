#!/usr/bin/env node

/**
 * Script para criar a tabela daime_inventory no Supabase via API
 * Este script usa a API do Supabase para executar SQL diretamente
 */

import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Criando tabela daime_inventory no Supabase...\n');

console.log('📋 INSTRUÇÕES PARA CRIAR A TABELA:');
console.log('Como não podemos executar DDL com a anon key, você precisa:');
console.log('1. Acessar https://app.supabase.com');
console.log('2. Entrar no seu projeto');
console.log('3. Ir em "SQL Editor" no menu lateral');
console.log('4. Colar e executar o SQL abaixo:');

console.log('\n' + '='.repeat(80));
console.log('-- COLE ESTE SQL NO SUPABASE SQL EDITOR:');
console.log('='.repeat(80));

const createTableSQL = `
-- Criação da tabela daime_inventory
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

-- Habilitar Row Level Security
ALTER TABLE daime_inventory ENABLE ROW LEVEL SECURITY;

-- Policies para acesso
CREATE POLICY "Enable read for authenticated users" ON daime_inventory
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON daime_inventory
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON daime_inventory
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON daime_inventory
FOR DELETE USING (auth.role() = 'authenticated');

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
`;

console.log(createTableSQL);
console.log('='.repeat(80));

console.log('\n📋 DEPOIS DE EXECUTAR O SQL:');
console.log('1. Volte ao terminal');
console.log('2. Execute: node check-daime-table.js');
console.log('3. Se tudo estiver OK, execute: npm run dev');
console.log('4. Acesse a página de Inventário do Daime');

console.log('\n💡 DICA: Se você tiver problemas com as policies,');
console.log('pode desabilitar temporariamente o RLS com:');
console.log('ALTER TABLE daime_inventory DISABLE ROW LEVEL SECURITY;');
