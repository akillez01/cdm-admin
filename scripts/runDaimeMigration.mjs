#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configurações do Supabase - substitua pelas suas
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY'

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
  console.error('❌ Configure as variáveis de ambiente VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Aplicando migração do inventário do Daime...')
    
    const migrationPath = join(__dirname, '../supabase/migrations/20250626000000_daime_inventory.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    // Dividir o SQL em comandos individuais
    const commands = migrationSQL
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)
    
    for (const command of commands) {
      if (command.trim()) {
        console.log(`📝 Executando: ${command.substring(0, 50)}...`)
        const { error } = await supabase.rpc('exec_sql', { sql: command })
        
        if (error) {
          console.error('❌ Erro ao executar comando:', error)
          // Continue com outros comandos mesmo se houver erro
        } else {
          console.log('✅ Comando executado com sucesso')
        }
      }
    }
    
    console.log('🎉 Migração concluída!')
    
  } catch (error) {
    console.error('❌ Erro na migração:', error)
    process.exit(1)
  }
}

runMigration()
