#!/usr/bin/env node
/**
 * Script simples para verificar por que a página de Inventário não está carregando
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🧪 === TESTE CARREGAMENTO PÁGINA INVENTÁRIO ===');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Simular o mesmo fluxo que a página faz
async function simulateInventoryPageLoad() {
  console.log('\n📦 1. Simulando useDataProvider.getInventory()...');
  
  try {
    // Simular o que acontece em useDataProvider quando shouldUseSupabase = true
    console.log('   → shouldUseSupabase = true (VITE_USE_SUPABASE=true)');
    console.log('   → Chamando supabaseHook.getInventory()...');
    
    // Simular exatamente o que está em useSupabase.ts
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      throw error;
    }

    console.log(`✅ Dados brutos: ${data.length} itens`);
    
    // Aplicar mapeamento exato do useSupabase.ts
    const mappedData = data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      location: item.location,
      value: item.value,
      supplier: item.supplier,
      purchaseDate: item.purchase_date,
      minQuantity: item.min_quantity,
      status: item.status,
      notes: item.notes
    }));

    console.log('✅ Dados mapeados:', mappedData.length, 'itens');
    console.log('📄 Primeiro item mapeado:');
    console.log(JSON.stringify(mappedData[0], null, 2));
    
    return mappedData;
    
  } catch (error) {
    console.error('❌ Erro na simulação:', error);
    throw error;
  }
}

async function simulateDaimeInventoryLoad() {
  console.log('\n🍃 2. Simulando useDataProvider.getDaimeInventory()...');
  
  try {
    console.log('   → Chamando supabaseHook.getDaimeInventory()...');
    
    const { data, error } = await supabase
      .from('daime_inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro do Supabase:', error);
      throw error;
    }

    console.log(`✅ Dados brutos: ${data.length} itens`);
    
    // Aplicar mapeamento exato do useSupabase.ts
    const mappedData = data.map(item => ({
      id: item.id,
      codigo: item.codigo,
      graduacao: item.graduacao,
      litros: parseFloat(item.litros),
      dataFeitio: item.data_feitio,
      responsavelFeitio: item.responsavel_feitio,
      localFeitio: item.local_feitio,
      tipoFeitio: item.tipo_feitio,
      panela: item.panela,
      observacoes: item.observacoes,
      status: item.status,
      dataValidade: item.data_validade,
      localArmazenamento: item.local_armazenamento,
      temperatura: item.temperatura ? parseFloat(item.temperatura) : undefined,
      ph: item.ph ? parseFloat(item.ph) : undefined,
      cor: item.cor,
      consistencia: item.consistencia,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));

    console.log('✅ Dados mapeados:', mappedData.length, 'itens');
    console.log('📄 Primeiro item mapeado:');
    console.log(JSON.stringify(mappedData[0], null, 2));
    
    return mappedData;
    
  } catch (error) {
    console.error('❌ Erro na simulação:', error);
    throw error;
  }
}

async function runSimulation() {
  try {
    const inventoryData = await simulateInventoryPageLoad();
    const daimeData = await simulateDaimeInventoryLoad();
    
    console.log('\n🎯 === RESULTADO DA SIMULAÇÃO ===');
    console.log(`📦 Inventário: ${inventoryData.length} itens carregados`);
    console.log(`🍃 Daime: ${daimeData.length} itens carregados`);
    
    if (inventoryData.length > 0 && daimeData.length > 0) {
      console.log('✅ SUCESSO: Dados carregados corretamente!');
      console.log('🤔 Se a página não está mostrando os dados, o problema pode ser:');
      console.log('   1. Erro de renderização no React');
      console.log('   2. Estado não sendo atualizado corretamente');
      console.log('   3. Componente caindo no fallback de dados mock');
      console.log('   4. Console mostrando logs mas dados não chegando na UI');
    } else {
      console.log('❌ PROBLEMA: Alguns dados não foram carregados');
    }
    
  } catch (error) {
    console.error('❌ ERRO GERAL:', error);
  }
}

runSimulation();
