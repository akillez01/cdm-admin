-- COMANDO SQL DIRETO - Cole no SQL Editor do Supabase
-- Resolver erro: "Bucket not found" para avatars

-- 1. Criar buckets necessários
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar RLS nos buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas existentes se houver (ignorar erros)
DROP POLICY IF EXISTS "Public read access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for all images" ON storage.objects;

-- 4. Criar políticas básicas para visualização pública
CREATE POLICY "Public read access for all images" ON storage.objects
FOR SELECT USING (bucket_id IN ('avatars', 'members', 'sacramentos'));

-- 5. Criar políticas para upload de usuários autenticados
CREATE POLICY "Authenticated upload access for all images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- 6. Criar políticas para atualização
CREATE POLICY "Authenticated update access for all images" ON storage.objects
FOR UPDATE USING (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- 7. Criar políticas para exclusão
CREATE POLICY "Authenticated delete access for all images" ON storage.objects
FOR DELETE USING (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- 7. Verificar se os buckets foram criados
SELECT 
    id as bucket_name,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id IN ('avatars', 'members', 'sacramentos')
ORDER BY id;

-- 8. Verificar políticas criadas
SELECT 
    policyname,
    cmd as operation,
    tablename
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%images%'
ORDER BY policyname;
