# 🚨 SOLUÇÃO FINAL - Sem Erros de Permissão

## ❌ PROBLEMA IDENTIFICADO

```
ERROR: 42501: must be owner of table objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

**Causa:** Você não tem permissão de superusuário para alterar as políticas via SQL diretamente.

## ✅ SOLUÇÃO DEFINITIVA

### **PASSO 1: Execute SQL Simples**

No SQL Editor, cole apenas:

```sql
-- Criar buckets (sem políticas)
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar criação
SELECT id, name, public FROM storage.buckets
WHERE id IN ('avatars', 'members', 'sacramentos');
```

### **PASSO 2: Configurar Políticas Manualmente**

Vá para: **Storage** → **Policies** → **New Policy**

#### **Para bucket `avatars`:**

1. **Select operation** - "SELECT"

   - Policy name: `Public avatars read`
   - Target: `objects`
   - Using: `bucket_id = 'avatars'`

2. **Insert operation** - "INSERT"
   - Policy name: `Authenticated avatars upload`
   - Target: `objects`
   - With check: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`

#### **Para bucket `members`:**

1. **Select operation** - "SELECT"

   - Policy name: `Public members read`
   - Target: `objects`
   - Using: `bucket_id = 'members'`

2. **Insert operation** - "INSERT"
   - Policy name: `Authenticated members upload`
   - Target: `objects`
   - With check: `bucket_id = 'members' AND auth.role() = 'authenticated'`

#### **Para bucket `sacramentos`:**

1. **Select operation** - "SELECT"

   - Policy name: `Public sacramentos read`
   - Target: `objects`
   - Using: `bucket_id = 'sacramentos'`

2. **Insert operation** - "INSERT"
   - Policy name: `Authenticated sacramentos upload`
   - Target: `objects`
   - With check: `bucket_id = 'sacramentos' AND auth.role() = 'authenticated'`

## 🚀 **ALTERNATIVA AINDA MAIS SIMPLES**

Se as políticas parecerem complicadas:

1. **Execute apenas o PASSO 1** (criar buckets)
2. **Teste o upload** - mesmo sem políticas, pode funcionar se os buckets forem públicos
3. Se der erro de política, configure depois

## ✅ **TESTE IMEDIATO**

Após executar o PASSO 1:

1. ✅ **Recarregue** o CDM Admin
2. ✅ **Vá para o perfil** do admin (dropdown → Perfil)
3. ✅ **Teste upload** de avatar
4. ✅ **Resultado esperado**: "Imagem enviada com sucesso!"

## 📋 **CHECKLIST RÁPIDO**

- [ ] Execute `SCRIPT_SIMPLES_BUCKETS.sql`
- [ ] Veja os 3 buckets listados na query de verificação
- [ ] Teste upload de avatar no CDM Admin
- [ ] Se funcionar: ✅ **PRONTO!**
- [ ] Se não funcionar: Configure políticas manualmente

---

**🎯 Execute apenas o SQL simples e teste imediatamente!**

**Arquivo:** `SCRIPT_SIMPLES_BUCKETS.sql`
