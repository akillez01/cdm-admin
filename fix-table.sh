#!/bin/bash

echo "🚀 SOLUÇÃO FINAL: CRIAR TABELA DAIME_INVENTORY"
echo "=============================================="
echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
  echo "❌ Arquivo .env não encontrado!"
  exit 1
fi

# Carregar .env
source .env

echo "🔗 Projeto Supabase: $VITE_SUPABASE_URL"
echo ""

# Verificar se tabela já existe
echo "🔍 Verificando se a tabela já existe..."
echo ""

# Usar Node.js para verificar
node -e "
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('$VITE_SUPABASE_URL', '$VITE_SUPABASE_ANON_KEY');
supabase.from('daime_inventory').select('count').limit(1)
  .then(({data, error}) => {
    if (error) {
      console.log('❌ Tabela NÃO existe:', error.message);
      console.log('');
      console.log('📋 PARA RESOLVER:');
      console.log('1. Acesse: https://app.supabase.com');
      console.log('2. Entre no projeto: xkkbeilbthmezeqizcch');
      console.log('3. Clique em SQL Editor');
      console.log('4. Cole e execute este SQL:');
      console.log('');
      console.log('=== COPIE ESTE SQL ===');
      console.log('$(<create_daime_inventory_table.sql)');
      console.log('=== FIM DO SQL ===');
      console.log('');
      console.log('5. Depois execute: node check-daime-table.js');
      console.log('6. Se OK, execute: npm run dev');
    } else {
      console.log('✅ Tabela existe!');
      console.log('🚀 Execute: npm run dev');
    }
  })
  .catch(err => console.log('Erro:', err.message));
" 2>/dev/null || {
  echo "❌ Tabela NÃO existe!"
  echo ""
  echo "📋 PARA RESOLVER:"
  echo "1. Acesse: https://app.supabase.com"
  echo "2. Entre no projeto: xkkbeilbthmezeqizcch"
  echo "3. Clique em 'SQL Editor'"
  echo "4. Cole e execute este SQL:"
  echo ""
  echo "=== COPIE ESTE SQL ==="
  cat create_daime_inventory_table.sql
  echo "=== FIM DO SQL ==="
  echo ""
  echo "5. Depois execute: node check-daime-table.js"
  echo "6. Se OK, execute: npm run dev"
}
