#!/usr/bin/env node
/**
 * Teste para verificar se o frontend consegue acessar o Supabase
 * Simula o comportamento do useSupabase hook
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🧪 === TESTE FRONTEND SUPABASE ===');
console.log('🔧 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NÃO DEFINIDA');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não definidas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInventoryMapping() {
  console.log('\n📦 1. Testando getInventory() com mapeamento...');
  
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro no Supabase:', error);
      return;
    }

    console.log(`✅ ${data.length} itens brutos do Supabase`);
    
    // Aplicar o mesmo mapeamento do useSupabase.ts
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

    console.log('🔄 Exemplo do item mapeado:');
    console.log(JSON.stringify(mappedData[0], null, 2));
    
    return mappedData;
  } catch (error) {
    console.error('❌ Erro na função:', error);
  }
}

async function testDaimeMapping() {
  console.log('\n🍃 2. Testando getDaimeInventory() com mapeamento...');
  
  try {
    const { data, error } = await supabase
      .from('daime_inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erro no Supabase:', error);
      return;
    }

    console.log(`✅ ${data.length} itens brutos do Supabase`);
    
    // Aplicar o mesmo mapeamento do useSupabase.ts
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

    console.log('🔄 Exemplo do item mapeado:');
    console.log(JSON.stringify(mappedData[0], null, 2));
    
    return mappedData;
  } catch (error) {
    console.error('❌ Erro na função:', error);
  }
}

async function runTests() {
  const inventory = await testInventoryMapping();
  const daimeInventory = await testDaimeMapping();
  
  console.log('\n🎯 === RESULTADO ===');
  console.log(`📦 Inventário: ${inventory ? inventory.length : 0} itens`);
  console.log(`🍃 Daime: ${daimeInventory ? daimeInventory.length : 0} itens`);
  
  if (inventory && inventory.length > 0 && daimeInventory && daimeInventory.length > 0) {
    console.log('✅ Mapeamento funcionando corretamente!');
  } else {
    console.log('❌ Problemas no mapeamento');
  }
}

runTests().catch(console.error);
