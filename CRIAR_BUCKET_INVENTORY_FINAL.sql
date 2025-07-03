-- ====================================
-- CRIAR BUCKET INVENTORY - VERSÃO FINAL
-- ====================================
-- Seguindo o padrão dos buckets avatars, members e sacramentos

-- 🔧 ETAPA 1: Criar bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- 🧹 ETAPA 2: Remover policies existentes (se houver)
DROP POLICY IF EXISTS "inventory_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "inventory_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "inventory_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "inventory_delete_policy" ON storage.objects;

-- Remover também possíveis names antigos
DROP POLICY IF EXISTS "Public read for inventory" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for inventory" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update for inventory" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for inventory" ON storage.objects;

-- 🛡️ ETAPA 3: Criar policies (padrão consistente)

-- Policy 1: SELECT (Leitura pública)
CREATE POLICY "inventory_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');

-- Policy 2: INSERT (Upload para usuários autenticados)
CREATE POLICY "inventory_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Policy 3: UPDATE (Atualização para usuários autenticados)
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Policy 4: DELETE (Exclusão para usuários autenticados)
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- ✅ ETAPA 4: Verificação
SELECT 
    'BUCKET CRIADO' as status,
    id, 
    name, 
    public,
    CASE 
        WHEN public = true THEN '✅ Público'
        ELSE '❌ Privado'
    END as acesso
FROM storage.buckets 
WHERE id = 'inventory';

-- Verificar policies criadas
SELECT 
    'POLICIES CRIADAS' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'inventory_%';

-- Mensagem final
SELECT '🎉 BUCKET INVENTORY CONFIGURADO COM SUCESSO! 🎉' as resultado;

-- ====================================
-- INSTRUÇÕES DE USO:
-- ====================================
-- 1. Copie este SQL completo
-- 2. Cole no SQL Editor do Supabase
-- 3. Execute tudo de uma vez
-- 4. Verifique os resultados
-- 5. Teste upload de imagem no inventário
-- ====================================
