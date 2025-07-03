# 🚨 RESOLVER PROBLEMA: Policies não criadas

## 🔍 **DIAGNÓSTICO**

O bucket `inventory` não foi criado corretamente ou as policies falharam. Vamos resolver passo a passo.

---

## 🛠️ **SOLUÇÃO 1: Via Interface Supabase**

### **Passo 1: Verificar/Criar Bucket**

1. **Acesse:** https://app.supabase.com
2. **Vá para:** Storage → Buckets
3. **Verifique:** Se existe bucket `inventory`
4. **Se não existir:**
   - Clique **"New bucket"**
   - Nome: `inventory`
   - Public: ✅ **Ativado**
   - Clique **"Save"**

### **Passo 2: Criar Policies Manualmente**

1. **Vá para:** Storage → Policies
2. **Clique:** "New Policy"
3. **Crie 4 policies:**

#### **Policy 1: SELECT (Leitura)**

- **Nome:** `inventory_select_policy`
- **Operação:** SELECT
- **Target roles:** `public`
- **Policy definition:**

```sql
bucket_id = 'inventory'
```

#### **Policy 2: INSERT (Upload)**

- **Nome:** `inventory_insert_policy`
- **Operação:** INSERT
- **Target roles:** `authenticated`
- **Policy definition:**

```sql
bucket_id = 'inventory' AND auth.role() = 'authenticated'
```

#### **Policy 3: UPDATE (Atualizar)**

- **Nome:** `inventory_update_policy`
- **Operação:** UPDATE
- **Target roles:** `authenticated`
- **Policy definition:**

```sql
bucket_id = 'inventory' AND auth.role() = 'authenticated'
```

#### **Policy 4: DELETE (Excluir)**

- **Nome:** `inventory_delete_policy`
- **Operação:** DELETE
- **Target roles:** `authenticated`
- **Policy definition:**

```sql
bucket_id = 'inventory' AND auth.role() = 'authenticated'
```

---

## 🛠️ **SOLUÇÃO 2: SQL Simplificado**

Se preferir usar SQL, execute estes comandos **UM POR VEZ**:

### **1. Criar bucket primeiro:**

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;
```

### **2. Verificar se foi criado:**

```sql
SELECT id, name, public FROM storage.buckets WHERE id = 'inventory';
```

### **3. Criar policy SELECT:**

```sql
CREATE POLICY "inventory_select_policy" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');
```

### **4. Criar policy INSERT:**

```sql
CREATE POLICY "inventory_insert_policy" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');
```

### **5. Criar policy UPDATE:**

```sql
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');
```

### **6. Criar policy DELETE:**

```sql
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');
```

### **7. Verificar policies criadas:**

```sql
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'objects'
AND policyname LIKE 'inventory_%';
```

---

## 🔍 **VERIFICAÇÃO FINAL**

Após criar as policies, verifique:

1. **Storage → Buckets:** Bucket `inventory` aparece
2. **Storage → Policies:** 4 policies com prefixo `inventory_`
3. **Teste upload:** Faça upload manual de uma imagem no bucket

---

## 🚨 **PROBLEMAS COMUNS**

### **Erro: "Policy já existe"**

```sql
-- Execute antes de criar:
DROP POLICY IF EXISTS "inventory_select_policy" ON storage.objects;
-- Depois crie a policy novamente
```

### **Erro: "Bucket não existe"**

- Primeiro crie o bucket na interface
- Depois crie as policies

### **Erro: "Permission denied"**

- Verifique se você é admin do projeto
- Tente usar a interface em vez do SQL

---

## ✅ **CHECKLIST DE VALIDAÇÃO**

Após configurar, verifique:

- [ ] Bucket `inventory` existe e é público
- [ ] 4 policies criadas (inventory_select, inventory_insert, inventory_update, inventory_delete)
- [ ] Upload manual funciona no Supabase Storage
- [ ] CDM Admin consegue fazer upload de imagem no inventário

---

## 🎯 **PRÓXIMO PASSO**

Após criar as policies:

1. **Teste no CDM Admin**
2. **Inventário → Adicionar Item**
3. **Upload de imagem**
4. **Verificar se funciona**

**Use a SOLUÇÃO 1 (interface) se SQL não funcionar!**
