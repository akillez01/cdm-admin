# 🚀 BUCKET INVENTORY - CONFIGURAÇÃO FINAL

## 📋 **Status Atual**

✅ **Buckets já configurados:**

- `avatars` (fotos de perfil admin)
- `members` (fotos de membros)
- `sacramentos` (fotos de sacramentos)

🎯 **Falta configurar:**

- `inventory` (fotos do inventário geral)

---

## 🛠️ **CONFIGURAÇÃO RÁPIDA**

### **Opção 1: SQL Completo (RECOMENDADO)**

1. **Acesse:** https://app.supabase.com → Seu projeto → SQL Editor
2. **Execute:** `CRIAR_BUCKET_INVENTORY_FINAL.sql`
3. **Resultado esperado:**
   - ✅ Bucket criado
   - ✅ 4 policies configuradas
   - ✅ Mensagem de sucesso

### **Opção 2: Interface Manual**

Se preferir usar a interface:

1. **Storage** → **New bucket** → Nome: `inventory` → Public: ✅
2. **Policies** → **New Policy** → Para cada operação:

```sql
-- SELECT (leitura pública)
bucket_id = 'inventory'

-- INSERT (upload autenticado)
bucket_id = 'inventory' AND auth.role() = 'authenticated'

-- UPDATE (update autenticado)
bucket_id = 'inventory' AND auth.role() = 'authenticated'

-- DELETE (delete autenticado)
bucket_id = 'inventory' AND auth.role() = 'authenticated'
```

---

## 🧪 **TESTES APÓS CONFIGURAÇÃO**

### **1. Verificar no Supabase**

- **Storage** → Deve aparecer `📦 inventory`
- **Policies** → Deve ter 4 policies com prefixo `inventory_`

### **2. Testar no CDM Admin**

1. **Login** no sistema
2. **Inventário Geral** → **Adicionar Item**
3. **Upload de imagem** → Escolher arquivo
4. **Resultado esperado:** ✅ "Imagem enviada com sucesso!"
5. **Salvar item** → Verificar se imagem aparece na lista

### **3. Verificar URLs das imagens**

- URLs devem seguir padrão: `https://[projeto].supabase.co/storage/v1/object/public/inventory/[arquivo]`

---

## 🏗️ **ESTRUTURA COMPLETA DOS BUCKETS**

Após configuração, você terá:

```
📦 Supabase Storage
├── 📁 avatars        (admin profiles)
├── 📁 members        (member photos)
├── 📁 sacramentos    (sacrament photos)
└── 📁 inventory      (inventory photos) ← NOVO
```

**Todas com mesmo padrão de policies:**

- 👀 **SELECT:** Leitura pública
- 📤 **INSERT:** Upload só para autenticados
- ✏️ **UPDATE:** Update só para autenticados
- 🗑️ **DELETE:** Delete só para autenticados

---

## 🔧 **TROUBLESHOOTING**

### **Erro: Policy já existe**

**Solução:** O SQL final já inclui `DROP POLICY IF EXISTS` antes de criar

### **Erro: Bucket já existe**

**Solução:** O SQL usa `ON CONFLICT (id) DO NOTHING`

### **Upload falha**

**Verificar:**

1. Usuário está logado?
2. Policy INSERT foi criada?
3. Bucket é público?

### **Imagem não aparece**

**Verificar:**

1. Policy SELECT foi criada?
2. URL da imagem está correta?
3. Bucket é público?

---

## 📝 **PRÓXIMOS PASSOS**

Após configurar o bucket `inventory`:

1. ✅ **Teste upload** no inventário geral
2. ✅ **Verifique visualização** das imagens
3. ✅ **Confirme consistência** com outros buckets
4. 🎉 **Sistema completo!**

---

## 🆘 **SUPORTE**

Se encontrar problemas:

1. **Verifique** se todas as 4 policies foram criadas
2. **Teste** com outro arquivo de imagem
3. **Consulte** logs do browser (F12 → Console)
4. **Compare** com buckets que funcionam (avatars, members)

**Sistema estará 100% funcional após esta configuração!** 🚀
