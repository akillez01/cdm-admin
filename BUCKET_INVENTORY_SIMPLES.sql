-- ========================================
-- VERSÃO SIMPLES - BUCKET INVENTORY
-- ========================================
-- Execute cada bloco separadamente no Supabase SQL Editor

-- PASSO 1: Criar o bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- PASSO 2: Verificar se foi criado
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';

-- PASSO 3: Política de leitura pública
CREATE POLICY "inventory_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');

-- PASSO 4: Política de upload autenticado
CREATE POLICY "inventory_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- PASSO 5: Política de update autenticado
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- PASSO 6: Política de delete autenticado  
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (
  bucket_id = 'inventory' AND 
  auth.role() = 'authenticated'
);

-- VERIFICAÇÃO FINAL
SELECT 'Bucket inventory configurado com sucesso! ✅' as resultado;
