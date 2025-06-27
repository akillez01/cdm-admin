// Diagnóstico completo do sistema de inventário
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xkkbeilbthmezeqizcch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnoseInventorySystem() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO DO SISTEMA DE INVENTÁRIO ===\n');

  try {
    // 1. Testar inventory_items
    console.log('📦 1. Testando tabela inventory_items...');
    const { data: invData, error: invError } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(3);

    if (invError) {
      console.error('❌ Erro inventory_items:', invError.message);
    } else {
      console.log(`✅ inventory_items: ${invData.length} itens encontrados`);
      console.log('📋 Estrutura dos dados:');
      if (invData.length > 0) {
        console.log('   Campos disponíveis:', Object.keys(invData[0]));
        console.log('   Exemplo:', JSON.stringify(invData[0], null, 2));
      }
    }

    // 2. Testar daime_inventory  
    console.log('\n🍃 2. Testando tabela daime_inventory...');
    const { data: daimeData, error: daimeError } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(3);

    if (daimeError) {
      console.error('❌ Erro daime_inventory:', daimeError.message);
    } else {
      console.log(`✅ daime_inventory: ${daimeData.length} itens encontrados`);
      console.log('📋 Estrutura dos dados:');
      if (daimeData.length > 0) {
        console.log('   Campos disponíveis:', Object.keys(daimeData[0]));
        console.log('   Exemplo:', JSON.stringify(daimeData[0], null, 2));
      }
    }

    // 3. Testar inserção de um item de teste
    console.log('\n🧪 3. Testando inserção de item de teste...');
    const testItem = {
      name: 'Teste Diagnóstico',
      category: 'Teste',
      quantity: 1,
      location: 'Local Teste',
      value: 10.0,
      status: 'available'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('inventory_items')
      .insert(testItem)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Erro na inserção:', insertError.message);
    } else {
      console.log('✅ Inserção bem-sucedida:', insertData.id);
      
      // Limpar o item de teste
      await supabase.from('inventory_items').delete().eq('id', insertData.id);
      console.log('🧹 Item de teste removido');
    }

    // 4. Verificar políticas RLS
    console.log('\n🔒 4. Verificando políticas de segurança...');
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies', { table_name: 'inventory_items' })
      .limit(5);

    if (policyError) {
      console.log('⚠️  Não foi possível verificar políticas:', policyError.message);
    } else {
      console.log('✅ Políticas verificadas');
    }

  } catch (error) {
    console.error('❌ Erro geral no diagnóstico:', error);
  }

  console.log('\n🎯 === DIAGNÓSTICO CONCLUÍDO ===');
}

diagnoseInventorySystem();
