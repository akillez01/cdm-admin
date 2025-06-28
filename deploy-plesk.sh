#!/bin/bash

# ===========================================
# SCRIPT DE BUILD E DEPLOY PARA PLESK
# ===========================================

echo "🚀 Iniciando processo de build para Plesk..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Execute este script na raiz do projeto (onde está o package.json)"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale npm primeiro."
    exit 1
fi

# Limpar builds anteriores
echo "🧹 Limpando builds anteriores..."
rm -rf dist/
rm -rf build/
rm -rf deploy-plesk/
rm -f cdm-admin-plesk.zip

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

# Configurar para produção
echo "⚙️  Configurando para produção..."

# Backup do .env atual
if [ -f ".env" ]; then
    cp .env .env.development.backup
    echo "📋 Backup do .env atual criado: .env.development.backup"
fi

# Usar configuração de produção
if [ -f ".env.production.example" ]; then
    cp .env.production.example .env.production
    echo "📝 Arquivo .env.production criado"
    echo "⚠️  CONFIGURE suas variáveis de produção em .env.production"
    echo "   - Substitua 'seudominio.com' pelo seu domínio real"
    echo "   - Configure credenciais do banco MySQL"
    echo "   - Gere uma chave JWT segura"
else
    echo "⚠️  Arquivo .env.production.example não encontrado"
fi

# Fazer o build
echo "🔨 Executando build de produção..."
echo "   Isso pode levar alguns minutos..."

# Executar build
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro durante o build!"
    exit 1
fi

# Verificar se o build foi criado
if [ ! -d "dist" ]; then
    echo "❌ Pasta dist não foi criada!"
    exit 1
fi

echo "✅ Build criado com sucesso!"

# Criar estrutura para Plesk
echo "📁 Preparando estrutura para Plesk..."

# Criar pasta temporária para o deploy
mkdir -p deploy-plesk/

