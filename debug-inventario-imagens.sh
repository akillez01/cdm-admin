#!/bin/bash

# ====================================
# DEBUG INVENTÁRIO - VERIFICAR IMAGENS
# ====================================

echo "🔍 DEBUGANDO PROBLEMA DAS IMAGENS NO INVENTÁRIO..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 ANÁLISE DOS LOGS:${NC}"
echo ""

echo "✅ Upload funcionou:"
echo "   URL: https://xkkbeilbthmezeqizcch.supabase.co/storage/v1/object/public/inventory/itens/itens_1751504203827.png"
echo ""

echo "✅ Policies criadas:"
echo "   - SELECT ✅"
echo "   - INSERT ✅" 
echo "   - UPDATE ✅"
echo "   - DELETE ✅"
echo ""

echo "✅ Inventário recarregou:"
echo "   - 8 itens carregados"
echo ""

echo -e "${YELLOW}🔍 POSSÍVEIS PROBLEMAS:${NC}"
echo ""

echo "1. 🗄️ BANCO DE DADOS:"
echo "   - Campo 'photo' pode não estar sendo salvo"
echo "   - Verificar se a coluna existe na tabela"
echo ""

echo "2. 🖼️ EXIBIÇÃO:"
echo "   - ImageThumbnail pode não estar recebendo o campo 'photo'"
echo "   - URL da imagem pode estar incorreta"
echo ""

echo "3. 🔄 MAPEAMENTO:"
echo "   - Campo 'photo' pode não estar sendo mapeado corretamente"
echo ""

echo -e "${BLUE}🧪 TESTES PARA FAZER:${NC}"
echo ""

echo "1. 📊 VERIFICAR DADOS NO SUPABASE:"
echo "   - Acesse Table Editor → inventory_items"
echo "   - Veja se o último item tem o campo 'photo' preenchido"
echo "   - URL esperada: https://xkkbeilbthmezeqizcch.supabase.co/storage/v1/object/public/inventory/itens/itens_1751504203827.png"
echo ""

echo "2. 🔍 VERIFICAR NO CONSOLE DO BROWSER:"
echo "   - F12 → Console"
echo "   - Procure por erros de carregamento de imagem"
echo "   - Verifique se a URL está correta"
echo ""

echo "3. 📷 TESTAR ACESSO DIRETO À IMAGEM:"
echo "   - Abra a URL diretamente no browser:"
echo "   - https://xkkbeilbthmezeqizcch.supabase.co/storage/v1/object/public/inventory/itens/itens_1751504203827.png"
echo "   - Deve mostrar a imagem"
echo ""

echo -e "${GREEN}🎯 PRÓXIMOS PASSOS:${NC}"
echo ""

echo "1. ✅ Verificar se campo 'photo' existe na tabela inventory_items"
echo "2. ✅ Verificar se o último item salvo tem URL da imagem"
echo "3. ✅ Testar acesso direto à URL da imagem"
echo "4. ✅ Verificar mapeamento no código React"
echo ""

echo -e "${YELLOW}💡 DICAS:${NC}"
echo ""

echo "- Se a URL funciona diretamente, problema é no frontend"
echo "- Se não há campo 'photo' no banco, problema é no backend"
echo "- Se campo existe mas está vazio, problema é no salvamento"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}        EXECUTE OS TESTES ACIMA          ${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

echo "📱 Me informe:"
echo "1. Se a URL da imagem abre diretamente no browser"
echo "2. Se o campo 'photo' aparece na tabela do Supabase"
echo "3. Se há erros no console do browser"
