#!/bin/bash

# Script de verificação pós-deploy para sleepy-allen.plesk.page

echo "🔍 Verificando deploy em sleepy-allen.66-179-92-233.plesk.page..."

DOMAIN="https://sleepy-allen.66-179-92-233.plesk.page"

echo ""
echo "🌐 Testando URLs principais:"

# Teste 1: Site principal
echo -n "1. Site principal: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/")
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ OK ($HTTP_CODE)"
else
    echo "❌ ERRO ($HTTP_CODE)"
fi

# Teste 2: JavaScript
echo -n "2. JavaScript: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/assets/index-CZSgMWmE.js")
CONTENT_TYPE=$(curl -s -I "$DOMAIN/assets/index-CZSgMWmE.js" | grep -i content-type | cut -d: -f2 | tr -d ' \r\n')
if [ "$HTTP_CODE" = "200" ] && [[ "$CONTENT_TYPE" == *"javascript"* ]]; then
    echo "✅ OK ($HTTP_CODE, $CONTENT_TYPE)"
else
    echo "❌ ERRO ($HTTP_CODE, $CONTENT_TYPE)"
fi

# Teste 3: CSS
echo -n "3. CSS: "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DOMAIN/assets/index-CWfnR0Ha.css")
CONTENT_TYPE=$(curl -s -I "$DOMAIN/assets/index-CWfnR0Ha.css" | grep -i content-type | cut -d: -f2 | tr -d ' \r\n')
if [ "$HTTP_CODE" = "200" ] && [[ "$CONTENT_TYPE" == *"css"* ]]; then
    echo "✅ OK ($HTTP_CODE, $CONTENT_TYPE)"
else
    echo "❌ ERRO ($HTTP_CODE, $CONTENT_TYPE)"
fi

# Teste 4: HTTPS
echo -n "4. HTTPS: "
if curl -s "$DOMAIN/" | grep -q "CDM Admin\|Ceu das Matas"; then
    echo "✅ OK (conteúdo correto)"
else
    echo "❌ ERRO (conteúdo não encontrado)"
fi

echo ""
echo "📋 URLs para teste manual:"
echo "   Site: $DOMAIN/"
echo "   JS:   $DOMAIN/assets/index-CZSgMWmE.js"
echo "   CSS:  $DOMAIN/assets/index-CWfnR0Ha.css"

echo ""
echo "🎯 Se todos os testes passaram: ✅ Deploy bem-sucedido!"
echo "🚨 Se algum falhou: Verifique .htaccess e configurações MIME"
