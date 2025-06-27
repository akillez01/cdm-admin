import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xkkbeilbthmezeqizcch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo'
);

async function listTables() {
  console.log('🔍 Listando tabelas disponíveis...');
  
  // Testar algumas possibilidades de nomes de tabela para inventário
  const tablesToTest = [
    'inventory',
    'inventory_items', 
    'inventario',
    'estoque',
    'items',
    'products'
  ];
  
  for (const tableName of tablesToTest) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (!error && data !== null) {
        console.log(`✅ Tabela '${tableName}' existe com ${data.length >= 1 ? 'dados' : 'sem dados'}`);
        if (data.length > 0) {
          console.log(`   Exemplo:`, Object.keys(data[0]));
        }
      } else if (error) {
        console.log(`❌ Tabela '${tableName}': ${error.message}`);
      }
    } catch (err) {
      console.log(`❌ Erro ao testar '${tableName}':`, err.message);
    }
  }
  
  // Testar daime_inventory que sabemos que existe
  console.log('\n🧪 Testando daime_inventory (sabemos que existe):');
  const { data: daime, error: daimeError } = await supabase
    .from('daime_inventory')
    .select('*')
    .limit(2);
    
  if (!daimeError) {
    console.log(`✅ daime_inventory: ${daime?.length || 0} itens`);
  }
}

listTables().catch(console.error);
