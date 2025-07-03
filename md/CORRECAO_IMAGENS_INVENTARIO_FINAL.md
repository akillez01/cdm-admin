# 🔧 CORREÇÃO - IMAGENS INVENTÁRIO GERAL NÃO APARECEM

## 🎯 **Problemas Identificados**

### ✅ **O que já funciona:**

- Upload da imagem ✅ (log mostra: `inventory/itens/itens_1751503349368.png`)
- Sacramento do Daime ✅ (imagens aparecem)

### ❌ **O que não funcionava:**

- Imagens do inventário geral não apareciam na lista
- Mapeamento incorreto nos métodos `addInventoryItem` e `updateInventoryItem`

## 🔧 **Correções Aplicadas**

### **1. Mapeamento no useSupabase.ts**

```typescript
// ❌ ANTES (não mapeava o campo photo)
const addInventoryItem = async (item) => {
  const { data, error } = await supabase.from("inventory_items").insert(item);
  return data; // ❌ Retornava dados direto do banco (snake_case)
};

// ✅ DEPOIS (mapeia corretamente)
const addInventoryItem = async (item) => {
  const { data, error } = await supabase.from("inventory_items").insert(item);
  return {
    id: data.id,
    name: data.name,
    // ...outros campos...
    photo: data.photo, // ✅ Campo photo mapeado
  };
};
```

### **2. Arquivo Corrigido:** `/src/hooks/useSupabase.ts`

- ✅ `addInventoryItem()` - Agora mapeia campo photo
- ✅ `updateInventoryItem()` - Agora mapeia campo photo
- ✅ `getInventory()` - Já estava correto

## 📋 **Passos para Finalizar**

### **PASSO 1: Verificar coluna no banco**

Execute este SQL no Supabase:

```sql
-- Adicionar coluna photo se não existir
ALTER TABLE public.inventory_items
ADD COLUMN IF NOT EXISTS photo TEXT;

-- Verificar
SELECT column_name FROM information_schema.columns
WHERE table_name = 'inventory_items' AND column_name = 'photo';
```

### **PASSO 2: Testar na aplicação**

1. Acesse **Inventário → Inventário Geral**
2. Edite um item existente
3. Faça upload de uma imagem
4. Salve e verifique se a imagem aparece na lista

## 🧪 **Teste de Verificação**

### **Console Logs Esperados:**

```
✅ Upload realizado: https://[projeto].supabase.co/storage/v1/object/public/inventory/itens/[arquivo].png
🔄 Recarregando inventário...
✅ Inventário recarregado: X itens
```

### **Resultado Visual:**

- ✅ Imagem aparece na coluna "Imagem" (desktop)
- ✅ Imagem aparece ao lado do nome (mobile)
- ✅ Fallback (ícone) quando sem imagem

## 📁 **Arquivos SQL Criados**

1. **`ADICIONAR_PHOTO_INVENTORY.sql`** - Adiciona coluna photo apenas no inventory_items
2. **`adicionar-photo-inventario.sql`** - Versão atualizada (só inventory_items)

## ✨ **Status Atual**

- ✅ **Upload funcionando** (storage inventory/itens/)
- ✅ **Mapeamento corrigido** (useSupabase.ts)
- ✅ **Formulário funcionando** (InventoryForm.tsx)
- ✅ **Visualização preparada** (InventoryList.tsx)
- ⏳ **Aguardando**: Execução do SQL no banco

Após executar o SQL, as imagens do inventário geral devem aparecer perfeitamente! 🎯
