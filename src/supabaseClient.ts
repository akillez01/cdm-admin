// import { createClient } from '@supabase/supabase-js';
// import { Database } from './types/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Supabase URL and Anon Key são necessários.');
// }

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

// Configuração segura usando variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação das variáveis de ambiente
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL não está definida');
  throw new Error('VITE_SUPABASE_URL é obrigatória');
}

if (!supabaseKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY não está definida');
  throw new Error('VITE_SUPABASE_ANON_KEY é obrigatória');
}

console.log('🔧 Inicializando Supabase client...');
console.log('📍 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'UNDEFINED');

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  db: {
    schema: 'public'
  }
});

// Teste de conexão básico
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro no teste de conexão Supabase:', error);
      return false;
    }
    
    console.log('✅ Supabase conectado com sucesso');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão Supabase:', error);
    return false;
  }
}