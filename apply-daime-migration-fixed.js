#!/usr/bin/env node

/**
 * Script para criar tabela daime_inventory via terminal
 * Automatiza a criação da tabela e inserção de dados no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Verificando configuração atual...\n');

async function createTableViaTerminal() {
  // Verificar modo atual
  const useSupabase = process.env.VITE_USE_SUPABASE !== 'false';
  const apiUrl = process.env.VITE_API_URL;
  
  console.log('🔧 Configuração Atual:');
  console.log(`Modo Supabase: ${useSupabase ? '🔵 ATIVADO' : '❌ DESATIVADO'}`);
  console.log(`API URL: ${apiUrl || 'NÃO DEFINIDA'}`);
  console.log(`Supabase URL: ${SUPABASE_URL ? '✅ Configurado' : '❌ Não configurado'}`);
  console.log('');
  
  if (!useSupabase) {
    console.log('⚠️  ATENÇÃO: Você está no modo API MySQL!');
    console.log('');
    console.log('📋 Para resolver o erro 404, execute:');
    console.log('   ./quick.sh supabase');
    console.log('   node apply-daime-migration-fixed.js');
    return;
  }
  
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.log('❌ Credenciais do Supabase não encontradas no .env');
    return;
  }
  
  console.log('📋 Modo Supabase ativo. Tentando criar tabela automaticamente...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Primeiro, tentar criar a tabela usando RPC (função SQL personalizada)
    console.log('🔨 Tentando criar tabela via RPC...');
    
    // Função SQL para criar a tabela
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS daime_inventory (
        id SERIAL PRIMARY KEY,
        codigo VARCHAR(50) UNIQUE NOT NULL,
        graduacao VARCHAR(50) NOT NULL,
        litros DECIMAL(10,2) NOT NULL CHECK (litros > 0),
        data_feitio DATE NOT NULL DEFAULT CURRENT_DATE,
        responsavel_feitio VARCHAR(100) NOT NULL,
        local_feitio VARCHAR(150),
        tipo_feitio VARCHAR(50),
        panela VARCHAR(50),
        observacoes TEXT,
        status VARCHAR(20) NOT NULL DEFAULT 'disponivel',
        local_armazenamento VARCHAR(150) NOT NULL DEFAULT 'Altar Principal',
        temperatura DECIMAL(4,1),
        ph DECIMAL(3,1),
        cor VARCHAR(50),
        consistencia VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      -- Inserir dados de exemplo se a tabela estiver vazia
      INSERT INTO daime_inventory (codigo, graduacao, litros, data_feitio, responsavel_feitio, local_feitio, tipo_feitio, panela, observacoes, status, local_armazenamento, temperatura, ph, cor, consistencia)
      SELECT * FROM (VALUES 
        ('DM001', 'Força 3', 15.5, '2024-12-15', 'Padrinho João', 'Casa de Feitio - Núcleo Central', 'Concentração', 'Panela 1', 'Feitio realizado com jagube do Rio Jordão', 'disponivel', 'Despensa Principal - Prateleira A', 18.0, 3.2, 'Marrom', 'Densa'),
        ('DM002', 'Força 4', 8.2, '2024-11-28', 'Madrinha Maria', 'Casa de Feitio - Núcleo Norte', 'Novo', 'Panela 2', 'Primeira força do ano, muito concentrada', 'reservado', 'Despensa Principal - Prateleira B', 16.0, 3.1, 'Marrom Escuro', 'Muito Densa'),
        ('DM003', 'Força 2', 22.0, '2024-10-05', 'Padrinho Carlos', 'Casa de Feitio - Núcleo Sul', 'Novo', 'Panela 3', 'Feitio para iniciantes, suave e equilibrado', 'disponivel', 'Despensa Secundária - Prateleira C', 20.0, 3.3, 'Amarelo', 'Líquida')
      ) AS tmp(codigo, graduacao, litros, data_feitio, responsavel_feitio, local_feitio, tipo_feitio, panela, observacoes, status, local_armazenamento, temperatura, ph, cor, consistencia)
      WHERE NOT EXISTS (SELECT 1 FROM daime_inventory LIMIT 1);
    `;
    
    // Tentar executar via RPC
    const { data: rpcData, error: rpcError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (rpcError) {
      console.log('⚠️  RPC não disponível, tentando método alternativo...');
      
      // Método alternativo: tentar verificar se a tabela existe
      console.log('🔍 Verificando se a tabela já existe...');
      const { data: checkData, error: checkError } = await supabase
        .from('daime_inventory')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.code === 'PGRST116') {
        console.log('❌ Tabela não existe. Criação automática não possível via API.');
        console.log('\n📋 SOLUÇÃO MANUAL:');
        console.log('1. Acesse: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/sql');
        console.log('2. Cole e execute este SQL:');
        console.log('\n--- SQL PARA COPIAR ---');
        console.log(createTableSQL);
        console.log('--- FIM DO SQL ---\n');
        console.log('3. Depois execute: node apply-daime-migration-fixed.js');
        return;
      } else if (checkError) {
        console.log('❌ Erro ao verificar tabela:', checkError.message);
        return;
      } else {
        console.log('✅ Tabela já existe!');
      }
    } else {
      console.log('✅ Tabela criada via RPC!');
    }
    
    // Verificar dados existentes
    console.log('📊 Verificando dados existentes...');
    const { data: existingData, error: selectError } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(5);
    
    if (selectError) {
      console.log('❌ Erro ao consultar dados:', selectError.message);
      return;
    }
    
    if (existingData && existingData.length > 0) {
      console.log(`\n📋 ${existingData.length} registros encontrados:`);
      existingData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L - ${item.status}`);
      });
      
      console.log('\n🎉 TABELA PRONTA!');
      console.log('📋 Próximos passos:');
      console.log('1. Execute: npm run dev');
      console.log('2. Acesse a página "Inventário do Daime"');
      console.log('3. Teste adicionar/editar/excluir itens');
      return;
    }
    
    // Se não há dados, inserir exemplos
    console.log('📝 Inserindo dados de exemplo...');
    
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
      console.log('❌ Erro ao inserir dados:', insertError.message);
      return;
    }
    
    console.log(`✅ ${insertData.length} registros inseridos com sucesso!`);
    
    console.log('\n📋 Registros criados:');
    insertData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L - ${item.status}`);
    });
    
    console.log('\n🎉 SETUP COMPLETO!');
    console.log('📋 Próximos passos:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse a página "Inventário do Daime"');
    console.log('3. Teste adicionar/editar/excluir itens');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
    console.log('\n🔧 Solução manual necessária');
    console.log('Acesse: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/sql');
    console.log('E execute o SQL fornecido acima.');
  }
}

createTableViaTerminal();
