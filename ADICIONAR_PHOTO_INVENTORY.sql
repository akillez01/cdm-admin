-- ========================================
-- ADICIONAR COLUNA PHOTO - INVENTORY_ITEMS
-- ========================================
-- Execute este SQL no Supabase para adicionar a coluna photo

-- Adicionar coluna photo na tabela inventory_items se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'inventory_items' 
        AND column_name = 'photo'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.inventory_items 
        ADD COLUMN photo TEXT;
        
        RAISE NOTICE 'Coluna photo adicionada à tabela inventory_items ✅';
    ELSE
        RAISE NOTICE 'Coluna photo já existe na tabela inventory_items ✅';
    END IF;
END $$;

-- Verificar se a coluna foi criada
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'inventory_items' 
    AND column_name = 'photo'
    AND table_schema = 'public';

-- Mostrar estrutura atualizada da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'inventory_items' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
