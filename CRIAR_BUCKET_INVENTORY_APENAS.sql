-- ========================================
-- CRIAR BUCKET APENAS PARA INVENTÁRIO GERAL
-- ========================================
-- Execute este SQL no Dashboard do Supabase > SQL Editor

-- 1. Criar bucket para itens do inventário geral (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- CRIAR POLÍTICAS DE ACESSO PARA INVENTORY
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

-- ========================================
-- VERIFICAR CRIAÇÃO DO BUCKET INVENTORY
-- ========================================

-- Listar o bucket inventory criado
SELECT 
  id,
  name,
  public,
  created_at
FROM storage.buckets 
WHERE id = 'inventory';

-- Verificar políticas criadas para inventory
SELECT 
  policyname,
  tablename,
  cmd
FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname LIKE '%inventory%'
ORDER BY policyname;

-- Mostrar mensagem de sucesso
SELECT 'Bucket inventory criado com sucesso! ✅' as status;
