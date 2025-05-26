import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import { mockEvents } from '../src/utils/mockData.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Configure as variáveis VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local');
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateEvents() {
  for (const event of mockEvents) {
    await supabase.from('events').insert({
      title: event.title,
      start_date: event.startDate,
      end_date: event.endDate,
      description: event.description,
      location: event.location,
      budget: event.budget,
      status: event.status,
      organizer: event.organizer,
    });
  }
  console.log('Migração de eventos concluída!');
}

migrateEvents();
