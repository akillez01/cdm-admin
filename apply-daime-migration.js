#!/usr/bin/env console.log('🚀 Verificando configuração atual...\n');

async function createTableViaTerminal() {
  // Verificar modo atual
  const useSupabase = process.env.VITE_USE_SUPABASE !== 'false';
  const apiUrl = process.env.VITE_API_URL;
  
  console.log('🔧 Configuração Atual:');
  console.log(`Modo Supabase: ${useSupabase ? '🔵 ATIVADO' : '❌ DESATIVADO'}`);
  console.log(`API URL: ${apiUrl || 'NÃO DEFINIDA'}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log('');
  
  if (!useSupabase) {
    console.log('⚠️  ATENÇÃO: Você está no modo API MySQL!');
    console.log('');
    console.log('📋 OPÇÕES:');
    console.log('1. Para usar Supabase (resolver erro 404):');
    console.log('   - Execute: ./quick.sh supabase');
    console.log('   - Ou altere VITE_USE_SUPABASE=true no .env');
    console.log('   - Depois crie a tabela no Supabase Dashboard');
    console.log('');
    console.log('2. Para continuar com MySQL:');
    console.log('   - Certifique-se que o backend está rodando: cd server && npm start');
    console.log('   - Verifique se a API está acessível em:', apiUrl);
    console.log('');
    console.log('💡 Para resolver o erro 404 original, você precisa:');
    console.log('   - Trocar para modo Supabase OU');
    console.log('   - Garantir que o backend MySQL está funcionando');
    return;
  }
  
  console.log('📋 Modo Supabase ativo. Verificando tabela daime_inventory...');**
 * Script para criar tabela daime_inventory via terminal
 * Usa inserção direta via Supabase client (sem RPC)
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 Criando tabela daime_inventory via terminal...\n');

async function createTableViaTerminal() {
  console.log('� IMPORTANTE: Este script assume que a tabela JÁ FOI CRIADA no Supabase Dashboard');
  console.log('Se ainda não criou, execute primeiro:');
  console.log('   cat create_daime_inventory_table.sql');
  console.log('E cole o SQL no Supabase Dashboard\n');
  
  console.log('⏳ Aguardando 3 segundos...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  try {
    // Verificar se a tabela existe
    console.log('🔍 Verificando se a tabela existe...');
    const { data: checkData, error: checkError } = await supabase
      .from('daime_inventory')
      .select('count')
      .limit(1);
    
    if (checkError) {
      console.log('❌ Tabela não encontrada:', checkError.message);
      console.log('\n📋 SOLUÇÃO:');
      console.log('1. Acesse https://app.supabase.com');
      console.log('2. Vá para "SQL Editor" no seu projeto');
      console.log('3. Execute o conteúdo do arquivo: create_daime_inventory_table.sql');
      console.log('4. Depois execute este script novamente');
      return;
    }
    
    console.log('✅ Tabela encontrada!');
    
    // Verificar se já tem dados
    const { data: existingData } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(1);
    
    if (existingData && existingData.length > 0) {
      console.log('ℹ️  Dados já existem na tabela');
      
      const { data: allData } = await supabase
        .from('daime_inventory')
        .select('*')
        .limit(5);
      
      console.log(`\n📊 ${allData.length} registros encontrados:`);
      allData.forEach((item, index) => {
        console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L - ${item.status}`);
      });
      
      console.log('\n🎉 TABELA JÁ ESTÁ PRONTA!');
      console.log('Execute: npm run dev');
      return;
    }
    
    // Inserir dados se não existirem
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
    
    console.log('\n� Registros criados:');
    insertData.forEach((item, index) => {
      console.log(`${index + 1}. ${item.codigo} - ${item.graduacao} - ${item.litros}L - ${item.status}`);
    });
    
    console.log('\n🎉 SETUP COMPLETO!');
    console.log('📋 Próximos passos:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse a página "Inventário do Daime"');
    console.log('3. Teste adicionar/editar/excluir itens');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n� Use o método manual no Supabase Dashboard');
  }
}

createTableViaTerminal();
