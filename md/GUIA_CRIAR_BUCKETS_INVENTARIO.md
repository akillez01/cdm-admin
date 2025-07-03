# 🗄️ GUIA PASSO A PASSO - CRIAR BUCKETS PARA INVENTÁRIO

## 🎯 **O que vamos criar**

3 buckets no Supabase Storage para armazenar imagens:

- 📦 **inventory** - Imagens do inventário geral
- 👤 **avatars** - Avatars de usuários e imagens gerais
- 🌿 **sacramentos** - Fotos dos sacramentos do Daime

---

## 📋 **PASSO 1: Acesse o Supabase Dashboard**

1. Abra seu navegador
2. Vá para: https://app.supabase.com
3. Faça login na sua conta
4. Selecione seu projeto CDM Admin

---

## 📋 **PASSO 2: Abra o SQL Editor**

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"+ New query"** ou use uma query existente
3. Limpe o editor se houver código

---

## 📋 **PASSO 3: Execute o SQL**

**Cole e execute este código:**

```sql
-- ========================================
-- CRIAR BUCKETS PARA INVENTÁRIO
-- ========================================

-- 1. Criar bucket para itens do inventário geral
INSERT INTO storage.buckets (id, name, public)
VALUES ('inventory', 'inventory', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar/verificar bucket avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Criar/verificar bucket sacramentos
INSERT INTO storage.buckets (id, name, public)
VALUES ('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- ========================================
-- POLÍTICAS DE ACESSO
-- ========================================

-- Leitura pública para inventory
CREATE POLICY IF NOT EXISTS "Public read access for inventory" ON storage.objects
FOR SELECT USING (bucket_id = 'inventory');

-- Upload autenticado para inventory
CREATE POLICY IF NOT EXISTS "Authenticated upload for inventory" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Update autenticado para inventory
CREATE POLICY IF NOT EXISTS "Authenticated update for inventory" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Delete autenticado para inventory
CREATE POLICY IF NOT EXISTS "Authenticated delete for inventory" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- Verificar criação
SELECT id, name, public FROM storage.buckets
WHERE id IN ('inventory', 'avatars', 'sacramentos');
```

4. Clique em **"Run"** ▶️
5. Você deve ver uma mensagem de sucesso

---

## 📋 **PASSO 4: Verificar os Buckets**

1. No menu lateral, clique em **"Storage"**
2. Você deve ver 3 buckets:

   - 📦 **inventory**
   - 👤 **avatars**
   - 🌿 **sacramentos**

3. Clique em cada bucket para verificar se estão vazios (normal)

---

## 📋 **PASSO 5: Teste o Upload (Opcional)**

1. Clique no bucket **inventory**
2. Clique em **"Upload file"**
3. Selecione uma imagem de teste
4. Se der erro de permissão, execute mais políticas (veja troubleshooting)

---

## 🔧 **TROUBLESHOOTING**

### ❌ **Erro: "Row Level Security"**

Execute estas políticas adicionais:

```sql
-- Políticas para avatars (se não existirem)
CREATE POLICY IF NOT EXISTS "Public read access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY IF NOT EXISTS "Authenticated upload for avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Políticas para sacramentos (se não existirem)
CREATE POLICY IF NOT EXISTS "Public read access for sacramentos" ON storage.objects
FOR SELECT USING (bucket_id = 'sacramentos');

CREATE POLICY IF NOT EXISTS "Authenticated upload for sacramentos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
```

### ❌ **Bucket já existe**

Isso é normal! O código usa `ON CONFLICT DO NOTHING` para não dar erro.

### ❌ **Política já existe**

Isso também é normal! O código usa `IF NOT EXISTS` para evitar duplicatas.

---

## ✅ **COMO SABER SE DEU CERTO**

1. **No Storage**: Você vê os 3 buckets
2. **Na aplicação**:
   - Vá em Inventário → Adicionar Item
   - Vá em Sacramento → Registrar Sacramento
   - Teste fazer upload de imagem
3. **URLs funcionando**: As imagens aparecem na lista

---

## 🎉 **RESULTADO ESPERADO**

Após seguir estes passos:

- ✅ Buckets criados no Supabase
- ✅ Políticas de acesso configuradas
- ✅ Upload de imagens funcionando
- ✅ Imagens aparecendo na lista do inventário

As imagens agora devem funcionar perfeitamente! 🖼️✨
