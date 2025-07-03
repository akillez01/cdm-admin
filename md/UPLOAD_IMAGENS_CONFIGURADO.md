# 📁 Configurar Upload de Imagens - Supabase Storage

## ✅ **Upload de arquivos configurado no código!**

### 🎯 **Funcionalidades adicionadas:**

- 📁 **Seleção de arquivo** do computador
- 🔄 **Upload automático** para Supabase Storage
- 🖼️ **Preview da imagem** antes de salvar
- ⚡ **Indicadores de progresso** (enviando/salvando)
- 🔗 **Alternativa URL** (se preferir link externo)

---

## 🔧 **PASSO 1: Criar bucket no Supabase**

### **Dashboard já aberto:** https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/storage/buckets

1. **Clique em "New Bucket"**
2. **Nome**: `avatars`
3. **Public bucket**: ✅ **SIM** (marque esta opção)
4. **File size limit**: `10 MB`
5. **Allowed MIME types**: `image/*`
6. **Clique "Save"**

### **Configurações de segurança (RLS):**

Após criar o bucket, configure as políticas:

1. **Vá para**: Storage > avatars > Policies
2. **Clique**: "New Policy"
3. **Template**: "Allow public read access"
4. **Clique**: "Create Policy"

---

## 🧪 **PASSO 2: Testar upload**

### **Como testar:**

1. **Faça login** no sistema
2. **Clique no seu avatar** (header, canto superior direito)
3. **Selecione "Editar Perfil"**
4. **Você verá**:

   ```
   📁 Escolher arquivo do computador
   [Botão de upload]

   --------- OU ---------

   🔗 URL da imagem (opcional)
   [Campo de texto]
   ```

5. **Selecione uma imagem** do seu computador
6. **Veja o preview** aparecer
7. **Clique "Salvar Perfil"**
8. **Aguarde** "Enviando imagem..." → "Salvando..."
9. **Sucesso!** Avatar atualizado

---

## ⚠️ **Se der erro:**

### **Erro "Bucket not found":**

- Bucket ainda não foi criado
- Siga o Passo 1 acima

### **Erro "Not allowed":**

- Policies não configuradas
- Configure acesso público no bucket

### **Erro 400/403:**

- Verificar se o bucket é público
- Verificar tamanho do arquivo (max 10MB)

---

## 🎨 **Interface atualizada:**

```
┌─── Editar Perfil ────────────────────┐
│                                     │
│        [🖼️ Preview da imagem]        │
│                                     │
│ 📁 Escolher arquivo do computador    │
│ [Browse...] ✅ imagem.jpg           │
│                                     │
│ ─────────── OU ─────────────────    │
│                                     │
│ 🔗 URL da imagem (opcional)          │
│ [https://exemplo.com/foto.jpg]      │
│                                     │
│ 👤 Nome: [Admin User]               │
│ 📧 Email: admin@cdm.com             │
│                                     │
│    [Cancelar]  [Salvar Perfil]      │
│                                     │
└─────────────────────────────────────┘
```

---

## 🚀 **Status:**

- ✅ **Código configurado** para upload
- ⏳ **Bucket precisa ser criado** no Supabase
- 🎯 **Após criar bucket**: Funcionalidade completa

**Crie o bucket "avatars" no Supabase e teste o upload!** 📁✨
