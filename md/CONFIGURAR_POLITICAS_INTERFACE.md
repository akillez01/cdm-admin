# 🚨 CONFIGURAR POLÍTICAS - Buckets Criados, Falta Autorização

## ✅ PROGRESSO ATUAL

- ✅ Buckets criados: `avatars`, `members`, `sacramentos`
- ❌ Erro: "new row violates row-level security policy"

## 🎯 SOLUÇÃO: Criar Políticas na Interface

### **PASSO 1: Política para AVATARS**

Na página **Storage → Policies** → **New Policy**:

#### **Política 1 - Leitura Pública de Avatars**

- **Policy name**: `Anyone can view avatars`
- **Allowed operation**: `SELECT`
- **Target**: `objects`
- **WITH CHECK expression**: deixe vazio
- **USING expression**: `bucket_id = 'avatars'`

#### **Política 2 - Upload de Avatars**

- **Policy name**: `Authenticated users can upload avatars`
- **Allowed operation**: `INSERT`
- **Target**: `objects`
- **WITH CHECK expression**: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`
- **USING expression**: deixe vazio

### **PASSO 2: Política para MEMBERS**

#### **Política 3 - Leitura Pública de Members**

- **Policy name**: `Anyone can view member photos`
- **Allowed operation**: `SELECT`
- **Target**: `objects`
- **WITH CHECK expression**: deixe vazio
- **USING expression**: `bucket_id = 'members'`

#### **Política 4 - Upload de Members**

- **Policy name**: `Authenticated users can upload member photos`
- **Allowed operation**: `INSERT`
- **Target**: `objects`
- **WITH CHECK expression**: `bucket_id = 'members' AND auth.role() = 'authenticated'`
- **USING expression**: deixe vazio

### **PASSO 3: Política para SACRAMENTOS**

#### **Política 5 - Leitura Pública de Sacramentos**

- **Policy name**: `Anyone can view sacramento photos`
- **Allowed operation**: `SELECT`
- **Target**: `objects`
- **WITH CHECK expression**: deixe vazio
- **USING expression**: `bucket_id = 'sacramentos'`

#### **Política 6 - Upload de Sacramentos**

- **Policy name**: `Authenticated users can upload sacramento photos`
- **Allowed operation**: `INSERT`
- **Target**: `objects`
- **WITH CHECK expression**: `bucket_id = 'sacramentos' AND auth.role() = 'authenticated'`
- **USING expression**: deixe vazio

## 🚀 **INÍCIO RÁPIDO: Apenas Avatars**

Para testar rapidamente, crie apenas as 2 primeiras políticas para `avatars`:

1. **New Policy** → **SELECT** → `bucket_id = 'avatars'`
2. **New Policy** → **INSERT** → `bucket_id = 'avatars' AND auth.role() = 'authenticated'`

## ✅ **TESTE APÓS CADA POLÍTICA**

Depois de criar as políticas para avatars:

1. **Recarregue** o CDM Admin
2. **Teste upload** de avatar no perfil
3. **Resultado esperado**: ✅ "Imagem enviada com sucesso!"

## 📋 **TEMPLATE PARA COPIAR/COLAR**

**Para SELECT (leitura):**

```
bucket_id = 'avatars'
```

**Para INSERT (upload):**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

**Para UPDATE (atualização):**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

**Para DELETE (exclusão):**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

## 🎯 **ORDEM DE PRIORIDADE**

1. **AVATARS** (para admin funcionar) ← **COMECE AQUI**
2. **MEMBERS** (para fotos de membros)
3. **SACRAMENTOS** (para fotos de estoque)

---

**🚀 Crie as 2 políticas para AVATARS primeiro e teste imediatamente!**
