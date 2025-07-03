# 🚨 SOLUÇÃO RÁPIDA - Bucket 'avatars' Não Encontrado

## ❌ PROBLEMA IDENTIFICADO

```
Erro no upload:
Object { statusCode: "404", error: "Bucket not found", message: "Bucket not found" }
```

O bucket `avatars` não existe no Supabase Storage, por isso o upload do avatar do admin está falando.

## ✅ SOLUÇÃO IMEDIATA

### Passo 1: Abrir Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Entre no seu projeto CDM Admin
3. Vá para **Storage** → **Buckets**

### Passo 2: Criar Buckets Obrigatórios

**Clique em "New Bucket" e crie:**

1. **Bucket `avatars`**

   - Nome: `avatars`
   - ✅ Public bucket: **SIM**
   - ✅ File size limit: 50MB
   - ✅ Allowed MIME types: image/\*

2. **Bucket `members`**

   - Nome: `members`
   - ✅ Public bucket: **SIM**
   - ✅ File size limit: 50MB
   - ✅ Allowed MIME types: image/\*

3. **Bucket `sacramentos`**
   - Nome: `sacramentos`
   - ✅ Public bucket: **SIM**
   - ✅ File size limit: 50MB
   - ✅ Allowed MIME types: image/\*

### Passo 3: Configurar Políticas (SQL Editor)

Vá para **SQL Editor** e execute o arquivo: `create-storage-complete.sql`

**OU copie e cole este comando:**

```sql
-- Criar bucket 'avatars'
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'avatars');

-- Criar políticas básicas para avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

### Passo 4: Verificar Buckets Criados

Execute no SQL Editor:

```sql
SELECT id, name, public, created_at
FROM storage.buckets
ORDER BY created_at DESC;
```

## 🧪 TESTE IMEDIATO

Após criar os buckets:

1. **Recarregue a página** do CDM Admin
2. Vá para o **dropdown do usuário** (canto superior direito)
3. Clique em **"Perfil"**
4. Tente fazer **upload de uma imagem** de avatar
5. Deve aparecer: **"Imagem enviada com sucesso!"**

## 📋 CHECKLIST RÁPIDO

- [ ] Bucket `avatars` criado (público)
- [ ] Bucket `members` criado (público)
- [ ] Bucket `sacramentos` criado (público)
- [ ] Políticas básicas configuradas
- [ ] Teste de upload do avatar funcionando

## ⚡ COMANDO SQL COMPLETO (COPIAR/COLAR)

```sql
-- Criar todos os buckets necessários
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas básicas para todos os buckets
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id IN ('avatars', 'members', 'sacramentos'));

CREATE POLICY "Authenticated upload access" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');

-- Verificar buckets criados
SELECT id, name, public FROM storage.buckets WHERE id IN ('avatars', 'members', 'sacramentos');
```

---

**🎯 Execute estes passos e o upload de avatar funcionará imediatamente!**
