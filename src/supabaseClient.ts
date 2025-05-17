// import { createClient } from '@supabase/supabase-js';
// import { Database } from './types/supabase';

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Supabase URL and Anon Key são necessários.');
// }

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// import { createClient } from '@supabase/supabase-js';
// import { Database } from './types/supabase';

// // Configuração segura usando variáveis de ambiente
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KE

// export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true
//   },
//   db: {
//     schema: 'public'
//   }
// });

import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Anon Key são necessários.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);