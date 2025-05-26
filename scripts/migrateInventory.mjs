import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { mockInventory } from '../src/utils/mockData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure as variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env');
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateInventory() {
  for (const item of mockInventory) {
    await supabase.from('inventory_items').insert({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      location: item.location,
      value: item.value,
      supplier: item.supplier,
      purchase_date: item.purchaseDate,
      min_quantity: item.minQuantity,
      status: item.status,
      notes: item.notes,
    });
  }
  console.log('Migração de inventário concluída!');
}

migrateInventory();
