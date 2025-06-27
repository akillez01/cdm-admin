#!/usr/bin/env node

/**
 * Script para testar se o mapeamento de dados do frontend está funcionando
 * Simula exatamente o que o useSupabase.ts faz
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xkkbeilbthmezeqizcch.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhra2JlaWxidGhtZXplcWl6Y2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDgyMzgsImV4cCI6MjA2MzY4NDIzOH0.Q1rUqU6DpD_7JCHyJ6q_gsz7wGAotSDsGKKs4XtghAo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testInventoryMapping() {
  console.log('🧪 Testando mapeamento de dados do inventário...\n');
  
  try {
    // Buscar dados do inventário geral
    console.log('📦 Testando getInventory...');
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('inventory_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (inventoryError) {
      console.error('❌ Erro ao buscar inventory_items:', inventoryError);
      return;
    }

    console.log(`✅ Dados brutos recebidos: ${inventoryData.length} itens`);
    
    if (inventoryData.length > 0) {
      console.log('📋 Primeiro item bruto:', JSON.stringify(inventoryData[0], null, 2));
      
      // Aplicar mapeamento (igual ao useSupabase.ts)
      const mappedInventory = inventoryData.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        location: item.location,
        value: item.value,
        supplier: item.supplier,
        purchaseDate: item.purchase_date,
        minQuantity: item.min_quantity,
        status: item.status,
        notes: item.notes
      }));
      
      console.log('🔄 Primeiro item mapeado:', JSON.stringify(mappedInventory[0], null, 2));
    }

    console.log('\n🌿 Testando getDaimeInventory...');
    
    // Buscar dados do inventário do Daime
    const { data: daimeData, error: daimeError } = await supabase
      .from('daime_inventory')
      .select('*')
      .order('created_at', { ascending: false });

    if (daimeError) {
      console.error('❌ Erro ao buscar daime_inventory:', daimeError);
      return;
    }

    console.log(`✅ Dados brutos recebidos: ${daimeData.length} itens`);
    
    if (daimeData.length > 0) {
      console.log('📋 Primeiro item bruto:', JSON.stringify(daimeData[0], null, 2));
      
      // Aplicar mapeamento (igual ao useSupabase.ts)
      const mappedDaime = daimeData.map(item => ({
        id: item.id,
        codigo: item.codigo,
        graduacao: item.graduacao,
        litros: parseFloat(item.litros),
        dataFeitio: item.data_feitio,
        responsavelFeitio: item.responsavel_feitio,
        localFeitio: item.local_feitio,
        tipoFeitio: item.tipo_feitio,
        panela: item.panela,
        observacoes: item.observacoes,
        status: item.status,
        dataValidade: item.data_validade,
        localArmazenamento: item.local_armazenamento,
        temperatura: item.temperatura ? parseFloat(item.temperatura) : undefined,
        ph: item.ph ? parseFloat(item.ph) : undefined,
        cor: item.cor,
        consistencia: item.consistencia,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));
      
      console.log('🔄 Primeiro item mapeado:', JSON.stringify(mappedDaime[0], null, 2));
    }

    console.log('\n✅ Teste de mapeamento concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
  }
}

testInventoryMapping();
