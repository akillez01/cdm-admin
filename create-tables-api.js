import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xkkbeilbthmezeqizcch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo'
);

async function createTablesAndData() {
  console.log('🔧 Iniciando criação/verificação das tabelas...\n');

  // 1. Verificar se as tabelas existem e criar dados de exemplo
  await createMembersData();
  await createInventoryItemsData();
  await createTransactionsData();
  await verifyDaimeInventory();
  
  console.log('\n✅ Processo concluído!');
}

async function createMembersData() {
  console.log('👥 Verificando tabela members...');
  
  try {
    // Tentar inserir dados de exemplo (se a tabela não existir, falhará)
    const { data, error } = await supabase
      .from('members')
      .insert([
        {
          name: 'João Silva',
          email: 'joao@exemplo.com',
          phone: '(11) 99999-9999',
          status: 'active',
          membership_type: 'regular'
        },
        {
          name: 'Maria Santos', 
          email: 'maria@exemplo.com',
          phone: '(11) 88888-8888',
          status: 'active',
          membership_type: 'premium'
        }
      ])
      .select();

    if (error && error.code === '42P01') {
      console.log('❌ Tabela members não existe - precisa ser criada no Supabase Dashboard');
    } else if (error && error.code === '23505') {
      console.log('✅ Tabela members existe (dados já inseridos)');
    } else if (error) {
      console.log('❌ Erro na tabela members:', error.message);
    } else {
      console.log('✅ Tabela members criada com dados de exemplo');
    }
  } catch (err) {
    console.log('❌ Erro ao verificar members:', err.message);
  }
}

async function createInventoryItemsData() {
  console.log('📦 Verificando tabela inventory_items...');
  
  try {
    const { data, error } = await supabase
      .from('inventory_items')
      .insert([
        {
          name: 'Velas Brancas',
          category: 'Liturgia',
          quantity: 50,
          location: 'Despensa Principal',
          min_quantity: 10,
          status: 'available'
        },
        {
          name: 'Incenso de Sândalo',
          category: 'Liturgia', 
          quantity: 25,
          location: 'Despensa Principal',
          min_quantity: 5,
          status: 'available'
        }
      ])
      .select();

    if (error && error.code === '42P01') {
      console.log('❌ Tabela inventory_items não existe - precisa ser criada no Supabase Dashboard');
    } else if (error) {
      console.log('❌ Erro na tabela inventory_items:', error.message);
    } else {
      console.log('✅ Tabela inventory_items verificada/atualizada');
    }
  } catch (err) {
    console.log('❌ Erro ao verificar inventory_items:', err.message);
  }
}

async function createTransactionsData() {
  console.log('💰 Verificando tabela transactions...');
  
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([
        {
          type: 'income',
          amount: 500.00,
          description: 'Doação mensal',
          category: 'Doações',
          status: 'completed'
        },
        {
          type: 'expense',
          amount: 150.00,
          description: 'Compra de velas',
          category: 'Material Litúrgico',
          status: 'completed'
        }
      ])
      .select();

    if (error && error.code === '42P01') {
      console.log('❌ Tabela transactions não existe - precisa ser criada no Supabase Dashboard');
    } else if (error) {
      console.log('❌ Erro na tabela transactions:', error.message);
    } else {
      console.log('✅ Tabela transactions verificada/atualizada');
    }
  } catch (err) {
    console.log('❌ Erro ao verificar transactions:', err.message);
  }
}

async function verifyDaimeInventory() {
  console.log('🧪 Verificando tabela daime_inventory...');
  
  try {
    const { data, error } = await supabase
      .from('daime_inventory')
      .select('count(*)')
      .single();

    if (error && error.code === '42P01') {
      console.log('❌ Tabela daime_inventory não existe - precisa ser criada no Supabase Dashboard');
    } else if (error) {
      console.log('❌ Erro na tabela daime_inventory:', error.message);
    } else {
      console.log(`✅ Tabela daime_inventory existe (${data.count} registros)`);
    }
  } catch (err) {
    console.log('❌ Erro ao verificar daime_inventory:', err.message);
  }
}

// Função para testar todas as tabelas
async function testAllTables() {
  console.log('\n🧪 Testando acesso a todas as tabelas...\n');
  
  const tables = ['members', 'inventory_items', 'transactions', 'daime_inventory'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        console.log(`✅ ${table}: Acessível (${data.length} registros retornados)`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
}

// Executar
createTablesAndData()
  .then(() => testAllTables())
  .catch(console.error);
