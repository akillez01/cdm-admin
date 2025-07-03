# 🚨 SOLUÇÃO RÁPIDA - Problema de Login

## ❌ **Problema Identificado**

- Content Security Policy bloqueando localhost:3001 ✅ **CORRIGIDO**
- Servidor API não está rodando ⚠️ **PRECISA INICIAR**

## 🔧 **Solução em 3 Passos**

### 1️⃣ **Configurar Banco (Se Necessário)**

```bash
# Se MySQL não estiver configurado:
mysql -u root -p
CREATE DATABASE cdm_admin;
EXIT;

# Importar schema:
mysql -u root -p cdm_admin < server/database/mysql_schema.sql
```

### 2️⃣ **Criar Usuários Administradores**

```bash
# Execute na raiz do projeto:
node scripts/create-admin-users.js
```

### 3️⃣ **Iniciar Sistema Completo**

```bash
# Opção A: Script automático (RECOMENDADO)
./start-system.sh

# Opção B: Manual (2 terminais)
# Terminal 1:
cd server && npm start

# Terminal 2:
npm run dev
```

## 🎯 **Credenciais para Teste**

- **Yan:** `yan@cdm.local` / `yan123cdm`
- **Michel:** `michel@cdm.local` / `michel123cdm`
- **Admin:** `admin@cdm.local` / `admin123`

## 🌐 **URLs**

- **Frontend:** http://localhost:5173
- **API:** http://localhost:3001/api

## 🧪 **Teste Rápido da API**

```bash
# Testar se API está respondendo:
curl http://localhost:3001/api

# Testar login:
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"yan@cdm.local","password":"yan123cdm"}'
```

## ⚡ **Resolução Mais Provável**

O problema mais comum é que **o servidor não está rodando**. Execute:

```bash
./start-system.sh
```

Isso irá:

1. ✅ Verificar dependências
2. ✅ Configurar ambiente
3. ✅ Verificar banco de dados
4. ✅ Iniciar servidor API (porta 3001)
5. ✅ Iniciar frontend (porta 5173)
6. ✅ Mostrar status de tudo

## 🔍 **Diagnóstico**

Se ainda houver problemas:

```bash
# Verificar se portas estão livres:
lsof -i :3001  # Servidor
lsof -i :5173  # Frontend

# Verificar logs:
tail -f server.log
tail -f frontend.log

# Testar conexão com banco:
mysql -u root -p cdm_admin -e "SELECT COUNT(*) FROM users;"
```

## 🆘 **Se Nada Funcionar**

1. **Verificar MySQL:** `systemctl status mysql`
2. **Verificar Node.js:** `node --version` (precisa ser 18+)
3. **Reinstalar dependências:**
   ```bash
   rm -rf node_modules server/node_modules
   npm install
   cd server && npm install
   ```

---

## 🎉 **Após Resolução**

✅ CSP corrigida no `index.html`  
✅ Scripts de gerenciamento criados  
✅ Usuários Yan e Michel configurados  
✅ Sistema de autenticação completo

**Execute `./start-system.sh` e acesse http://localhost:5173** 🚀
