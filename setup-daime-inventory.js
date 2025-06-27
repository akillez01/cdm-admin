#!/usr/bin/env node

/**
 * Script simplificado para criar dados na tabela daime_inventory
 * Primeiro crie a tabela manualmente no Supabase, depois execute este script
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🚀 Criando dados iniciais para daime_inventory...\n');

async function setupDaimeInventory() {
  console.log('📋 PRIMEIRO: Crie a tabela no Supabase Dashboard');
  console.log('1. Acesse https://app.supabase.com');
  console.log('2. Entre no seu projeto');
  console.log('3. Clique em "SQL Editor"');
  console.log('4. Execute este SQL:');
  console.log('\n' + '='.repeat(60));
  
  const createTableSQL = `-- Criar tabela daime_inventory
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

-- Desabilitar RLS temporariamente para desenvolvimento
ALTER TABLE daime_inventory DISABLE ROW LEVEL SECURITY;`;

  console.log(createTableSQL);
  console.log('='.repeat(60));
  
  console.log('\n⏳ Aguardando 10 segundos para você criar a tabela...');
  console.log('(Pressione Ctrl+C se precisar de mais tempo)');
  
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  console.log('\n🔍 Verificando se a tabela existe...');
  
  try {
    const { data, error } = await supabase
      .from('daime_inventory')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Tabela não encontrada:', error.message);
      console.log('\n💡 Execute o SQL acima primeiro, depois rode este script novamente.');
      return;
    }

    console.log('✅ Tabela encontrada! Inserindo dados...');

    // Dados de exemplo
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

    const { data: insertData, error: insertError } = await supabase
      .from('daime_inventory')
      .insert(sampleData)
      .select();

    if (insertError) {
      console.log('⚠️ Erro ao inserir dados:', insertError.message);
      if (insertError.code === '23505') {
        console.log('ℹ️  Dados já existem - tentando verificar...');
      } else {
        console.log('❌ Verifique se a tabela foi criada corretamente');
        return;
      }
    } else {
      console.log(`✅ ${insertData.length} registros inseridos com sucesso!`);
    }

    // Verificar resultado final
    const { data: finalData, error: finalError } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(5);

    if (finalError) {
      console.log('❌ Erro ao verificar dados:', finalError.message);
    } else {
      console.log(`\n📊 Total de registros na tabela: ${finalData.length}`);
      
      if (finalData.length > 0) {
        console.log('\n📋 Registros encontrados:');
        finalData.forEach((item, index) => {
          console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L - ${item.status}`);
        });
      }

      console.log('\n🎉 SETUP COMPLETO!');
      console.log('📋 Próximos passos:');
      console.log('1. Execute: npm run dev');
      console.log('2. Acesse a página "Inventário do Daime"');
      console.log('3. Teste adicionar/editar/excluir itens');
    }

  } catch (error) {
    console.log('❌ Erro durante o setup:', error.message);
    console.log('\n💡 Certifique-se de que:');
    console.log('1. A tabela foi criada no Supabase Dashboard');
    console.log('2. As credenciais estão corretas no .env');
    console.log('3. O projeto Supabase está ativo');
  }
}

setupDaimeInventory();
