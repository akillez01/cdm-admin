// Teste de conexão com Supabase
import { supabase } from './src/supabaseClient.js';

console.log('🔍 Testando conexão Supabase...');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL);
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Definida' : 'Não definida');

async function testConnection() {
  try {
    console.log('📡 Testando query simples...');
    const { data, error } = await supabase
      .from('members')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na query:', error);
    } else {
      console.log('✅ Conexão bem-sucedida:', data);
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
}

testConnection();
