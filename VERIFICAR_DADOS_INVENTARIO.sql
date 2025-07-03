-- ===================================
-- VERIFICAR DADOS DO INVENTÁRIO
-- ===================================
-- SQL para verificar se as imagens estão sendo salvas

-- 1. Verificar se a coluna 'photo' existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'inventory_items' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar os últimos itens salvos
SELECT 
    id,
    name,
    photo,
    created_at,
    CASE 
        WHEN photo IS NULL THEN '❌ SEM FOTO'
        WHEN photo = '' THEN '⚠️ FOTO VAZIA'
        ELSE '✅ TEM FOTO'
    END as status_foto
FROM inventory_items 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Verificar especificamente o item com a imagem enviada
SELECT 
    id,
    name,
    photo,
    created_at
FROM inventory_items 
WHERE photo LIKE '%itens_1751504203827.png%'
OR photo LIKE '%inventory%'
ORDER BY created_at DESC;

-- 4. Contar itens com e sem foto
SELECT 
    CASE 
        WHEN photo IS NULL OR photo = '' THEN 'SEM_FOTO'
        ELSE 'COM_FOTO'
    END as categoria,
    COUNT(*) as total
FROM inventory_items 
GROUP BY CASE 
    WHEN photo IS NULL OR photo = '' THEN 'SEM_FOTO'
    ELSE 'COM_FOTO'
END;

-- 5. Verificar se a URL da imagem está correta
SELECT 
    id,
    name,
    photo,
    CASE 
        WHEN photo LIKE 'https://%.supabase.co/storage/v1/object/public/inventory/%' THEN '✅ URL CORRETA'
        WHEN photo LIKE '%inventory%' THEN '⚠️ URL PARCIAL'
        WHEN photo IS NOT NULL THEN '❌ URL INCORRETA'
        ELSE '❌ SEM URL'
    END as url_status
FROM inventory_items 
WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
ORDER BY created_at DESC;

-- ===================================
-- INSTRUÇÕES:
-- ===================================
-- 1. Execute estas queries no Supabase SQL Editor
-- 2. Verifique se a coluna 'photo' existe
-- 3. Veja se os itens recentes têm URLs de foto
-- 4. Confirme se a URL está no formato correto
-- ===================================
