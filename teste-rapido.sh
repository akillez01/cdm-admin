#!/bin/bash

# ==============================================================================
# SCRIPT DE TESTE RÁPIDO - CDM Admin Deploy
# ==============================================================================

echo "🔍 TESTE RÁPIDO CDM Admin Deploy"
echo "=================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretórios
DEPLOY_DIR="/home/achilles/Documentos/novos pro cdm/cdm-admin/deploy-plesk"

echo -e "${BLUE}📁 Verificando estrutura de arquivos...${NC}"

# 1. Verificar se arquivos essenciais existem
files_to_check=(
    "$DEPLOY_DIR/index.html"
    "$DEPLOY_DIR/images/cdmlogo.png"
    "$DEPLOY_DIR/.htaccess"
    "$DEPLOY_DIR/assets"
)

for file in "${files_to_check[@]}"; do
    if [ -e "$file" ]; then
        echo -e "  ${GREEN}✅ $file${NC}"
    else
        echo -e "  ${RED}❌ $file AUSENTE${NC}"
    fi
done

echo
echo -e "${BLUE}🖼️ Verificando logo...${NC}"

# 2. Verificar logo especificamente
LOGO_FILE="$DEPLOY_DIR/images/cdmlogo.png"
if [ -f "$LOGO_FILE" ]; then
    # Verificar tamanho do arquivo
    size=$(stat -c%s "$LOGO_FILE" 2>/dev/null || echo "0")
    if [ "$size" -gt 1000 ]; then
        echo -e "  ${GREEN}✅ Logo existe e tem tamanho válido ($size bytes)${NC}"
        
        # Verificar permissões
        perms=$(stat -c "%a" "$LOGO_FILE" 2>/dev/null || echo "000")
        if [ "$perms" = "644" ] || [ "$perms" = "755" ]; then
            echo -e "  ${GREEN}✅ Permissões da logo OK ($perms)${NC}"
        else
            echo -e "  ${YELLOW}⚠️ Permissões da logo podem estar incorretas ($perms)${NC}"
            echo -e "  ${BLUE}💡 Execute: chmod 644 $LOGO_FILE${NC}"
        fi
    else
        echo -e "  ${RED}❌ Logo existe mas está corrompida ou vazia ($size bytes)${NC}"
    fi
else
    echo -e "  ${RED}❌ Logo não encontrada${NC}"
fi

echo
echo -e "${BLUE}🌐 Verificando configuração HTML...${NC}"

# 3. Verificar index.html
INDEX_FILE="$DEPLOY_DIR/index.html"
if [ -f "$INDEX_FILE" ]; then
    # Verificar se CSP inclui Supabase
    if grep -q "supabase.co" "$INDEX_FILE"; then
        echo -e "  ${GREEN}✅ CSP inclui Supabase${NC}"
    else
        echo -e "  ${RED}❌ CSP não inclui Supabase${NC}"
    fi
    
    # Verificar se favicon aponta para logo
    if grep -q "cdmlogo.png" "$INDEX_FILE"; then
        echo -e "  ${GREEN}✅ Favicon configurado para logo${NC}"
    else
        echo -e "  ${YELLOW}⚠️ Favicon pode não estar configurado${NC}"
    fi
    
    # Verificar se há referências a vite.svg (problema comum)
    if grep -q "vite.svg" "$INDEX_FILE"; then
        echo -e "  ${RED}❌ Ainda há referências ao vite.svg${NC}"
        echo -e "  ${BLUE}💡 Substitua vite.svg por cdmlogo.png${NC}"
    else
        echo -e "  ${GREEN}✅ Sem referências ao vite.svg${NC}"
    fi
else
    echo -e "  ${RED}❌ index.html não encontrado${NC}"
fi

echo
echo -e "${BLUE}⚙️ Verificando .htaccess...${NC}"

# 4. Verificar .htaccess
HTACCESS_FILE="$DEPLOY_DIR/.htaccess"
if [ -f "$HTACCESS_FILE" ]; then
    # Verificar regras essenciais
    if grep -q "RewriteEngine On" "$HTACCESS_FILE"; then
        echo -e "  ${GREEN}✅ RewriteEngine ativado${NC}"
    else
        echo -e "  ${RED}❌ RewriteEngine não ativado${NC}"
    fi
    
    if grep -q "FallbackResource" "$HTACCESS_FILE" || grep -q "RewriteRule.*index.html" "$HTACCESS_FILE"; then
        echo -e "  ${GREEN}✅ SPA routing configurado${NC}"
    else
        echo -e "  ${RED}❌ SPA routing não configurado${NC}"
    fi
    
    if grep -q "AddType.*png" "$HTACCESS_FILE" || grep -q "image/png" "$HTACCESS_FILE"; then
        echo -e "  ${GREEN}✅ Tipo MIME para PNG configurado${NC}"
    else
        echo -e "  ${YELLOW}⚠️ Tipo MIME para PNG pode não estar configurado${NC}"
    fi
else
    echo -e "  ${RED}❌ .htaccess não encontrado${NC}"
fi

echo
echo -e "${BLUE}🔧 Gerando ZIP de deploy...${NC}"

# 5. Criar ZIP atualizado
cd "$DEPLOY_DIR" || exit 1
ZIP_NAME="cdm-admin-deploy-$(date +%Y%m%d-%H%M).zip"
zip -r "../$ZIP_NAME" . -x "*.md" "plesk-config.txt" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "  ${GREEN}✅ ZIP criado: $ZIP_NAME${NC}"
    
    # Mostrar tamanho do ZIP
    zip_size=$(stat -c%s "/home/achilles/Documentos/novos pro cdm/cdm-admin/$ZIP_NAME" 2>/dev/null || echo "0")
    echo -e "  ${BLUE}📦 Tamanho: $(echo "scale=2; $zip_size/1024/1024" | bc 2>/dev/null || echo "??") MB${NC}"
else
    echo -e "  ${RED}❌ Erro ao criar ZIP${NC}"
fi

echo
echo -e "${BLUE}🚀 PRÓXIMOS PASSOS:${NC}"
echo "=================================="
echo -e "${YELLOW}1.${NC} Faça upload do ZIP para o Plesk"
echo -e "${YELLOW}2.${NC} Acesse: ${BLUE}https://seu-dominio.plesk.page/cdm-admin/diagnostico-especifico.html${NC}"
echo -e "${YELLOW}3.${NC} Execute o diagnóstico completo"
echo -e "${YELLOW}4.${NC} Se a logo não aparecer, verifique:"
echo "   - Permissões do diretório images/ (chmod 755)"
echo "   - Permissões do arquivo cdmlogo.png (chmod 644)"
echo "   - Se o caminho está correto no navegador"

echo
echo -e "${GREEN}✅ Teste rápido concluído!${NC}"

# Mostrar URLs úteis
echo
echo -e "${BLUE}🔗 URLs para testar após deploy:${NC}"
echo "   • Diagnóstico: /cdm-admin/diagnostico-especifico.html"
echo "   • Logo direta: /cdm-admin/images/cdmlogo.png"
echo "   • App principal: /cdm-admin/"
