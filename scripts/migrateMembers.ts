import { createClient } from '@supabase/supabase-js';
import { mockMembers } from '../src/utils/mockData'; // Caminho correto para TypeScript

const supabaseUrl = 'SUA_SUPABASE_URL';
const supabaseKey = 'SUA_SUPABASE_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateMembers() {
  for (const member of mockMembers) {
    await supabase.from('members').insert({
      first_name: member.firstName,
      last_name: member.lastName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      birth_date: member.birthDate,
      baptism_date: member.baptismDate,
      join_date: member.joinDate,
      status: member.status,
      groups: member.groups,
      ministries: member.ministries,
      skills: member.skills,
      notes: member.notes,
      photo_url: member.photo,
    });
  }
  console.log('Migração concluída!');
}

migrateMembers();