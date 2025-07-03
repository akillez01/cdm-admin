-- PASSO 1: Criar buckets (execute primeiro)
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('members', 'members', true),
('sacramentos', 'sacramentos', true)
ON CONFLICT (id) DO NOTHING;

-- Verificar se buckets foram criados
SELECT id, name, public, created_at FROM storage.buckets 
WHERE id IN ('avatars', 'members', 'sacramentos');
