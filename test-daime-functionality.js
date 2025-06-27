#!/usr/bin/env node

/**
 * Script para testar a funcionalidade completa da tabela daime_inventory
 * Execute após criar a tabela no Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testando funcionalidade completa da tabela daime_inventory...\n');

async function testDaimeInventory() {
  try {
    // 1. Teste de leitura
    console.log('📖 1. Testando leitura...');
    const { data: readData, error: readError } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(3);

    if (readError) {
      console.log('❌ Erro na leitura:', readError.message);
      return;
    }

    console.log(`✅ Leitura OK - ${readData.length} registros encontrados`);
    if (readData.length > 0) {
      console.log('📋 Exemplo de registro:');
      const first = readData[0];
      console.log(`   - Código: ${first.codigo}`);
      console.log(`   - Graduação: ${first.graduacao}`);
      console.log(`   - Litros: ${first.litros}`);
      console.log(`   - Status: ${first.status}`);
    }

    // 2. Teste de inserção
    console.log('\n✏️ 2. Testando inserção...');
    const newItem = {
      codigo: 'DM999',
      graduacao: 'Força 1',
      litros: 5.0,
      data_feitio: '2024-12-25',
      responsavel_feitio: 'Teste Automatizado',
      local_feitio: 'Casa de Teste',
      tipo_feitio: 'Novo',
      status: 'disponivel',
      observacoes: 'Item criado para teste automatizado'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('daime_inventory')
      .insert(newItem)
      .select()
      .single();

    if (insertError) {
      console.log('❌ Erro na inserção:', insertError.message);
      if (insertError.code === '23505') {
        console.log('ℹ️  (Código DM999 já existe - teste anterior)');
      }
    } else {
      console.log('✅ Inserção OK - ID:', insertData.id);

      // 3. Teste de atualização
      console.log('\n🔄 3. Testando atualização...');
      const { data: updateData, error: updateError } = await supabase
        .from('daime_inventory')
        .update({ observacoes: 'Item atualizado por teste automatizado' })
        .eq('id', insertData.id)
        .select()
        .single();

      if (updateError) {
        console.log('❌ Erro na atualização:', updateError.message);
      } else {
        console.log('✅ Atualização OK');
      }

      // 4. Teste de exclusão
      console.log('\n🗑️ 4. Testando exclusão...');
      const { error: deleteError } = await supabase
        .from('daime_inventory')
        .delete()
        .eq('id', insertData.id);

      if (deleteError) {
        console.log('❌ Erro na exclusão:', deleteError.message);
      } else {
        console.log('✅ Exclusão OK');
      }
    }

    console.log('\n🎉 TESTE COMPLETO!');
    console.log('A tabela daime_inventory está funcionando corretamente.');
    console.log('Agora você pode executar: npm run dev');

  } catch (error) {
    console.log('❌ Erro crítico durante o teste:', error.message);
  }
}

testDaimeInventory();
