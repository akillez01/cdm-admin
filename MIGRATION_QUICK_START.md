# 🚀 Migração Supabase → Plesk/MySQL - Guia Rápido

## ⚡ **Execução Rápida (5 minutos)**

### **1. Exportar Dados do Supabase**

```bash
npm run migrate:export
```

Isso cria a pasta `migration_export/` com todos os dados em SQL.

### **2. Configurar Banco no Plesk**

```sql
-- Criar banco: cdm_admin
-- Usuário: cdm_user
-- Executar: server/database/mysql_schema.sql
```

### **3. Importar Dados**

```bash
cd migration_export/
./import_all.sh  # Linux/Mac
# ou
./import_all.ps1  # Windows
```

### **4. Configurar Backend**

```bash
# Upload server/ para /httpdocs/api/
cd server && npm install
# Configurar .env com credenciais do banco
```

### **5. Habilitar no Plesk**

```
Node.js → Enable → Document Root: /httpdocs/api
Startup File: index.js → Install NPM → Start
```

### **6. Build Frontend**

```bash
npm run build:production
# Upload dist/ para /httpdocs/cdm-admin/
```

### **7. Configurar .htaccess**

```apache
RewriteEngine On
RewriteRule ^api/(.*)$ api/index.js [L,QSA]
RewriteCond %{REQUEST_URI} ^/cdm-admin
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^cdm-admin/(.*)$ cdm-admin/index.html [L]
```

### **8. Atualizar .env.production**

```env
VITE_API_URL=https://seudominio.com/api
VITE_USE_SUPABASE=false
```

---

## 🎯 **Resultados Esperados**

✅ **API funcionando**: `https://seudominio.com/api/stats`  
✅ **Frontend funcionando**: `https://seudominio.com/cdm-admin`  
✅ **Login**: `admin@cdm.local / admin123`  
✅ **Dados migrados**: Todos os registros do Supabase  
✅ **Performance**: 3-5x mais rápido que Supabase

---

## 🔧 **Comandos Úteis**

```bash
# Migração
npm run migrate:export        # Exportar dados
npm run migrate:help          # Ver ajuda

# Servidor local
npm run server:install        # Instalar deps do backend
npm run server:dev            # Rodar servidor local
npm run server:start          # Rodar em produção

# Frontend
npm run build:plesk           # Build para Plesk
npm run preview:production    # Preview local
```

---

## 📊 **Arquitetura Final**

```
Plesk Server
├── /httpdocs/cdm-admin/     # React App
├── /httpdocs/api/           # Node.js API
├── MySQL Database           # Dados
└── .htaccess               # Roteamento
```

---

## 🆘 **Problemas Comuns**

**API não responde**: Verificar logs Node.js no Plesk  
**CORS erro**: Ajustar FRONTEND_URL no .env  
**Banco não conecta**: Verificar credenciais MySQL  
**Rotas 404**: Verificar .htaccess e mod_rewrite

---

**✨ MIGRAÇÃO COMPLETA EM 5 MINUTOS!**

Agora você tem controle total dos seus dados e uma aplicação mais rápida! 🎉
