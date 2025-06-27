import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xkkbeilbthmezeqizcch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo'
);

async function simpleTableTest() {
  console.log('🔍 Teste simples das tabelas necessárias...\n');
  
  const tables = ['members', 'inventory_items', 'transactions', 'daime_inventory'];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(0);
      
      if (error) {
        if (error.code === '42P01') {
          console.log(`❌ ${table}: TABELA NÃO EXISTE`);
        } else {
          console.log(`❌ ${table}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${table}: EXISTE (${count || 0} registros)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERRO - ${err.message}`);
    }
  }
  
  console.log('\n📋 Resumo das ações necessárias:');
  console.log('1. Execute o arquivo create_all_tables.sql no Supabase Dashboard');
  console.log('2. Acesse: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/sql');
  console.log('3. Cole o conteúdo do arquivo create_all_tables.sql');
  console.log('4. Execute o script');
  console.log('5. Teste novamente este script');
}

simpleTableTest().catch(console.error);
