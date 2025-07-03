# 🎯 USAR TEMPLATE DO SUPABASE - Criar Política para Avatars

## ✅ VOCÊ ESTÁ NO LUGAR CERTO!

Vejo que o Supabase está oferecendo templates. Vamos usar o **primeiro template** e adaptá-lo.

## 🚀 **OPÇÃO 1: Usar Template Adaptado**

### **PASSO 1: Escolher Template**

- Clique no template: **"Allow access to JPG images in a public folder to anonymous users"**

### **PASSO 2: Modificar o Código**

Quando abrir o template, **substitua todo o código** por:

```sql
-- Política para visualização pública de avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### **PASSO 3: Salvar**

- Clique **"Save policy"**

## 🚀 **OPÇÃO 2: Criar Manualmente**

Se preferir não usar template:

### **POLÍTICA 1 - Leitura (SELECT)**

- Clique em **"Create new policy"** ou **"Start from scratch"**
- **Policy name**: `Anyone can view avatars`
- **Allowed operation**: Marque apenas ✅ **SELECT**
- **Target**: `objects`
- **USING expression**: `bucket_id = 'avatars'`

### **POLÍTICA 2 - Upload (INSERT)**

- Criar nova política
- **Policy name**: `Authenticated users can upload avatars`
- **Allowed operation**: Marque apenas ✅ **INSERT**
- **Target**: `objects`
- **WITH CHECK expression**: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`

## 📋 **CÓDIGOS PARA COPIAR/COLAR**

### **Política SELECT (leitura):**

```sql
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

### **Política INSERT (upload):**

```sql
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## ✅ **ORDEM RECOMENDADA**

1. **Primeira**: Crie política SELECT (leitura)
2. **Segunda**: Crie política INSERT (upload)
3. **Teste**: Upload de avatar no CDM Admin

## 🎯 **RESULTADO ESPERADO**

Após criar as políticas:

- ✅ Upload de avatar funciona
- ✅ Mensagem: "Imagem enviada com sucesso!"
- ✅ Avatar aparece no perfil

---

**🚀 Use qualquer opção e teste imediatamente após criar cada política!**
