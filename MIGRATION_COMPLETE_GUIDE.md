# 🔄 Guia Completo de Migração: Supabase → Plesk/MySQL

## 📋 **Visão Geral da Migração**

Este guia fornece um processo **passo a passo** para migrar completamente do Supabase para um banco MySQL no Plesk, incluindo:

- ✅ **Backend Node.js/Express** completo
- ✅ **Schema MySQL** otimizado
- ✅ **Scripts de migração de dados**
- ✅ **Frontend atualizado** para usar nova API
- ✅ **Configuração de produção** no Plesk

---

## 🎯 **Vantagens da Migração**

### **Antes (Supabase):**

- 🔒 Dependência de serviço externo
- 💰 Custos mensais crescentes
- ⚡ Limitações de customização
- 🌐 Latência internacional

### **Depois (Plesk/MySQL):**

- 🏠 **Controle Total**: Seus dados no seu servidor
- 💰 **Economia**: Custo fixo mensal
- 🔧 **Flexibilidade**: Backend 100% customizável
- ⚡ **Performance**: Servidor local, latência baixa
- 🔒 **Segurança**: Controle total sobre dados

---

## 📦 **O Que Foi Criado**

### **1. Backend Node.js/Express Completo**

```
server/
├── index.js              # API principal
├── package.json           # Dependências
├── .env.example          # Configurações
└── database/
    └── mysql_schema.sql  # Schema completo
```

### **2. Scripts de Migração**

```
scripts/
└── migrateToMySQL.mjs    # Script automático de migração
```

### **3. Frontend Atualizado**

```
src/hooks/
├── useApi.ts             # Nova API (substitui useSupabase)
└── useSupabase.ts        # Legado (manter durante transição)
```

---

## 🚀 **Passo a Passo da Migração**

### **ETAPA 1: Preparar Ambiente Plesk**

#### **1.1 Criar Banco MySQL**

1. **Acesse Plesk Panel**
2. **Databases** → **Add Database**
3. **Configure:**
   ```
   Database Name: cdm_admin
   Username: cdm_user
   Password: [senha_muito_segura]
   ```

#### **1.2 Habilitar Node.js (se necessário)**

1. **Extensions** → **Node.js**
2. **Enable for your domain**

### **ETAPA 2: Instalar Backend**

#### **2.1 Upload do Backend**

```bash
# No servidor Plesk, navegue até:
cd /httpdocs/

# Crie diretório da API
mkdir api
cd api

# Upload dos arquivos:
# - server/index.js
# - server/package.json
# - .env (configurado)
```

#### **2.2 Instalar Dependências**

```bash
cd /httpdocs/api
npm install
```

#### **2.3 Configurar .env**

```env
# /httpdocs/api/.env
DB_HOST=localhost
DB_USER=cdm_user
DB_PASSWORD=sua_senha_segura
DB_NAME=cdm_admin
DB_PORT=3306

JWT_SECRET=sua_chave_jwt_muito_segura_32_caracteres_minimo

PORT=3001
NODE_ENV=production
FRONTEND_URL=https://seudominio.com
```

### **ETAPA 3: Criar Schema do Banco**

#### **3.1 Executar Schema SQL**

```bash
# Via phpMyAdmin ou linha de comando:
mysql -u cdm_user -p cdm_admin < server/database/mysql_schema.sql
```

#### **3.2 Verificar Criação**

```sql
-- No phpMyAdmin ou MySQL CLI:
SHOW TABLES;
SELECT COUNT(*) FROM daime_inventory;
```

### **ETAPA 4: Migrar Dados do Supabase**

#### **4.1 Executar Script de Migração**

```bash
# No seu ambiente local:
cd /path/to/cdm-admin
node scripts/migrateToMySQL.mjs
```

#### **4.2 Upload dos Dados**

```bash
# Será criada pasta: migration_export/
# Conteúdo:
# - members.sql
# - transactions.sql
# - inventory_items.sql
# - daime_inventory.sql
# - events.sql
# - import_all.sh

# Upload para servidor e execute:
./import_all.sh
```

### **ETAPA 5: Configurar Node.js no Plesk**

#### **5.1 Configuração Node.js**

1. **Plesk** → **Node.js**
2. **Settings:**
   ```
   Node.js version: 18.x ou superior
   Document root: /httpdocs/api
   Application startup file: index.js
   Application mode: production
   ```

#### **5.2 Configurar Variáveis de Ambiente**

```
DB_HOST=localhost
DB_USER=cdm_user
DB_PASSWORD=sua_senha
DB_NAME=cdm_admin
JWT_SECRET=sua_chave_jwt
PORT=3001
NODE_ENV=production
```

#### **5.3 Instalar e Iniciar**

```bash
# No painel Plesk Node.js:
1. Click "NPM Install"
2. Click "Enable Node.js"
3. Click "Restart App"
```

### **ETAPA 6: Atualizar Frontend**

#### **6.1 Atualizar .env.production**

```env
# CDM-Admin/.env.production
VITE_API_URL=https://seudominio.com/api
VITE_USE_SUPABASE=false

# Manter Supabase durante transição
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=sua_key

VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin
VITE_APP_VERSION=1.0.0
```

