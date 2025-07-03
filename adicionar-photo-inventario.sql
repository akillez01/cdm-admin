-- Adicionar coluna photo às tabelas de inventário se não existir

-- Tabela inventory_items (inventário geral)
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
        
        RAISE NOTICE 'Coluna photo adicionada à tabela inventory_items';
    ELSE
        RAISE NOTICE 'Coluna photo já existe na tabela inventory_items';
    END IF;
END $$;

-- Verificar se as colunas foram criadas
SELECT 
    'inventory_items' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'inventory_items' 
    AND column_name = 'photo'
    AND table_schema = 'public'

UNION ALL

SELECT 
    'daime_inventory' as tabela,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'daime_inventory' 
    AND column_name = 'photo'
    AND table_schema = 'public';
