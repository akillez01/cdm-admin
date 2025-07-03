# 🚨 CORREÇÃO DOS ERROS - Política do Supabase

## ❌ **ERROS IDENTIFICADOS:**

1. **"syntax error at or near CREATE"**

   - Você colocou `CREATE POLICY` na definição
   - Na definição, coloque **apenas a condição**

2. **"Cannot edit in read-only editor"**
   - Você está em modo de visualização
   - Precisa criar nova política

## ✅ **SOLUÇÃO CORRETA:**

### **PASSO 1: Criar Nova Política**

- Clique em **"New Policy"** ou **"Add Policy"**
- NÃO use o editor que está read-only

### **PASSO 2: Preencher Corretamente**

**Policy name:**

```
Anyone can view avatars
```

**Allowed operation:**

- ✅ **SELECT** apenas

**Target roles:**

- Deixe vazio

**Policy definition:** ⚠️ **SEM** `CREATE POLICY` - apenas:

```
bucket_id = 'avatars'
```

## 🎯 **IMPORTANTE - O QUE NÃO FAZER:**

❌ **ERRADO** (não coloque isso na definição):

```sql
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

✅ **CORRETO** (apenas isso na definição):

```
bucket_id = 'avatars'
```

## 🚀 **AÇÃO IMEDIATA:**

1. **Feche** o editor read-only
2. **Clique** em "New Policy"
3. **Preencha** apenas com: `bucket_id = 'avatars'`
4. **Salve** a política

## 📋 **VALORES CORRETOS PARA COPIAR:**

**POLÍTICA 1:**

- Nome: `Anyone can view avatars`
- Operação: `SELECT`
- Definição: `bucket_id = 'avatars'`

**POLÍTICA 2:**

- Nome: `Authenticated users can upload avatars`
- Operação: `INSERT`
- Definição: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`

---

**🎯 Clique em "New Policy" e use apenas a condição simples!**
