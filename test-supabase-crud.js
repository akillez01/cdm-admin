const { createClient } = require('@supabase/supabase-js');

// Configurar o cliente Supabase
const supabaseUrl = 'https://hfuvfnqfgtjfezwkgnhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXZmbnFmZ3RqZmV6d2tnbmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MzUzMDMsImV4cCI6MjA0NzIxMTMwM30.Z3oQUjIeYJJPNcH3QBGjKV0sHrTkqkbONQhsNsLzJmw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseSave() {
  console.log('🔍 Testando salvamento de item no Supabase...');
  
  try {
    // Teste 1: Verificar conexão
    console.log('\n1. Verificando conexão com Supabase...');
    const { data: testData, error: testError } = await supabase
      .from('inventory_items')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Erro de conexão:', testError);
      return;
    }
    
    console.log('✅ Conexão OK');
    
    // Teste 2: Simular o mesmo payload que o frontend envia
    console.log('\n2. Testando inserção com payload do frontend...');
    const frontendPayload = {
      name: 'Teste Frontend Debug',
      description: 'Item criado via script para debug do erro JSON',
      category: 'Teste',
      quantity: 5,
      unit: 'unidades',
      location: 'Armazém Debug',
      notes: 'Testando erro de salvamento em produção'
    };
    
    console.log('Payload:', JSON.stringify(frontendPayload, null, 2));
    
    const { data: insertData, error: insertError } = await supabase
      .from('inventory_items')
      .insert([frontendPayload])
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir:', insertError);
      console.error('Código:', insertError.code);
      console.error('Detalhes:', insertError.details);
      console.error('Dica:', insertError.hint);
      return;
    }
    
    console.log('✅ Item inserido com sucesso:', insertData[0]);
    const insertedId = insertData[0]?.id;
    
    // Teste 3: Simular atualização
    console.log('\n3. Testando atualização...');
    const updatePayload = {
      quantity: 10,
      notes: 'Item atualizado via script de debug'
    };
    
    const { data: updateData, error: updateError } = await supabase
      .from('inventory_items')
      .update(updatePayload)
      .eq('id', insertedId)
      .select();
    
    if (updateError) {
      console.error('❌ Erro ao atualizar:', updateError);
    } else {
      console.log('✅ Item atualizado:', updateData[0]);
    }
    
    // Teste 4: Limpar
    console.log('\n4. Removendo item de teste...');
    const { error: deleteError } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', insertedId);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar:', deleteError);
    } else {
      console.log('✅ Item removido com sucesso');
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

async function main() {
  console.log('🚀 Testando operações CRUD com Supabase...');
  await testSupabaseSave();
  console.log('\n📝 Teste concluído!');
}

main().catch(console.error);
