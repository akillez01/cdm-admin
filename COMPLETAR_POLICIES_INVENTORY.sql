-- =======================================
-- COMPLETAR POLICIES INVENTORY
-- =======================================
-- Você já tem SELECT e INSERT, faltam UPDATE e DELETE

-- 📋 STATUS ATUAL:
-- ✅ inventory_select_policy (SELECT) 
-- ✅ inventory_insert_policy (INSERT)
-- ❌ inventory_update_policy (UPDATE) - FALTA
-- ❌ inventory_delete_policy (DELETE) - FALTA

-- 🚀 ADICIONAR AS POLICIES QUE FALTAM:

-- Policy 3: UPDATE (Atualização para usuários autenticados)
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Policy 4: DELETE (Exclusão para usuários autenticados)  
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- ✅ VERIFICAÇÃO FINAL
SELECT 
    'POLICIES COMPLETAS!' as status,
    COUNT(*) as total_policies
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE 'inventory_%';
-- Deve retornar: 4 policies

-- 🎯 RESULTADO ESPERADO:
-- inventory_select_policy  (SELECT)  ✅
-- inventory_insert_policy  (INSERT)  ✅  
-- inventory_update_policy  (UPDATE)  ✅ NOVA
-- inventory_delete_policy  (DELETE)  ✅ NOVA

SELECT '🎉 INVENTORY AGORA TEM 4 POLICIES COMO OS OUTROS BUCKETS! 🎉' as resultado;
