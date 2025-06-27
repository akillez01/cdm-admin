# 🔧 CORREÇÃO URGENTE - MIME TYPES

## 🚨 Problema Identificado:

Arquivos JS/CSS retornando `text/html` em vez dos tipos MIME corretos

## ⚡ SOLUÇÃO RÁPIDA:

### 1. Substitua o arquivo .htaccess

```bash
# No seu Plesk File Manager:
1. Navegue até: /httpdocs/cdm-admin/
2. Renomeie .htaccess para .htaccess-old
3. Crie novo .htaccess com este conteúdo:
```

```apache
# CDM Admin - Configuração Plesk Corrigida
RewriteEngine On

# Forçar tipos MIME corretos
AddType application/javascript .js
AddType text/css .css
AddType image/svg+xml .svg

# SPA Routing - sem conflitos
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^.*\.(js|css|png|jpg|jpeg|gif|svg|ico)$
RewriteRule ^(.*)$ index.html [L]
```

### 2. Ou use o ZIP corrigido

```bash
# Download e substitua por:
cdm-admin-plesk-fixed.zip
# Este já contém a correção
```

### 3. Teste alternativo (se ainda não funcionar)

```bash
# Mova todos os arquivos para a RAIZ:
# De: /httpdocs/cdm-admin/
# Para: /httpdocs/
# Acesse: https://seudominio.com/
```

## 🧪 Verificação:

Após aplicar a correção, teste:

- https://frosty-curie.66-179-92-233.plesk.page/cdm-admin/assets/index-CZSgMWmE.js
- Deve mostrar código JavaScript, não HTML

## 📞 Se não resolver:

1. Contate suporte Plesk
2. Peça para configurar tipos MIME para arquivos .js e .css
3. Ou configure nginx em vez de Apache

## 🎯 Arquivos atualizados:

- ✅ cdm-admin-plesk-fixed.zip
- ✅ .htaccess corrigido
- ✅ CSP mais flexível
- ✅ Guia de correção
