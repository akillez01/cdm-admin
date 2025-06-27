#!/usr/bin/env node

/**
 * Script para criar a tabela daime_inventory no Supabase usando API HTTP
 */

import { config } from 'dotenv';
import fetch from 'node-fetch';

// Carregar variáveis de ambiente
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://xkkbeilbthmezeqizcch.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODEwODIzOCwiZXhwIjoyMDYzNjg0MjM4fQ.oimqdYXE4BJ5Qh3Y9vfHjsN0TMcPqUlk15UEIVKHtTE';

console.log('🚀 Criando tabela daime_inventory no Supabase...\n');

async function createTableViaSQL() {
  const sql = `
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

-- Habilitar RLS
ALTER TABLE daime_inventory ENABLE ROW LEVEL SECURITY;

-- Policies básicas (permissivas para desenvolvimento)
DROP POLICY IF EXISTS "Enable all for authenticated users" ON daime_inventory;
CREATE POLICY "Enable all for authenticated users" ON daime_inventory
FOR ALL USING (true) WITH CHECK (true);
  `;

  try {
    console.log('📤 Enviando SQL para o Supabase...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY
      },
      body: JSON.stringify({ sql })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API não suportada, usando método manual...');
      console.log('\n📋 EXECUTE ESTE SQL NO SUPABASE DASHBOARD:');
      console.log('='.repeat(80));
      console.log(sql);
      console.log('='.repeat(80));
      return false;
    }

    const result = await response.json();
    console.log('✅ SQL executado com sucesso!', result);
    return true;

  } catch (error) {
    console.log('❌ Erro na API, usando método manual...');
    console.log('\n📋 EXECUTE ESTE SQL NO SUPABASE DASHBOARD:');
    console.log('='.repeat(80));
    console.log(sql);
    console.log('='.repeat(80));
    return false;
  }
}

async function insertSampleData() {
  console.log('\n📝 Tentando inserir dados de exemplo...');
  
  const sampleData = [
    {
      codigo: 'DM001',
      graduacao: 'Força 3',
      litros: 15.5,
      data_feitio: '2024-12-15',
      responsavel_feitio: 'Padrinho João',
      local_feitio: 'Casa de Feitio - Núcleo Central',
      tipo_feitio: 'Concentração',
      panela: 'Panela 1',
      observacoes: 'Feitio realizado com jagube do Rio Jordão',
      status: 'disponivel',
      local_armazenamento: 'Despensa Principal - Prateleira A',
      temperatura: 18.0,
      ph: 3.2,
      cor: 'Marrom',
      consistencia: 'Densa'
    },
    {
      codigo: 'DM002',
      graduacao: 'Força 4',
      litros: 8.2,
      data_feitio: '2024-11-28',
      responsavel_feitio: 'Madrinha Maria',
      local_feitio: 'Casa de Feitio - Núcleo Norte',
      tipo_feitio: 'Novo',
      panela: 'Panela 2',
      observacoes: 'Primeira força do ano, muito concentrada',
      status: 'reservado',
      local_armazenamento: 'Despensa Principal - Prateleira B',
      temperatura: 16.0,
      ph: 3.1,
      cor: 'Marrom Escuro',
      consistencia: 'Muito Densa'
    },
    {
      codigo: 'DM003',
      graduacao: 'Força 2',
      litros: 22.0,
      data_feitio: '2024-10-05',
      responsavel_feitio: 'Padrinho Carlos',
      local_feitio: 'Casa de Feitio - Núcleo Sul',
      tipo_feitio: 'Novo',
      panela: 'Panela 3',
      observacoes: 'Feitio para iniciantes, suave e equilibrado',
      status: 'disponivel',
      local_armazenamento: 'Despensa Secundária - Prateleira C',
      temperatura: 20.0,
      ph: 3.3,
      cor: 'Amarelo',
      consistencia: 'Líquida'
    }
  ];

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/daime_inventory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(sampleData)
    });

    if (response.ok) {
      console.log('✅ Dados de exemplo inseridos com sucesso!');
      return true;
    } else {
      const errorText = await response.text();
      console.log('⚠️ Erro ao inserir dados:', errorText);
      if (errorText.includes('duplicate') || errorText.includes('unique')) {
        console.log('ℹ️  (Dados já existem - OK)');
        return true;
      }
      return false;
    }
  } catch (error) {
    console.log('⚠️ Erro ao inserir dados:', error.message);
    return false;
  }
}

async function verifyTable() {
  console.log('\n🔍 Verificando se a tabela foi criada...');
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/daime_inventory?limit=3`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Tabela funcionando! ${data.length} registros encontrados.`);
      
      if (data.length > 0) {
        console.log('\n📋 Registros encontrados:');
        data.forEach((item, index) => {
          console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L`);
        });
      }
      
      console.log('\n🎉 TABELA DAIME_INVENTORY CRIADA COM SUCESSO!');
      console.log('📋 Próximos passos:');
      console.log('1. Execute: npm run dev');
      console.log('2. Acesse a página "Inventário do Daime"');
      console.log('3. Teste adicionar/editar/excluir itens');
      
      return true;
    } else {
      console.log('❌ Tabela não encontrada ou erro de acesso');
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar tabela:', error.message);
    return false;
  }
}

// Executar processo completo
async function main() {
  const tableCreated = await createTableViaSQL();
  
  // Se não conseguiu criar via API, instruir criação manual
  if (!tableCreated) {
    console.log('\n💡 INSTRUÇÕES PARA CRIAÇÃO MANUAL:');
    console.log('1. Acesse https://app.supabase.com');
    console.log('2. Entre no seu projeto');
    console.log('3. Clique em "SQL Editor"');
    console.log('4. Cole e execute o SQL mostrado acima');
    console.log('5. Depois execute: node test-daime-functionality.js');
    return;
  }
  
  // Tentar inserir dados de exemplo
  await insertSampleData();
  
  // Verificar resultado final
  await verifyTable();
}

main().catch(console.error);
