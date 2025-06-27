#!/usr/bin/env node

/**
 * Script para diagnosticar problemas de conexão com o Supabase
 */

import { createClient } from '@supabase/supabase-js';

// Lê as variáveis de ambiente do arquivo .env
import { config } from 'dotenv';
config();

console.log('🔍 Diagnóstico de Conexão Supabase\n');

// Verificar variáveis de ambiente
console.log('📋 Variáveis de Ambiente:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL || 'NÃO DEFINIDA');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NÃO DEFINIDA');
console.log('VITE_USE_SUPABASE:', process.env.VITE_USE_SUPABASE || 'NÃO DEFINIDA');

// Valores de fallback (do código original)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://dncmqfopqyihpipjfmml.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuY21xZm9wcXlpaHBpcGpmbW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5Nzc5MjEsImV4cCI6MjA1MDU1MzkyMX0.FjdPLzOvGYxSNnFzHZcY_pJaYYxSPUZovPOmOaHNDz0';

console.log('\n🔗 Configuração Supabase:');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? 'PRESENTE' : 'AUSENTE');

try {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('\n🔄 Testando conexão básica...');
  
  // Teste simples de conexão
  const { data, error } = await supabase.from('members').select('count').limit(1);
  
  if (error) {
    console.log('❌ Erro na conexão:', error.message);
    console.log('Código do erro:', error.code);
    console.log('Detalhes:', error.details);
    console.log('Hint:', error.hint);
  } else {
    console.log('✅ Conexão bem-sucedida!');
    console.log('Dados retornados:', data);
  }
  
} catch (err) {
  console.log('❌ Erro crítico:', err.message);
  console.log('Stack:', err.stack);
}

console.log('\n📋 Próximos passos:');
console.log('1. Verificar se o projeto Supabase está ativo');
console.log('2. Verificar se as credenciais estão corretas');
console.log('3. Verificar se as tabelas foram criadas no Supabase Dashboard');
console.log('4. Verificar conectividade de rede');
