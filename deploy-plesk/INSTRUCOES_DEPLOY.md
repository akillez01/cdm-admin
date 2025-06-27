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
