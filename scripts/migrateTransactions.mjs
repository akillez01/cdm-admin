import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { mockTransactions } from '../src/utils/mockData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure as variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateTransactions() {
  for (const tx of mockTransactions) {
    await supabase.from('transactions').insert({
      member_id: tx.memberId || null,
      member_name: tx.memberName || null,
      type: tx.type,
      amount: tx.amount,
      date: tx.date,
      category: tx.category,
      description: tx.description,
      payment_method: tx.paymentMethod,
    });
  }
  console.log('Migração de transações concluída!');
}

migrateTransactions();