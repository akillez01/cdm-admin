-- SCRIPT SIMPLIFICADO - SEM ERROS DE PERMISSÃO
-- Execute apenas este comando no SQL Editor

-- Criar apenas os buckets (isso funciona sempre)
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar se os buckets foram criados
SELECT 
    id as bucket_name,
    name,
    public,
    created_at
FROM storage.buckets 
WHERE id IN ('avatars', 'members', 'sacramentos')
ORDER BY id;
