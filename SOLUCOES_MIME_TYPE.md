# 🚨 SOLUÇÕES MÚLTIPLAS PARA MIME TYPE

## ❌ Problema persistente:

O servidor ainda está retornando `text/html` para arquivos JS/CSS

## 🎯 SOLUÇÕES EM ORDEM DE PRIORIDADE:

### SOLUÇÃO 1: Deploy na RAIZ (Mais Provável de Funcionar)

```bash
1. Use: cdm-admin-plesk-root.zip
2. Extraia diretamente em: /httpdocs/ (não em subpasta)
3. Acesse: https://frosty-curie.66-179-92-233.plesk.page/
4. Teste: https://frosty-curie.66-179-92-233.plesk.page/assets/index-CZSgMWmE.js
```

### SOLUÇÃO 2: .htaccess Mínimo

```apache
# Cole isso no .htaccess:
RewriteEngine On
AddType application/javascript .js
AddType text/css .css

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

### SOLUÇÃO 3: Configuração no Plesk

```bash
# No painel Plesk > Apache & nginx Settings:
# Adicione na seção "Additional directives for HTTP":

<Directory "/var/www/vhosts/frosty-curie.66-179-92-233.plesk.page/httpdocs">
    AddType application/javascript .js
    AddType text/css .css
</Directory>
```

### SOLUÇÃO 4: Teste sem .htaccess

```bash
1. Renomeie .htaccess para .htaccess-disabled
2. Acesse diretamente:
   https://frosty-curie.66-179-92-233.plesk.page/assets/index-CZSgMWmE.js
3. Se funcionar, o problema é o .htaccess
```

### SOLUÇÃO 5: HTML sem CSP

```bash
# Substitua index.html por index-no-csp.html
# Remove Content Security Policy que pode estar causando problemas
```

### SOLUÇÃO 6: Configuração NGINX (se disponível)

```nginx
# Se usar nginx no Plesk:
location ~* \.(js|css)$ {
    add_header Content-Type application/javascript;
    add_header Content-Type text/css;
}
```

## 🧪 TESTES RÁPIDOS:

### Teste A: Arquivo JS direto

```
URL: https://frosty-curie.66-179-92-233.plesk.page/cdm-admin/assets/index-CZSgMWmE.js
Esperado: Código JavaScript
Atual: HTML (problema confirmado)
```

### Teste B: Mesmo arquivo na raiz

```
URL: https://frosty-curie.66-179-92-233.plesk.page/assets/index-CZSgMWmE.js
Se mostrar JS: Problema é a subpasta /cdm-admin
```

## 📦 ARQUIVOS DISPONÍVEIS:

1. **cdm-admin-plesk-root.zip** - Deploy na raiz (SEM /cdm-admin)
2. **cdm-admin-plesk-fixed.zip** - Deploy com /cdm-admin corrigido
3. **.htaccess-v2** - Configuração alternativa
4. **index-no-csp.html** - HTML sem Content Security Policy

## 🎯 RECOMENDAÇÃO URGENTE:

**Use cdm-admin-plesk-root.zip e faça deploy na RAIZ do domínio**

Isso elimina problemas de subpasta e tem maior chance de sucesso.

## 📞 Se nada funcionar:

1. Contate suporte Plesk
2. Peça configuração de tipos MIME para .js e .css
3. Ou mude para hospedagem que suporte SPAs adequadamente
