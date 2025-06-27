# 🚀 DEPLOY PARA SLEEPY-ALLEN.PLESK.PAGE

## 🎯 Configuração Específica para seu Domínio

### 📍 **Domínio de Destino:**

```
https://sleepy-allen.66-179-92-233.plesk.page
```

## ⚡ **DEPLOY IMEDIATO (3 Passos):**

### 1. 📁 Upload dos Arquivos

```bash
1. Use: cdm-admin-plesk-root.zip (atualizado)
2. Acesse Plesk File Manager
3. Vá para: httpdocs/ (diretório raiz)
4. Faça upload e extraia o ZIP
```

### 2. 🔧 Ativar HTTPS

```bash
# No painel Plesk:
1. Vá em "SSL/TLS Certificates"
2. Ative "Let's Encrypt"
3. Force redirecionamento HTTPS
```

### 3. 🌐 Teste Final

```bash
# URLs para testar:
1. Site: https://sleepy-allen.66-179-92-233.plesk.page/
2. JS:   https://sleepy-allen.66-179-92-233.plesk.page/assets/index-CZSgMWmE.js
3. CSS:  https://sleepy-allen.66-179-92-233.plesk.page/assets/index-CWfnR0Ha.css
```

## 🛠️ **Configurações Atualizadas:**

### A. Index.html

- ✅ CSP atualizado para seu domínio
- ✅ Caminhos para raiz (sem /cdm-admin)
- ✅ Scripts e CSS corretos

### B. .htaccess

- ✅ Tipos MIME específicos
- ✅ SPA routing simplificado
- ✅ Headers de conteúdo corretos

### C. .env.production.example

- ✅ URLs atualizadas para seu domínio
- ✅ Configuração de produção pronta

## 🧪 **Testes Específicos:**

### Teste 1: Carregar o site

```
URL: https://sleepy-allen.66-179-92-233.plesk.page/
Esperado: Aplicação CDM Admin carrega
```

### Teste 2: Verificar JavaScript

```
URL: https://sleepy-allen.66-179-92-233.plesk.page/assets/index-CZSgMWmE.js
Esperado: Código JavaScript (não HTML)
Content-Type: application/javascript
```

### Teste 3: Verificar CSS

```
URL: https://sleepy-allen.66-179-92-233.plesk.page/assets/index-CWfnR0Ha.css
Esperado: Código CSS (não HTML)
Content-Type: text/css
```

### Teste 4: Funcionalidade

```
1. Login no sistema
2. Acessar "Inventário do Daime"
3. Verificar dados do Supabase
4. Testar CRUD (criar/editar/excluir)
```

## 🔧 **Se der erro de MIME type:**

### Opção A: .htaccess mínimo

```apache
RewriteEngine On
AddType application/javascript .js
AddType text/css .css

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L]
```

### Opção B: Configuração Plesk

```bash
# Em Apache & nginx Settings:
<Directory "/var/www/vhosts/sleepy-allen.66-179-92-233.plesk.page/httpdocs">
    AddType application/javascript .js
    AddType text/css .css
</Directory>
```

## 🎯 **Próximos Passos (Opcional):**

### Para Backend MySQL (Futuro):

1. Configure Node.js no Plesk
2. Crie banco MySQL
3. Importe schema de: api/database/mysql_schema.sql
4. Configure variáveis de ambiente

### Para Domínio Próprio:

1. Aponte DNS para o Plesk
2. Configure SSL para domínio próprio
3. Atualize URLs nas configurações

## ✅ **Lista de Verificação:**

- [ ] Upload do cdm-admin-plesk-root.zip
- [ ] Extração na raiz (httpdocs/)
- [ ] HTTPS ativado
- [ ] Site carregando: https://sleepy-allen.66-179-92-233.plesk.page/
- [ ] JavaScript carregando sem erro MIME
- [ ] Login funcionando
- [ ] Inventário acessível

## 📞 **Suporte:**

Se algum passo falhar, verifique:

1. Console do navegador (F12)
2. Network tab para erros de MIME
3. .htaccess foi enviado corretamente
4. HTTPS está ativo

---

🚀 **Seu CDM Admin estará rodando em: https://sleepy-allen.66-179-92-233.plesk.page/**
