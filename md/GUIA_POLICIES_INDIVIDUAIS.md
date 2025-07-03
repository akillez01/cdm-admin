# 🔧 POLICIES UPDATE E DELETE - POR BUCKET

## 📸 **AVATARS**

```sql
-- UPDATE para avatars
CREATE POLICY "avatars_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- DELETE para avatars
CREATE POLICY "avatars_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');
```

## 👥 **MEMBERS**

```sql
-- UPDATE para members
CREATE POLICY "members_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'members' AND auth.role() = 'authenticated');

-- DELETE para members
CREATE POLICY "members_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'members' AND auth.role() = 'authenticated');
```

## 🏆 **SACRAMENTOS**

```sql
-- UPDATE para sacramentos
CREATE POLICY "sacramentos_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

-- DELETE para sacramentos
CREATE POLICY "sacramentos_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
```

## 📦 **INVENTORY** (já tem)

```sql
-- UPDATE para inventory (já criado)
CREATE POLICY "inventory_update_policy" ON storage.objects
FOR UPDATE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');

-- DELETE para inventory (já criado)
CREATE POLICY "inventory_delete_policy" ON storage.objects
FOR DELETE USING (bucket_id = 'inventory' AND auth.role() = 'authenticated');
```

---

## 🎯 **ESTRUTURA FINAL DESEJADA**

Cada bucket deve ter **4 policies**:

```
📁 avatars/
├── SELECT   (leitura pública) ✅ já tem
├── INSERT   (upload auth)     ✅ já tem
├── UPDATE   (update auth)     ❌ criar
└── DELETE   (delete auth)     ❌ criar

📁 members/
├── SELECT   (leitura pública) ✅ já tem
├── INSERT   (upload auth)     ✅ já tem
├── UPDATE   (update auth)     ❌ criar
└── DELETE   (delete auth)     ❌ criar

📁 sacramentos/
├── SELECT   (leitura pública) ✅ já tem
├── INSERT   (upload auth)     ✅ já tem
├── UPDATE   (update auth)     ❌ criar
└── DELETE   (delete auth)     ❌ criar

📁 inventory/
├── SELECT   (leitura pública) ✅ já tem
├── INSERT   (upload auth)     ✅ já tem
├── UPDATE   (update auth)     ✅ já tem
└── DELETE   (delete auth)     ✅ já tem
```

---

## 🚀 **OPÇÕES DE EXECUÇÃO**

### **Opção 1: Tudo de uma vez**

Execute o arquivo `COMPLETAR_TODAS_POLICIES.sql`

### **Opção 2: Um bucket por vez**

Copie e cole os comandos SQL de cada bucket individualmente

### **Opção 3: Via interface**

1. Storage → Policies → New Policy
2. Para cada bucket, crie policies UPDATE e DELETE
3. Use as definições SQL acima

---

## ✅ **VERIFICAÇÃO**

Após criar todas as policies, você deve ter:

- **16 policies** no total (4 por bucket × 4 buckets)
- Todos os buckets com funcionalidade completa
- Sistema de upload 100% consistente

**Execute e me diga se algum comando der erro!** 🚀
