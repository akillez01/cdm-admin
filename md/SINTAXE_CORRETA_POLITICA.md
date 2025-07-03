# 🚨 SINTAXE CORRETA - Política Supabase

## ❌ **ERROS IDENTIFICADOS:**

1. **"column avatars does not exist"** - Precisa de aspas simples para string
2. **"Cannot edit in read-only editor"** - Saia do template e crie nova política

## ✅ **SINTAXE CORRETA:**

### **POLÍTICA 1 (SELECT) - Leitura:**

**Policy name:**

```
Anyone can view avatars
```

**Allowed operation:**

- ✅ SELECT

**Policy definition:**

```
bucket_id = 'avatars'
```

### **POLÍTICA 2 (INSERT) - Upload:**

**Policy name:**

```
Authenticated users can upload avatars
```

**Allowed operation:**

- ✅ INSERT

**Policy definition:**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

## 🎯 **AÇÃO CORRETA:**

1. **Saia** do editor read-only atual
2. **Clique** em "New Policy" (não usar template)
3. **Use** aspas simples: `'avatars'` (não `avatars` nem `"avatars"`)

## 📋 **ALTERNATIVAS SE DER ERRO:**

### **Opção 1 - Mais específica:**

```
bucket_id = 'avatars' AND auth.uid() IS NOT NULL
```

### **Opção 2 - Simples:**

```
bucket_id = 'avatars'
```

### **Opção 3 - Completa:**

```
bucket_id = 'avatars' AND (auth.role() = 'authenticated' OR auth.role() = 'anon')
```

## ✅ **PASSO A PASSO:**

1. **Feche** qualquer editor aberto
2. **Vá para** Storage → Policies
3. **Clique** "New Policy"
4. **Preencha** com `bucket_id = 'avatars'`
5. **Salve**

---

**🎯 Use aspas simples: `'avatars'` e crie nova política (não edite template)!**