# Copiar arquivos do build
cp -r dist/* deploy-plesk/

# Garantir que as imagens estejam copiadas
echo "🖼️  Copiando imagens estaticas..."
mkdir -p deploy-plesk/images/
if [ -d "public/images" ]; then
    cp -r public/images/* deploy-plesk/images/
    echo "✅ Imagens copiadas de public/images/ para deploy-plesk/images/"
else
    echo "⚠️  Pasta public/images não encontrada"
fi

# Copiar favicon
if [ -f "public/vite.svg" ]; then
    cp public/vite.svg deploy-plesk/
    echo "✅ Favicon copiado"
fi

# Copiar arquivos de configuração
echo "📋 Copiando arquivos de configuração..."

# .htaccess para SPA routing
cat > deploy-plesk/.htaccess << 'EOF'
# CDM Admin - SPA Routing Configuration
RewriteEngine On

# Handle Angular and Vue.js Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security Headers
<IfModule mod_headers.c>
    Header always set X-Frame-Options DENY
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
</IfModule>

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
EOF

# Copiar backend se necessário
if [ -d "server" ]; then
    echo "🖥️  Copiando backend..."
    mkdir -p deploy-plesk/api/
    cp -r server/* deploy-plesk/api/
    
    # Remover node_modules do backend para economizar espaço
    rm -rf deploy-plesk/api/node_modules/
    
    echo "📋 Backend copiado para deploy-plesk/api/"
fi

# Criar arquivo de instruções detalhadas
cat > deploy-plesk/INSTRUCOES_DEPLOY.md << 'EOF'
# 🚀 INSTRUÇÕES DE DEPLOY - PLESK

## 📁 Arquivos nesta pasta:
- **Todos os arquivos**: Upload para o diretório público do domínio
- **.htaccess**: Configuração de SPA routing (já incluído)
- **api/**: Backend Node.js (se necessário)

## 🔧 Passos no Plesk:

### 1. Upload dos arquivos
```
- Acesse File Manager no Plesk
- Vá para httpdocs/ ou public_html/
- Faça upload de TODOS os arquivos desta pasta
```

### 2. Configurar domínio
```
- Se usar subpasta (/cdm-admin):
  - Crie uma pasta cdm-admin/
  - Faça upload dos arquivos lá
```

### 3. Ativar HTTPS
```
- Vá em SSL/TLS Certificates
- Ative Let's Encrypt ou importe seu certificado
- Force HTTPS redirect
```

### 4. Configurar Backend (se necessário)
```
- Vá em Node.js no Plesk
- Configure pasta: api/
- Instalar dependências: npm install
- Arquivo de inicialização: index.js
- Configurar variáveis de ambiente
```

### 5. Banco de Dados
```
- Crie banco MySQL no Plesk
- Importe: api/database/mysql_schema.sql
- Configure credenciais
```

## 🌐 Teste final:
- Acesse: https://seudominio.com/cdm-admin
- Teste login e funcionalidades
- Verifique console do navegador para erros

## 🆘 Problemas comuns:
- **404 nas rotas**: Verifique .htaccess
- **Erro de API**: Verifique backend e variáveis
- **Página branca**: Verifique console do navegador
EOF

# Criar arquivo de configuração para Plesk
cat > deploy-plesk/plesk-config.txt << 'EOF'
CONFIGURAÇÃO NECESSÁRIA NO PLESK:
=====================================

1. UPLOAD DOS ARQUIVOS:
   - Faça upload de todos os arquivos desta pasta para o diretório público do seu domínio
   - Geralmente: public_html/ ou httpdocs/

2. VARIÁVEIS DE AMBIENTE (Node.js):
   - Vá em "Node.js" no painel Plesk
   - Configure as variáveis de ambiente:

   FRONTEND (se usar subdomain):
   VITE_USE_SUPABASE=false
   VITE_API_URL=https://seudominio.com/api
   VITE_BASE_URL=/cdm-admin

   BACKEND (se hospedar o Node.js):
   NODE_ENV=production
   DB_HOST=localhost
   DB_USER=seu_usuario_mysql
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=cdm_admin
   JWT_SECRET=sua_chave_jwt_muito_segura
   PORT=3001

3. BANCO DE DADOS:
   - Crie um banco MySQL no Plesk
   - Importe o schema: server/database/mysql_schema.sql
   - Configure as credenciais nas variáveis de ambiente

4. SUBDOMÍNIO/PASTA (Opcional):
   - Se usar subpasta: /cdm-admin
   - Configure VITE_BASE_URL=/cdm-admin

5. HTTPS:
   - Ative certificado SSL no Plesk
   - Force redirecionamento HTTPS

6. BACKEND API (Opcional):
   - Se hospedar o backend Node.js no Plesk:
   - Faça upload da pasta server/
   - Configure como aplicação Node.js
   - Instale dependências: npm install
EOF

# Criar ZIP para upload
echo "📦 Criando arquivo ZIP para upload..."
cd deploy-plesk/
zip -r ../cdm-admin-plesk.zip . -q
cd ..

# Mostrar informações do build
echo ""
echo "🎉 BUILD COMPLETO!"
echo "📊 Informações do build:"
if [ -d "dist" ]; then
    echo "   Pasta dist/: $(du -sh dist/ | cut -f1)"
fi
if [ -d "deploy-plesk" ]; then
    echo "   Pasta deploy-plesk/: $(du -sh deploy-plesk/ | cut -f1)"
fi
if [ -f "cdm-admin-plesk.zip" ]; then
    echo "   Arquivo ZIP: $(du -sh cdm-admin-plesk.zip | cut -f1)"
fi

echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. 📁 Upload: Use o arquivo 'cdm-admin-plesk.zip'"
echo "2. 📖 Leia: deploy-plesk/INSTRUCOES_DEPLOY.md"
echo "3. ⚙️  Configure: Variáveis de ambiente no Plesk"
echo "4. 🌐 Teste: Acesse seu domínio"

echo ""
echo "📁 Arquivos criados:"
if [ -d "dist" ]; then
    echo "   ✅ dist/ - Build da aplicação"
fi
if [ -d "deploy-plesk" ]; then
    echo "   ✅ deploy-plesk/ - Pasta pronta para upload"
fi
if [ -f "cdm-admin-plesk.zip" ]; then
    echo "   ✅ cdm-admin-plesk.zip - Arquivo para upload"
fi
if [ -f ".env.production" ]; then
    echo "   ✅ .env.production - Configuração de produção"
fi

# Restaurar .env de desenvolvimento
if [ -f ".env.development.backup" ]; then
    cp .env.development.backup .env
    rm .env.development.backup
    echo "   ✅ .env de desenvolvimento restaurado"
fi

echo ""
echo "🚀 Pronto para deploy no Plesk!"
echo "📋 Lembre-se de configurar:"
echo "   - Substituir 'seudominio.com' pelo seu domínio real"
echo "   - Configurar credenciais do MySQL no Plesk"
echo "   - Gerar chave JWT segura"
echo "   - Testar a aplicação após o upload"
