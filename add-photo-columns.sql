-- Script SQL para adicionar campos de foto/imagem
-- CDM Admin - Upload de Imagens

-- Adicionar campo photo na tabela de membros
ALTER TABLE members ADD COLUMN IF NOT EXISTS photo TEXT;

-- Adicionar campo photo na tabela de inventário de daime
ALTER TABLE daime_inventory ADD COLUMN IF NOT EXISTS photo TEXT;

-- Comentários das colunas para documentação
COMMENT ON COLUMN members.photo IS 'URL da foto do membro (Supabase Storage ou URL externa)';
COMMENT ON COLUMN daime_inventory.photo IS 'URL da foto do sacramento para registro visual (Supabase Storage ou URL externa)';

-- Verificar se as colunas foram adicionadas
SELECT 
    table_name, 
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('members', 'daime_inventory') 
  AND column_name = 'photo'
ORDER BY table_name, column_name;