#### **6.2 Atualizar Código**

O arquivo `src/pages/Inventory.tsx` já foi atualizado para usar `useApi()` em vez de `useSupabase()`.

Outros arquivos que precisam ser atualizados:

- `src/pages/Members.tsx`
- `src/pages/Finance.tsx`
- `src/pages/Events.tsx`
- `src/pages/Dashboard.tsx`

### **ETAPA 7: Build e Deploy Frontend**

#### **7.1 Build de Produção**

```bash
npm run build:production
```

#### **7.2 Upload para Plesk**

```bash
# Upload da pasta dist/ para:
/httpdocs/cdm-admin/

# Estrutura final:
/httpdocs/
├── cdm-admin/          # Frontend React
│   ├── index.html
│   └── assets/
├── api/               # Backend Node.js
│   ├── index.js
│   └── node_modules/
└── .htaccess         # Configuração Apache
```

### **ETAPA 8: Configurar Apache (.htaccess)**

#### **8.1 Arquivo .htaccess na Raiz**

```apache
# /httpdocs/.htaccess
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ api/index.js [L,QSA]

# CDM Admin frontend
RewriteCond %{REQUEST_URI} ^/cdm-admin
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^cdm-admin/(.*)$ cdm-admin/index.html [L]

# Root redirect
RewriteRule ^$ cdm-admin/ [R=301,L]
```

### **ETAPA 9: Testar Migração**

#### **9.1 Testar API**

```bash
# Teste básico da API:
curl https://seudominio.com/api/stats

# Teste de login:
curl -X POST https://seudominio.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cdm.local","password":"admin123"}'
```

#### **9.2 Testar Frontend**

1. Acesse: `https://seudominio.com/cdm-admin`
2. Faça login com: `admin@cdm.local / admin123`
3. Teste todas as funcionalidades:
   - ✅ Dashboard com estatísticas
   - ✅ Inventário do Daime (CRUD)
   - ✅ Membros
   - ✅ Transações
   - ✅ Eventos

---

## 🔧 **Troubleshooting Comum**

### **Problema: API não responde**

```bash
# Verificar logs Node.js no Plesk
# Verificar se porta 3001 está liberada
# Verificar .env com credenciais corretas
```

### **Problema: Erro de CORS**

```javascript
// No server/index.js, verificar:
app.use(
  cors({
    origin: "https://seudominio.com",
    credentials: true,
  })
);
```

### **Problema: Banco não conecta**

```bash
# Verificar credenciais no .env
# Testar conexão manual:
mysql -h localhost -u cdm_user -p cdm_admin -e "SELECT 1;"
```

### **Problema: Rotas não funcionam**

```apache
# Verificar .htaccess está correto
# Verificar mod_rewrite habilitado no Apache
```

---

## 📊 **Comparativo de Performance**

| Aspecto            | Supabase   | Plesk/MySQL |
| ------------------ | ---------- | ----------- |
| **Latência**       | 150-300ms  | 20-50ms     |
| **Custo Mensal**   | $25-50     | $10-20      |
| **Controle**       | Limitado   | Total       |
| **Backup**         | Automático | Manual      |
| **Escalabilidade** | Automática | Manual      |
| **Customização**   | Limitada   | Ilimitada   |

---

## ✅ **Checklist Final**

### **Backend**

- [ ] MySQL criado e configurado
- [ ] Schema importado com sucesso
- [ ] Dados migrados do Supabase
- [ ] Node.js configurado no Plesk
- [ ] API respondendo corretamente
- [ ] Autenticação funcionando

### **Frontend**

- [ ] Build de produção gerado
- [ ] Upload para Plesk concluído
- [ ] .htaccess configurado
- [ ] Variáveis de ambiente atualizadas
- [ ] Rotas funcionando
- [ ] Interface carregando dados da nova API

### **Testes**

- [ ] Login/logout funcionando
- [ ] Dashboard com estatísticas corretas
- [ ] CRUD do inventário do Daime
- [ ] Listagem de membros
- [ ] Transações financeiras
- [ ] Eventos funcionando

---

## 🎯 **Próximos Passos (Opcional)**

### **1. Monitoramento**

- Configurar logs de erro
- Implementar alertas de sistema
- Monitorar performance

### **2. Backup Automático**

- Script de backup MySQL
- Backup automático via cron
- Backup dos uploads

### **3. Melhorias**

- Cache Redis (se disponível)
- CDN para assets estáticos
- Compressão gzip

### **4. Segurança**

- SSL/TLS forçado
- Rate limiting mais rigoroso
- Audit logs detalhados

---

**🎉 MIGRAÇÃO CONCLUÍDA!**

Agora você tem um sistema totalmente independente, rodando no seu próprio servidor Plesk, com controle total sobre dados e funcionalidades!

---

**📞 Suporte**
Se encontrar problemas durante a migração, verifique:

1. Logs do Node.js no Plesk
2. Logs do Apache/Nginx
3. Console do navegador (F12)
4. Teste cada etapa individualmente
