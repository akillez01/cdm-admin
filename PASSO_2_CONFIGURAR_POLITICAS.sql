-- PASSO 2: Configurar políticas (execute depois do Passo 1)

-- Habilitar RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Remover políticas se existirem (pode dar erro, ignore)
DROP POLICY IF EXISTS "Public read access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update access for all images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete access for all images" ON storage.objects;

-- Criar política para visualização pública
CREATE POLICY "Public read access for all images" ON storage.objects
FOR SELECT USING (bucket_id IN ('avatars', 'members', 'sacramentos'));

-- Criar política para upload
CREATE POLICY "Authenticated upload access for all images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- Criar política para atualização
CREATE POLICY "Authenticated update access for all images" ON storage.objects
FOR UPDATE USING (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- Criar política para exclusão
CREATE POLICY "Authenticated delete access for all images" ON storage.objects
FOR DELETE USING (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- Verificar políticas criadas
SELECT policyname, cmd FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
AND policyname LIKE '%images%';
