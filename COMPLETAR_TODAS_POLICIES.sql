-- ============================================
-- COMPLETAR POLICIES PARA TODOS OS BUCKETS
-- ============================================
-- Adicionando UPDATE e DELETE para avatars, members e sacramentos

-- 🎯 AVATARS - Policies UPDATE e DELETE
-- Policy UPDATE para avatars
CREATE POLICY "avatars_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Policy DELETE para avatars
CREATE POLICY "avatars_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 👥 MEMBERS - Policies UPDATE e DELETE
-- Policy UPDATE para members
CREATE POLICY "members_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'members' AND auth.role() = 'authenticated');

-- Policy DELETE para members
CREATE POLICY "members_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'members' AND auth.role() = 'authenticated');

-- 🏆 SACRAMENTOS - Policies UPDATE e DELETE
-- Policy UPDATE para sacramentos
CREATE POLICY "sacramentos_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

-- Policy DELETE para sacramentos
CREATE POLICY "sacramentos_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

-- ✅ VERIFICAÇÃO FINAL - Contar policies de cada bucket
SELECT 
    'AVATARS' as bucket,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'avatars_%'

UNION ALL

SELECT 
    'MEMBERS' as bucket,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'members_%'

UNION ALL

SELECT 
    'SACRAMENTOS' as bucket,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'sacramentos_%'

UNION ALL

SELECT 
    'INVENTORY' as bucket,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'inventory_%'

ORDER BY bucket;

-- 🎉 RESULTADO ESPERADO: Todos com 4 policies
-- AVATARS     | 4
-- INVENTORY   | 4  
-- MEMBERS     | 4
-- SACRAMENTOS | 4

SELECT '🎉 TODOS OS BUCKETS AGORA TÊM 4 POLICIES COMPLETAS! 🎉' as resultado;

-- ============================================
-- INSTRUÇÕES DE USO:
-- ============================================
-- 1. Copie este SQL completo
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute tudo de uma vez
-- 4. Verifique se todos os buckets têm 4 policies
-- 5. Teste upload/update/delete em todos os buckets
-- ============================================
