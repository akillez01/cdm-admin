# 🚨 Resolução de Problemas - Migração CDM Admin

## ❌ **Erro: Ainda tentando acessar Supabase**

### 🔍 **Sintomas:**

```
XHRPOST https://xkkbeilbthmezeqizcch.supabase.co/rest/v1/daime_inventory
[HTTP/3 404  232ms]
```

### ✅ **Soluções:**

#### **1. Configurar Variável de Ambiente**

```bash
# Criar arquivo .env na raiz do projeto:
echo "VITE_USE_SUPABASE=false" > .env
echo "VITE_API_URL=http://localhost:3001/api" >> .env
```

#### **2. Copiar Configuração Local**

```bash
cp .env.local .env
```

#### **3. Limpar Cache do Vite**

```bash
# Parar o servidor (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

#### **4. Verificar Configuração no Navegador**

```javascript
// No console do navegador (F12):
console.log("USE_SUPABASE:", import.meta.env.VITE_USE_SUPABASE);
console.log("API_URL:", import.meta.env.VITE_API_URL);
```

---

## ❌ **Erro: API não responde (localhost:3001)**

### 🔍 **Sintomas:**

```
NetworkError when attempting to fetch resource
URL: http://localhost:3001/api/...
```

### ✅ **Soluções:**

#### **1. Iniciar Servidor Backend**

```bash
# Usar script automático:
./start-dev-server.sh

# OU manual:
cd server
npm install
npm run dev
```

#### **2. Verificar se Servidor Está Rodando**

```bash
# Testar endpoint:
curl http://localhost:3001/api/stats

# Verificar porta:
netstat -tlnp | grep 3001
```

#### **3. Configurar Banco de Dados**

```bash
# 1. Instalar MySQL (se não tiver)
sudo apt install mysql-server

# 2. Criar banco:
mysql -u root -p
CREATE DATABASE cdm_admin;
CREATE USER 'cdm_user'@'localhost' IDENTIFIED BY 'sua_senha';
GRANT ALL PRIVILEGES ON cdm_admin.* TO 'cdm_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# 3. Importar schema:
mysql -u cdm_user -p cdm_admin < server/database/mysql_schema.sql
```

---

## ❌ **Erro: Conexão com Banco Falha**

### 🔍 **Sintomas:**

```
Error: ER_ACCESS_DENIED_ERROR
Error: ECONNREFUSED
```

### ✅ **Soluções:**

#### **1. Verificar Credenciais**

```bash
# Editar server/.env:
DB_HOST=localhost
DB_USER=cdm_user
DB_PASSWORD=sua_senha_correta
DB_NAME=cdm_admin
```

#### **2. Testar Conexão Manual**

```bash
mysql -h localhost -u cdm_user -p cdm_admin -e "SELECT 1;"
```

#### **3. Verificar se MySQL Está Rodando**

```bash
sudo systemctl status mysql
sudo systemctl start mysql
```

---

## ❌ **Erro: CORS (Cross-Origin)**

### 🔍 **Sintomas:**

```
Access to fetch at 'http://localhost:3001/api' from origin 'http://localhost:5173' has been blocked by CORS policy
```

### ✅ **Soluções:**

#### **1. Verificar FRONTEND_URL no .env**

```bash
# server/.env
FRONTEND_URL=http://localhost:5173
```

#### **2. Verificar Configuração CORS no Backend**

```javascript
// server/index.js deve ter:
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

---

## 🚀 **Guia de Inicialização Rápida**

### **1. Clone/Baixe o Projeto**

```bash
cd /path/to/cdm-admin
```

### **2. Configure Ambiente**

```bash
# Frontend
cp .env.local .env

# Backend
cd server
cp .env.development .env
```

### **3. Instale Dependências**

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### **4. Configure Banco de Dados**

```sql
-- MySQL
CREATE DATABASE cdm_admin;
CREATE USER 'cdm_user'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL ON cdm_admin.* TO 'cdm_user'@'localhost';
```

### **5. Importe Schema**

```bash
mysql -u cdm_user -p cdm_admin < server/database/mysql_schema.sql
```

### **6. Inicie Serviços**

```bash
# Terminal 1 - Backend
./start-dev-server.sh

# Terminal 2 - Frontend
npm run dev
```

### **7. Teste**

- Frontend: http://localhost:5173/cdm-admin
- API: http://localhost:3001/api/stats
- Login: admin@cdm.local / admin123

---

## 🔧 **Comandos Úteis**

```bash
# Limpar cache
rm -rf node_modules/.vite
rm -rf server/node_modules

# Reinstalar dependências
npm install
cd server && npm install

# Ver logs em tempo real
cd server && npm run dev

# Testar API
curl http://localhost:3001/api/stats
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cdm.local","password":"admin123"}'

# Verificar banco
mysql -u cdm_user -p cdm_admin -e "SHOW TABLES;"
mysql -u cdm_user -p cdm_admin -e "SELECT COUNT(*) FROM daime_inventory;"
```

---

## 📞 **Ainda com Problemas?**

1. **Verifique os logs do terminal**
2. **Abra o console do navegador (F12)**
3. **Teste cada componente individualmente**
4. **Confirme que todas as portas estão disponíveis**

### **Status dos Serviços:**

- ✅ MySQL rodando na porta 3306
- ✅ Backend API rodando na porta 3001
- ✅ Frontend rodando na porta 5173
- ✅ Variáveis de ambiente configuradas

**💡 Dica:** Use o script `./start-dev-server.sh` para inicialização automática!
