import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase
const supabaseUrl = 'https://xkkbeilbthmezeqizcch.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInventoryAccess() {
  console.log('🔍 Testando acesso ao inventário no Supabase...');
  
  try {
    // Testar inventário geral
    const { data: inventory, error: invError } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(5);
    
    if (invError) {
      console.log('❌ Erro ao acessar tabela inventory_items:', invError.message);
    } else {
      console.log('✅ Tabela inventory_items acessível:', inventory?.length || 0, 'itens encontrados');
      if (inventory && inventory.length > 0) {
        console.log('📋 Exemplo de item:', inventory[0]);
      }
    }

    // Testar inventário do Daime
    const { data: daimeInventory, error: daimeError } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(5);
    
    if (daimeError) {
      console.log('❌ Erro ao acessar tabela daime_inventory:', daimeError.message);
    } else {
      console.log('✅ Tabela daime_inventory acessível:', daimeInventory?.length || 0, 'itens encontrados');
      if (daimeInventory && daimeInventory.length > 0) {
        console.log('📋 Exemplo de item Daime:', daimeInventory[0]);
      }
    }

    // Listar todas as tabelas disponíveis
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (!tablesError && tables) {
      console.log('📊 Tabelas disponíveis:', tables.map(t => t.table_name));
    }

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

testInventoryAccess();
