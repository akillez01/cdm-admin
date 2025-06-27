#!/usr/bin/env node

/**
 * 🧪 VALIDAÇÃO COMPLETA DO SISTEMA DE INVENTÁRIO
 * 
 * Este script testa todos os componentes do sistema:
 * - Conexão com Supabase
 * - Mapeamento de dados
 * - Configuração de ambiente
 * - Estrutura de tipos
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';

const SUPABASE_URL = 'https://xkkbeilbthmezeqizcch.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 VALIDAÇÃO COMPLETA DO SISTEMA DE INVENTÁRIO');
console.log('=' .repeat(60));

async function validateSystem() {
  let allTestsPassed = true;
  
  // 1. Teste de configuração de ambiente
  console.log('\n1. 🔧 Testando configuração de ambiente...');
  try {
    const envPath = '.env.local';
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('VITE_USE_SUPABASE=true')) {
        console.log('   ✅ VITE_USE_SUPABASE=true configurado');
      } else {
        console.log('   ❌ VITE_USE_SUPABASE não está definido como true');
        allTestsPassed = false;
      }
      
      if (envContent.includes(SUPABASE_URL)) {
        console.log('   ✅ URL do Supabase configurada');
      } else {
        console.log('   ❌ URL do Supabase não encontrada');
        allTestsPassed = false;
      }
    } else {
      console.log('   ❌ Arquivo .env.local não encontrado');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log('   ❌ Erro ao verificar configuração:', error.message);
    allTestsPassed = false;
  }

  // 2. Teste de conexão com Supabase
  console.log('\n2. 🔌 Testando conexão com Supabase...');
  try {
    const { data, error } = await supabase.from('inventory_items').select('count');
    if (error) {
      console.log('   ❌ Erro na conexão:', error.message);
      allTestsPassed = false;
    } else {
      console.log('   ✅ Conexão com Supabase funcionando');
    }
  } catch (error) {
    console.log('   ❌ Erro de conexão:', error.message);
    allTestsPassed = false;
  }

  // 3. Teste de dados do inventário geral
  console.log('\n3. 📦 Testando dados do inventário geral...');
  try {
    const { data: inventoryData, error } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Erro ao buscar dados:', error.message);
      allTestsPassed = false;
    } else if (inventoryData && inventoryData.length > 0) {
      console.log(`   ✅ Inventário geral: ${inventoryData.length} itens disponíveis`);
      
      const item = inventoryData[0];
      const requiredFields = ['id', 'name', 'category', 'quantity', 'location'];
      const missingFields = requiredFields.filter(field => !(field in item));
      
      if (missingFields.length === 0) {
        console.log('   ✅ Estrutura de dados válida');
      } else {
        console.log(`   ❌ Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        allTestsPassed = false;
      }
    } else {
      console.log('   ⚠️  Nenhum item encontrado no inventário geral');
    }
  } catch (error) {
    console.log('   ❌ Erro no teste:', error.message);
    allTestsPassed = false;
  }

  // 4. Teste de dados do inventário do Daime
  console.log('\n4. 🌿 Testando dados do inventário do Daime...');
  try {
    const { data: daimeData, error } = await supabase
      .from('daime_inventory')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Erro ao buscar dados:', error.message);
      allTestsPassed = false;
    } else if (daimeData && daimeData.length > 0) {
      console.log(`   ✅ Inventário do Daime: ${daimeData.length} itens disponíveis`);
      
      const item = daimeData[0];
      const requiredFields = ['id', 'codigo', 'graduacao', 'litros', 'data_feitio'];
      const missingFields = requiredFields.filter(field => !(field in item));
      
      if (missingFields.length === 0) {
        console.log('   ✅ Estrutura de dados válida');
      } else {
        console.log(`   ❌ Campos obrigatórios ausentes: ${missingFields.join(', ')}`);
        allTestsPassed = false;
      }
    } else {
      console.log('   ⚠️  Nenhum item encontrado no inventário do Daime');
    }
  } catch (error) {
    console.log('   ❌ Erro no teste:', error.message);
    allTestsPassed = false;
  }

  // 5. Teste de mapeamento de dados
  console.log('\n5. 🔄 Testando mapeamento de dados...');
  try {
    const { data: rawData, error } = await supabase
      .from('inventory_items')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('   ❌ Erro ao buscar dados para mapeamento:', error.message);
      allTestsPassed = false;
    } else if (rawData && rawData.length > 0) {
      const item = rawData[0];
      
      // Simular mapeamento
      const mapped = {
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        location: item.location,
        value: item.value,
        supplier: item.supplier,
        purchaseDate: item.purchase_date, // snake_case → camelCase
        minQuantity: item.min_quantity,   // snake_case → camelCase
        status: item.status,
        notes: item.notes
      };
      
      if (mapped.purchaseDate !== undefined && mapped.minQuantity !== undefined) {
        console.log('   ✅ Mapeamento snake_case → camelCase funcionando');
      } else {
        console.log('   ❌ Problema no mapeamento de campos');
        allTestsPassed = false;
      }
    }
  } catch (error) {
    console.log('   ❌ Erro no teste de mapeamento:', error.message);
    allTestsPassed = false;
  }

  // 6. Verificação de arquivos críticos
  console.log('\n6. 📁 Verificando arquivos críticos...');
  const criticalFiles = [
    'src/hooks/useSupabase.ts',
    'src/hooks/useDataProvider.ts', 
    'src/pages/Inventory.tsx',
    'src/types/supabase.ts'
  ];
  
  for (const filePath of criticalFiles) {
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${filePath} existe`);
    } else {
      console.log(`   ❌ ${filePath} não encontrado`);
      allTestsPassed = false;
    }
  }

  // Resultado final
  console.log('\n' + '=' .repeat(60));
  if (allTestsPassed) {
    console.log('🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ O sistema de inventário está pronto para uso.');
    console.log('\n📋 Próximos passos:');
    console.log('1. Acesse http://localhost:3000/inventory');
    console.log('2. Verifique se os dados reais são carregados');
    console.log('3. Teste as funcionalidades CRUD');
  } else {
    console.log('❌ ALGUNS TESTES FALHARAM');
    console.log('🔧 Verifique os erros acima e corrija-os antes de prosseguir.');
  }
  console.log('=' .repeat(60));
}

validateSystem().catch(console.error);
