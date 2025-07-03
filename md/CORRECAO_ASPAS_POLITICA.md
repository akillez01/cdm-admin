# 🚨 ERRO DE ASPAS CORRIGIDO - Política Supabase

## ❌ **ERRO IDENTIFICADO:**

```
unterminated quoted string at or near "'authenticated''"
```

**Problema:** Aspas simples incorretas na expressão SQL.

## ✅ **CORREÇÃO IMEDIATA:**

### **POLÍTICA PARA LEITURA (SELECT):**

**Policy name:**

```
Anyone can view avatars
```

**Allowed operation:**

- ✅ SELECT

**Policy definition:** (usar aspas duplas)

```
bucket_id = "avatars"
```

### **POLÍTICA PARA UPLOAD (INSERT):**

**Policy name:**

```
Authenticated users can upload avatars
```

**Allowed operation:**

- ✅ INSERT

**Policy definition:** (usar aspas duplas)

```
bucket_id = "avatars" AND auth.role() = "authenticated"
```

## 🎯 **ALTERNATIVA SEM ASPAS:**

Se ainda der erro com aspas duplas, tente **sem aspas**:

**Para SELECT:**

```
bucket_id = avatars
```

**Para INSERT:**

```
bucket_id = avatars AND auth.role() = authenticated
```

## 🚀 **ALTERNATIVA SIMPLES:**

Use apenas o nome do bucket:

**Policy definition:**

```
avatars
```

## 📋 **TESTE CADA VERSÃO:**

1. **Primeira tentativa:** `bucket_id = "avatars"`
2. **Se der erro:** `bucket_id = avatars`
3. **Se ainda der erro:** `avatars`

## ✅ **ORDEM DE TESTE:**

1. Crie política SELECT primeiro
2. Teste no CDM Admin
3. Se funcionar, crie política INSERT
4. Teste upload completo

---

**🎯 Use aspas duplas ou tente sem aspas para evitar o erro!**
