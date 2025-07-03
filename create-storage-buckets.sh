#!/bin/bash

# Script para criar buckets de imagens no Supabase Storage
# CDM Admin - Upload de Imagens

echo "🗄️ Criando buckets para upload de imagens..."

# Verificar se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI não encontrado. Instale com: npm install -g supabase"
    exit 1
fi

echo "📦 Criando bucket 'members' para fotos de membros..."
supabase storage create-bucket members --public || echo "⚠️ Bucket 'members' pode já existir"

echo "📦 Criando bucket 'sacramentos' para fotos de sacramentos..."
supabase storage create-bucket sacramentos --public || echo "⚠️ Bucket 'sacramentos' pode já existir"

echo "📦 Verificando bucket 'avatars' para avatars de admin..."
supabase storage create-bucket avatars --public || echo "⚠️ Bucket 'avatars' pode já existir"

echo ""
echo "🔐 Configurando políticas de acesso..."

# Políticas para bucket 'members'
echo "Configurando políticas para bucket 'members'..."
supabase sql --db-url "$DATABASE_URL" --file - <<EOF
-- Política para upload de fotos de membros
CREATE POLICY "Admins can upload member photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'members' AND auth.role() = 'authenticated');

-- Política para visualização pública de fotos de membros
CREATE POLICY "Public can view member photos" ON storage.objects
FOR SELECT USING (bucket_id = 'members');

-- Política para atualização de fotos de membros
CREATE POLICY "Admins can update member photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'members' AND auth.role() = 'authenticated');

-- Política para deletar fotos de membros
CREATE POLICY "Admins can delete member photos" ON storage.objects
FOR DELETE USING (bucket_id = 'members' AND auth.role() = 'authenticated');
EOF

# Políticas para bucket 'sacramentos'
echo "Configurando políticas para bucket 'sacramentos'..."
supabase sql --db-url "$DATABASE_URL" --file - <<EOF
-- Política para upload de fotos de sacramentos
CREATE POLICY "Admins can upload sacramento photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

-- Política para visualização pública de fotos de sacramentos
CREATE POLICY "Public can view sacramento photos" ON storage.objects
FOR SELECT USING (bucket_id = 'sacramentos');

-- Política para atualização de fotos de sacramentos
CREATE POLICY "Admins can update sacramento photos" ON storage.objects
FOR UPDATE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

-- Política para deletar fotos de sacramentos
CREATE POLICY "Admins can delete sacramento photos" ON storage.objects
FOR DELETE USING (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');
EOF

echo ""
echo "✅ Configuração de buckets concluída!"
echo ""
echo "📋 Buckets criados:"
echo "   - avatars (para avatars de admin)"
echo "   - members (para fotos de membros)"
echo "   - sacramentos (para fotos de sacramentos)"
echo ""
echo "🔗 Verifique no painel do Supabase:"
echo "   https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/storage/buckets"
echo ""
echo "📝 Próximos passos:"
echo "   1. Testar upload de imagens no sistema"
echo "   2. Verificar se as políticas estão funcionando"
echo "   3. Fazer deploy das alterações"
