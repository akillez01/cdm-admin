const { createClient } = require('@supabase/supabase-js');

// Configurar o cliente Supabase
const supabaseUrl = 'https://hfuvfnqfgtjfezwkgnhz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmdXZmbnFmZ3RqZmV6d2tnbmh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2MzUzMDMsImV4cCI6MjA0NzIxMTMwM30.Z3oQUjIeYJJPNcH3QBGjKV0sHrTkqkbONQhsNsLzJmw';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSaveInventoryItem() {
  console.log('🔍 Testando salvamento de item no Supabase...');
  
  try {
    // Teste 1: Verificar conexão com a tabela
    console.log('\n1. Verificando acesso à tabela inventory_items...');
    const { data: existingItems, error: selectError } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Erro ao acessar tabela:', selectError);
      return;
    }
    
    console.log('✅ Tabela acessível, itens existentes:', existingItems?.length || 0);
    
    // Teste 2: Simular salvamento de um novo item
    console.log('\n2. Testando inserção de novo item...');
    const newItem = {
      name: 'Item Teste Debug',
      description: 'Item criado para debug do erro de salvamento',
      category: 'Teste',
      quantity: 10,
      unit: 'unidades',
      minimum_stock: 5,
      location: 'Armazém Teste',
      notes: 'Criado via script de debug'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('inventory_items')
      .insert([newItem])
      .select();
    
    if (insertError) {
      console.error('❌ Erro ao inserir item:', insertError);
      console.error('Detalhes do erro:', JSON.stringify(insertError, null, 2));
      return;
    }
    
    console.log('✅ Item inserido com sucesso:', insertData);
    const insertedId = insertData[0]?.id;
    
    // Teste 3: Simular atualização do item
    console.log('\n3. Testando atualização do item...');
    const updateData = {
      quantity: 15,
      notes: 'Item atualizado via script de debug'
    };
    
    const { data: updateResult, error: updateError } = await supabase
      .from('inventory_items')
      .update(updateData)
      .eq('id', insertedId)
      .select();
    
    if (updateError) {
      console.error('❌ Erro ao atualizar item:', updateError);
      console.error('Detalhes do erro:', JSON.stringify(updateError, null, 2));
    } else {
      console.log('✅ Item atualizado com sucesso:', updateResult);
    }
    
    // Teste 4: Limpar o item de teste
    console.log('\n4. Removendo item de teste...');
    const { error: deleteError } = await supabase
      .from('inventory_items')
      .delete()
      .eq('id', insertedId);
    
    if (deleteError) {
      console.error('❌ Erro ao deletar item de teste:', deleteError);
    } else {
      console.log('✅ Item de teste removido com sucesso');
    }
    
  } catch (error) {
    console.error('❌ Erro geral durante os testes:', error);
  }
}

async function testAPIEndpoints() {
  console.log('\n🌐 Testando endpoints da API local...');
  
  const baseUrls = [
    'http://localhost:5000',
    'https://sleepy-allen.66-179-92-233.plesk.page'
  ];
  
  for (const baseUrl of baseUrls) {
    console.log(`\n📡 Testando: ${baseUrl}`);
    
    try {
      // Teste de health check
      const healthResponse = await fetch(`${baseUrl}/api/health`);
      console.log(`Health status: ${healthResponse.status}`);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.text();
        console.log('Health response:', healthData);
      }
      
      // Teste de GET inventory
      const getResponse = await fetch(`${baseUrl}/api/inventory`);
      console.log(`GET inventory status: ${getResponse.status}`);
      
      if (getResponse.ok) {
        const getData = await getResponse.text();
        console.log('GET response preview:', getData.substring(0, 200) + '...');
      } else {
        const errorText = await getResponse.text();
        console.log('GET error response:', errorText.substring(0, 500));
      }
      
      // Teste de POST inventory
      const postData = {
        name: 'Item Teste API',
        category: 'Teste',
        quantity: 1,
        unit: 'unidade'
      };
      
      const postResponse = await fetch(`${baseUrl}/api/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      });
      
      console.log(`POST inventory status: ${postResponse.status}`);
      const postResponseText = await postResponse.text();
      console.log('POST response:', postResponseText.substring(0, 500));
      
    } catch (error) {
      console.error(`❌ Erro ao testar ${baseUrl}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Iniciando diagnóstico do erro de salvamento...');
  
  await testSaveInventoryItem();
  await testAPIEndpoints();
  
  console.log('\n📝 Diagnóstico concluído!');
}

main().catch(console.error);
