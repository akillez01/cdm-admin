#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase (substitua pelos seus valores)
const SUPABASE_URL = 'https://dncmqfopqyihpipjfmml.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY21xZm9wcXlpaHBpcGpmbW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Nzc5MjEsImV4cCI6MjA1MDU1MzkyMX0.FjdPLzOvGYxSNnFzHZcY_pJaYYxSPUZovPOmOaHNDz0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkTables() {
  console.log('🔍 Verificando tabelas no Supabase...\n');

  const tables = ['members', 'inventory_items', 'transactions', 'daime_inventory'];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.log(`❌ Tabela '${table}': ERRO - ${error.message}`);
      } else {
        console.log(`✅ Tabela '${table}': OK (${data.length} registros encontrados)`);
      }
    } catch (err) {
      console.log(`❌ Tabela '${table}': ERRO - ${err.message}`);
    }
  }

  console.log('\n📊 Verificando estrutura da tabela daime_inventory...');
  
  try {
    // Tentar criar a tabela se não existir
    const { data, error } = await supabase.rpc('create_daime_inventory_if_not_exists');
    if (error) {
      console.log('ℹ️  Função create_daime_inventory_if_not_exists não encontrada');
    }
  } catch (err) {
    console.log('ℹ️  Função create_daime_inventory_if_not_exists não encontrada');
  }
}

checkTables().catch(console.error);
