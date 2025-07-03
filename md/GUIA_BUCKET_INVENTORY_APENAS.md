# 📦 CRIAR BUCKET INVENTORY - GUIA RÁPIDO

## 🎯 **Objetivo**

Criar apenas o bucket `inventory` para imagens do inventário geral, já que avatars, members e sacramentos já estão configurados.

---

## 🚀 **PASSO A PASSO**

### **1. Acesse o Supabase**

- Vá para: https://app.supabase.com
- Entre no projeto CDM Admin
- Clique em **"SQL Editor"**

### **2. Execute este SQL (VERSÃO CORRIGIDA)**

```sql
-- PASSO 1: Criar bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- PASSO 2: Verificar criação
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';

-- PASSO 3: Políticas (remover IF NOT EXISTS que causa erro)
CREATE POLICY "inventory_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');

CREATE POLICY "inventory_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');

CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Verificação final
SELECT 'Bucket inventory criado! ✅' as resultado;
```

CREATE POLICY IF NOT EXISTS "Authenticated update for inventory" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

CREATE POLICY IF NOT EXISTS "Authenticated delete for inventory" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Verificar
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';

```

### **3. Verificar resultado**

- Vá em **Storage** no menu lateral
- Você deve ver o bucket **📦 inventory**
- Teste fazer upload de uma imagem

---

## ✅ **RESULTADO ESPERADO**

Após executar:

- ✅ Bucket `inventory` criado
- ✅ Políticas configuradas
- ✅ Upload de imagens funcionando no inventário geral
- ✅ Imagens aparecendo na lista do inventário

---

## 🧪 **TESTE**

1. Vá em **Inventário → Inventário Geral**
2. Clique **"Adicionar Item"**
3. Preencha dados e faça upload de imagem
4. Salve e veja a imagem na lista ✨
```
