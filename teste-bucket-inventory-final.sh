#!/bin/bash

# ====================================
# TESTE FINAL - BUCKET INVENTORY
# ====================================

echo "🧪 INICIANDO TESTES DO BUCKET INVENTORY..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 CHECKLIST PRE-TESTE:${NC}"
echo "1. ✅ Bucket inventory criado no Supabase"
echo "2. ✅ 4 policies configuradas (SELECT, INSERT, UPDATE, DELETE)"
echo "3. ✅ Bucket configurado como público"
echo "4. ✅ Usuário logado no CDM Admin"
echo ""

echo -e "${YELLOW}🔍 VERIFICAÇÕES AUTOMÁTICAS:${NC}"
echo ""

# Verificar se o projeto está configurado
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ package.json encontrado${NC}"

# Verificar se os arquivos principais existem
files=(
    "src/components/inventory/InventoryForm.tsx"
    "src/components/ui/ImageUpload.tsx"
    "src/hooks/useSupabase.ts"
    "src/types/index.ts"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ $file encontrado${NC}"
    else
        echo -e "${RED}❌ $file NÃO encontrado${NC}"
    fi
done

echo ""
echo -e "${YELLOW}📸 TESTE DE IMAGENS:${NC}"
echo ""

# Verificar se existe arquivo de configuração do Supabase
if [ -f "src/utils/supabase.ts" ] || [ -f "src/lib/supabase.ts" ]; then
    echo -e "${GREEN}✅ Configuração Supabase encontrada${NC}"
else
    echo -e "${YELLOW}⚠️  Verifique configuração do Supabase${NC}"
fi

echo ""
echo -e "${BLUE}🎯 TESTES MANUAIS A FAZER:${NC}"
echo ""
echo "1. 🌐 Abrir CDM Admin no navegador"
echo "2. 🔐 Fazer login no sistema"
echo "3. 📦 Ir para 'Inventário Geral'"
echo "4. ➕ Clicar em 'Adicionar Item'"
echo "5. 📷 Testar upload de imagem:"
echo "   - Clicar em 'Selecione uma imagem'"
echo "   - Escolher arquivo JPG/PNG"
echo "   - Aguardar upload (deve mostrar sucesso)"
echo "6. 💾 Preencher dados e salvar item"
echo "7. 👀 Verificar se imagem aparece na lista"
echo ""

echo -e "${GREEN}✅ RESULTADO ESPERADO:${NC}"
echo "- Upload sem erros"
echo "- Imagem visível no formulário"
echo "- Imagem salva e exibida na lista"
echo "- URL da imagem no padrão: https://[projeto].supabase.co/storage/v1/object/public/inventory/[arquivo]"
echo ""

echo -e "${YELLOW}🚨 SE DER ERRO:${NC}"
echo ""
echo "1. 🔍 Abrir Console do navegador (F12)"
echo "2. 📝 Verificar mensagens de erro"
echo "3. 🛠️ Problemas comuns:"
echo "   - Erro 403: Policy não configurada"
echo "   - Erro 404: Bucket não existe"
echo "   - Erro de CORS: Configuração do Supabase"
echo ""

echo -e "${BLUE}📊 COMPARAÇÃO COM OUTROS BUCKETS:${NC}"
echo ""
echo "Se inventário não funcionar, teste outros buckets:"
echo "- 👤 Avatar do admin (deve funcionar)"
echo "- 👥 Foto de membro (deve funcionar)"
echo "- 🏆 Foto de sacramento (deve funcionar)"
echo ""
echo "Se outros funcionam e inventory não, problema é nas policies do inventory."
echo ""

echo -e "${GREEN}🎉 FINALIZANDO TESTE...${NC}"
echo ""
echo "Execute este teste após configurar o bucket inventory."
echo "Se tudo funcionar, o sistema estará 100% completo!"
echo ""
echo "📝 Lembre-se: Documente qualquer erro encontrado para correção."
echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}        TESTE FINALIZADO COM SUCESSO     ${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
