# 🚨 CORREÇÃO DO ERRO SQL - Criar Buckets

## ❌ ERRO IDENTIFICADO

```
ERROR: 42601: syntax error at or near "NOT"
LINE 9: CREATE POLICY IF NOT EXISTS...
```

**Problema:** PostgreSQL não suporta `IF NOT EXISTS` para políticas.

## ✅ SOLUÇÃO CORRIGIDA

### 📋 **EXECUTE EM 2 PASSOS NO SQL EDITOR:**

### **PASSO 1: Criar Buckets**

Cole e execute este código primeiro:

```sql
-- Criar buckets
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar criação
SELECT id, name, public, created_at FROM storage.buckets
WHERE id IN ('avatars', 'members', 'sacramentos');
```

### **PASSO 2: Configurar Políticas**

Após o Passo 1 funcionar, execute:

```sql
-- Habilitar RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Política para visualização pública
CREATE POLICY "Public read access for all images" ON storage.objects
FOR SELECT USING (bucket_id IN ('avatars', 'members', 'sacramentos'));

-- Política para upload autenticado
CREATE POLICY "Authenticated upload access for all images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN ('avatars', 'members', 'sacramentos') AND auth.role() = 'authenticated');
```

## 🎯 **ALTERNATIVA SIMPLES**

Se ainda der erro, execute apenas:

```sql
-- Só criar buckets (o essencial)
INSERT INTO storage.buckets (id, name, public) VALUES
('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
```

**E configure as políticas manualmente no painel Storage → Policies**

## ✅ **TESTE IMEDIATO**

Após executar o PASSO 1:

1. Recarregue o CDM Admin
2. Teste upload de avatar no perfil
3. Deve funcionar: ✅ **"Imagem enviada com sucesso!"**

## 📁 **ARQUIVOS CORRIGIDOS**

- `PASSO_1_CRIAR_BUCKETS.sql` - Execute primeiro
- `PASSO_2_CONFIGURAR_POLITICAS.sql` - Execute depois
- `EXECUTAR_NO_SQL_EDITOR.sql` - Script corrigido completo

---

**🚀 Execute o PASSO 1 primeiro e teste o upload!**
