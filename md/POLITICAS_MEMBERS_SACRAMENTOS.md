# 🎯 CRIAR POLÍTICAS - Members e Sacramentos

## ✅ **SUCESSO COM AVATARS - REPLICAR PARA OUTROS BUCKETS**

Agora que funcionou para `avatars`, vamos criar para `members` e `sacramentos` usando a **mesma estrutura**.

## 📋 **POLÍTICAS PARA BUCKET `MEMBERS`**

### **POLÍTICA 1 - Leitura de Members**

**Clique na seção `members` → New Policy**

- **Policy name**: `Anyone can view member photos`
- **Allowed operation**: ✅ **SELECT**
- **Policy definition**: `bucket_id = 'members'`

### **POLÍTICA 2 - Upload de Members**

**Criar segunda política para members**

- **Policy name**: `Authenticated users can upload member photos`
- **Allowed operation**: ✅ **INSERT**
- **Policy definition**: `bucket_id = 'members' AND auth.role() = 'authenticated'`

## 📋 **POLÍTICAS PARA BUCKET `SACRAMENTOS`**

### **POLÍTICA 3 - Leitura de Sacramentos**

**Clique na seção `sacramentos` → New Policy**

- **Policy name**: `Anyone can view sacramento photos`
- **Allowed operation**: ✅ **SELECT**
- **Policy definition**: `bucket_id = 'sacramentos'`

### **POLÍTICA 4 - Upload de Sacramentos**

**Criar segunda política para sacramentos**

- **Policy name**: `Authenticated users can upload sacramento photos`
- **Allowed operation**: ✅ **INSERT**
- **Policy definition**: `bucket_id = 'sacramentos' AND auth.role() = 'authenticated'`

## 🚀 **ORDEM RECOMENDADA:**

1. **Termine** a segunda política do `avatars` (INSERT)
2. **Teste** upload de avatar funcionando
3. **Crie** políticas para `members` (SELECT + INSERT)
4. **Crie** políticas para `sacramentos` (SELECT + INSERT)

## 📝 **TEMPLATE PARA COPIAR/COLAR:**

### **Para SELECT (leitura):**

```
bucket_id = 'NOME_DO_BUCKET'
```

### **Para INSERT (upload):**

```
bucket_id = 'NOME_DO_BUCKET' AND auth.role() = 'authenticated'
```

**Substitua `NOME_DO_BUCKET` por:**

- `'members'` para fotos de membros
- `'sacramentos'` para fotos de sacramentos

## ✅ **RESULTADO FINAL:**

Depois de criar todas:

- ✅ Upload de avatar admin (avatars)
- ✅ Upload de foto de membro (members)
- ✅ Upload de foto de sacramento (sacramentos)

## 🎯 **TESTE CADA BUCKET:**

1. **Avatars**: Perfil do admin
2. **Members**: Formulário de membro
3. **Sacramentos**: Formulário de sacramento

---

**🚀 Use o mesmo padrão que funcionou para avatars!**
