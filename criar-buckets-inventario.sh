#!/bin/bash

# Script para criar buckets de storage no Supabase para inventário
# Execute este arquivo ou use os comandos SQL diretamente no Supabase Dashboard

echo "🗄️ CRIANDO BUCKETS PARA INVENTÁRIO"
echo "=================================="
echo ""
echo "📋 Execute os seguintes comandos SQL no Supabase Dashboard:"
echo ""
echo "1. Acesse: https://app.supabase.com"
echo "2. Entre no seu projeto"
echo "3. Clique em 'Storage' no menu lateral"
echo "4. Clique em 'SQL Editor' (ou use o SQL Editor principal)"
echo "5. Execute os comandos abaixo:"
echo ""

cat << 'EOF'
-- ========================================
-- CRIAR BUCKETS PARA INVENTÁRIO
-- ========================================

-- 1. Criar bucket para itens do inventário geral (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Verificar se bucket avatars existe (usado para inventário)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Verificar se bucket sacramentos existe (usado para Daime)
INSERT INTO storage.buckets (id, name, public)
VALUES ('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- CRIAR POLÍTICAS DE ACESSO
-- ========================================

-- Política para leitura pública do bucket inventory
CREATE POLICY IF NOT EXISTS "Public read access for inventory" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');

-- Política para upload autenticado no bucket inventory
CREATE POLICY IF NOT EXISTS "Authenticated upload for inventory" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- Política para update autenticado no bucket inventory
CREATE POLICY IF NOT EXISTS "Authenticated update for inventory" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- Política para delete autenticado no bucket inventory
CREATE POLICY IF NOT EXISTS "Authenticated delete for inventory" ON storage.objects
FOR DELETE USING (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- Verificar políticas do bucket avatars (caso não existam)
CREATE POLICY IF NOT EXISTS "Public read access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY IF NOT EXISTS "Authenticated upload for avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated update for avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated delete for avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Verificar políticas do bucket sacramentos (caso não existam)
CREATE POLICY IF NOT EXISTS "Public read access for sacramentos" ON storage.objects
FOR SELECT USING (bucket_id = 'sacramentos');

CREATE POLICY IF NOT EXISTS "Authenticated upload for sacramentos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'sacramentos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated update for sacramentos" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'sacramentos' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY IF NOT EXISTS "Authenticated delete for sacramentos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'sacramentos' AND 
  auth.role() = 'authenticated'
);

-- ========================================
-- VERIFICAR CRIAÇÃO DOS BUCKETS
-- ========================================

-- Listar todos os buckets criados
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id IN ('inventory', 'avatars', 'sacramentos')
ORDER BY created_at;

-- Verificar políticas criadas
SELECT 
  policyname,
  tablename,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%inventory%' 
   OR policyname LIKE '%avatars%'
   OR policyname LIKE '%sacramentos%'
ORDER BY policyname;

EOF

echo ""
echo "✅ APÓS EXECUTAR O SQL:"
echo "========================"
echo ""
echo "1. Vá para 'Storage' no Supabase Dashboard"
echo "2. Você deve ver os buckets:"
echo "   - 📦 inventory (para itens do inventário geral)"
echo "   - 👤 avatars (para avatars e itens gerais)"
echo "   - 🌿 sacramentos (para fotos do Daime)"
echo ""
echo "3. Teste fazendo upload de uma imagem em cada bucket"
echo ""
echo "4. As URLs das imagens serão:"
echo "   - Inventário: https://[projeto].supabase.co/storage/v1/object/public/inventory/..."
echo "   - Avatars: https://[projeto].supabase.co/storage/v1/object/public/avatars/..."
echo "   - Sacramentos: https://[projeto].supabase.co/storage/v1/object/public/sacramentos/..."
echo ""
echo "🎉 Após isso, as imagens do inventário devem funcionar!"
