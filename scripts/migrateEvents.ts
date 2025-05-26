const { createClient } = require('@supabase/supabase-js');
const { mockEvents } = require('../src/utils/mockData');

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'SUA_SUPABASE_URL';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'SUA_SUPABASE_SERVICE_ROLE_KEY';
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
