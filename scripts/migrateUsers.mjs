import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { mockUsers } from '../src/utils/mockData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure as variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateUsers() {
  for (const user of mockUsers) {
    // Cria usuário no auth e adiciona metadados de role
    const { error } = await supabase.auth.admin.createUser({
      email: user.email,
      email_confirm: true,
      user_metadata: {
        name: user.name,
        role: user.role,
      },
    });
    if (error) console.error('Erro ao criar usuário:', user.email, error.message);
  }
  console.log('Migração de usuários concluída!');
}

migrateUsers();
