-- =========================================
-- CRIAR POLICIES INVENTORY - PASSO A PASSO
-- =========================================
-- Execute estes comandos UM POR VEZ no SQL Editor

-- PASSO 1: Verificar se bucket existe
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';
-- ❓ Se não retornar nada, o bucket não existe

-- PASSO 2: Criar bucket (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;
-- ✅ Deve executar sem erro

-- PASSO 3: Confirmar criação
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';
-- ✅ Deve retornar: inventory | inventory | true

-- PASSO 4: Remover policies antigas (se existirem)
DROP POLICY IF EXISTS "inventory_select_policy" ON storage.objects;
DROP POLICY IF EXISTS "inventory_insert_policy" ON storage.objects;  
DROP POLICY IF EXISTS "inventory_update_policy" ON storage.objects;
DROP POLICY IF EXISTS "inventory_delete_policy" ON storage.objects;
-- ✅ Deve executar sem erro

-- PASSO 5: Criar policy SELECT (leitura pública)
CREATE POLICY "inventory_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');
-- ✅ Deve criar policy de leitura

-- PASSO 6: Criar policy INSERT (upload autenticado)
CREATE POLICY "inventory_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');
-- ✅ Deve criar policy de upload

-- PASSO 7: Criar policy UPDATE (update autenticado)
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');
-- ✅ Deve criar policy de update

-- PASSO 8: Criar policy DELETE (delete autenticado)
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');
-- ✅ Deve criar policy de delete

-- PASSO 9: Verificar todas as policies
SELECT 
    policyname,
    cmd as operacao,
    CASE 
        WHEN policyname LIKE '%select%' THEN '👀 Leitura pública'
        WHEN policyname LIKE '%insert%' THEN '📤 Upload autenticado'
        WHEN policyname LIKE '%update%' THEN '✏️ Update autenticado'
        WHEN policyname LIKE '%delete%' THEN '🗑️ Delete autenticado'
    END as descricao
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'inventory_%'
ORDER BY policyname;
-- ✅ Deve retornar 4 policies

-- PASSO 10: Mensagem de sucesso
SELECT 
    'CONFIGURAÇÃO COMPLETA!' as status,
    '✅ Bucket: inventory' as bucket,
    '✅ Policies: 4 criadas' as policies,
    '🎉 Pronto para usar!' as resultado;

-- =========================================
-- INSTRUÇÕES:
-- =========================================
-- 1. Copie CADA comando acima
-- 2. Cole no SQL Editor do Supabase  
-- 3. Execute UM POR VEZ
-- 4. Verifique o resultado de cada passo
-- 5. Se der erro, pare e me informe qual passo
-- =========================================
