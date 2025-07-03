-- Script SQL para criar buckets de storage no Supabase
-- CDM Admin - Configuração de Upload de Imagens

-- Criar bucket 'avatars' para avatars de admin
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- Criar bucket 'members' para fotos de membros
INSERT INTO storage.buckets (id, name, public)
SELECT 'members', 'members', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'members'
);

-- Criar bucket 'sacramentos' para fotos de sacramentos
INSERT INTO storage.buckets (id, name, public)
SELECT 'sacramentos', 'sacramentos', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'sacramentos'
);

-- Verificar se os buckets foram criados
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id IN ('avatars', 'members', 'sacramentos')
ORDER BY id;

-- Configurar políticas para bucket 'avatars'
DO $$
BEGIN
    -- Política para upload de avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload avatars'
    ) THEN
        CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
    END IF;

    -- Política para visualização pública de avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Anyone can view avatars'
    ) THEN
        CREATE POLICY "Anyone can view avatars" ON storage.objects
        FOR SELECT USING (bucket_id = 'avatars');
    END IF;

    -- Política para atualização de avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can update avatars'
    ) THEN
        CREATE POLICY "Authenticated users can update avatars" ON storage.objects
        FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
    END IF;

    -- Política para deletar avatars
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can delete avatars'
    ) THEN
        CREATE POLICY "Authenticated users can delete avatars" ON storage.objects
        FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Configurar políticas para bucket 'members'
DO $$
BEGIN
    -- Política para upload de fotos de membros
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload member photos'
    ) THEN
        CREATE POLICY "Authenticated users can upload member photos" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'members' AND auth.role() = 'authenticated');
    END IF;

    -- Política para visualização pública de fotos de membros
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Anyone can view member photos'
    ) THEN
        CREATE POLICY "Anyone can view member photos" ON storage.objects
        FOR SELECT USING (bucket_id = 'members');
    END IF;

    -- Política para atualização de fotos de membros
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can update member photos'
    ) THEN
        CREATE POLICY "Authenticated users can update member photos" ON storage.objects
        FOR UPDATE USING (bucket_id = 'members' AND auth.role() = 'authenticated');
    END IF;

    -- Política para deletar fotos de membros
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can delete member photos'
    ) THEN
        CREATE POLICY "Authenticated users can delete member photos" ON storage.objects
        FOR DELETE USING (bucket_id = 'members' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Configurar políticas para bucket 'sacramentos'
DO $$
BEGIN
    -- Política para upload de fotos de sacramentos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can upload sacramento photos'
    ) THEN
        CREATE POLICY "Authenticated users can upload sacramento photos" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
    END IF;

    -- Política para visualização pública de fotos de sacramentos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Anyone can view sacramento photos'
    ) THEN
        CREATE POLICY "Anyone can view sacramento photos" ON storage.objects
        FOR SELECT USING (bucket_id = 'sacramentos');
    END IF;

    -- Política para atualização de fotos de sacramentos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can update sacramento photos'
    ) THEN
        CREATE POLICY "Authenticated users can update sacramento photos" ON storage.objects
        FOR UPDATE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
    END IF;

    -- Política para deletar fotos de sacramentos
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND policyname = 'Authenticated users can delete sacramento photos'
    ) THEN
        CREATE POLICY "Authenticated users can delete sacramento photos" ON storage.objects
        FOR DELETE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
    END IF;
END $$;

-- Verificar políticas criadas
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects'
  AND policyname LIKE '%avatar%' 
   OR policyname LIKE '%member%' 
   OR policyname LIKE '%sacramento%'
ORDER BY policyname;
