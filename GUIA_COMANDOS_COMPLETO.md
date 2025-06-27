# 📋 GUIA COMPLETO DE COMANDOS - CDM ADMIN

## 🚀 **COMANDOS PARA INICIAR O PROJETO**

### 1. **Servidor de Desenvolvimento**

```bash
# Navegar para o diretório do projeto
cd "/home/achilles/Documentos/novos pro cdm/cdm-admin"

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Servidor estará disponível em:
# http://localhost:3000
```

### 2. **Build para Produção**

```bash
# Build do projeto
npm run build

# Preview do build
npm run preview
```

### 3. **Limpeza de Cache e Reinstalação**

```bash
# Limpar cache e reinstalar (quando há problemas)
rm -rf node_modules .vite
npm install
```

---

## 🗄️ **SUPABASE (BANCO DE DADOS)**

### 1. **Configuração Inicial**

```bash
# Variáveis de ambiente já configuradas em .env.local:
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. **Tabelas Criadas**

- ✅ `inventory_items` - Inventário geral
- ✅ `daime_inventory` - Inventário do Santo Daime
- ✅ `members` - Membros da comunidade
- ✅ `transactions` - Transações financeiras
- ✅ `events` - Eventos e trabalhos

---

## 🧪 **SCRIPTS DE TESTE E DIAGNÓSTICO**

### 1. **Testes de Conexão Supabase**

```bash
# Testar acesso às tabelas do Supabase
node test-inventory-access.js

# Testar mapeamento de dados (snake_case → camelCase)
node test-frontend-mapping.js

# Testar conexão básica com Supabase
node test-supabase-connection.js
```

### 2. **Scripts de Diagnóstico**

```bash
# Diagnóstico completo do sistema
node diagnose-inventory-system.js

# Validação completa de todos os componentes
node validate-inventory-system.js

# Diagnóstico específico do Supabase
node diagnose-supabase.js
```

### 3. **Scripts de Setup e Migração**

```bash
# Setup automático do ambiente
./setup-auto.sh

# Configurar tabela do inventário do Daime
node setup-daime-inventory.js

# Aplicar migração do Daime
node apply-daime-migration-fixed.js

# Verificar tabelas existentes
node check-supabase-tables.js
```

---

## 🛠️ **SCRIPTS DE MANUTENÇÃO**

### 1. **Criação de Tabelas**

```bash
# Criar tabelas via API
node create-tables-api.js

# Criar tabela específica do Daime
node create-daime-table.js

# Scripts SQL diretos
psql -h [host] -U [user] -d [database] -f create_all_tables.sql
```

### 2. **Scripts de Teste Específicos**

```bash
# Testar funcionalidade do Daime
node test-daime-functionality.js

# Teste simples de funcionalidades
node simple-test.js

# Debug da página de inventário
node debug-inventory-page-load.js
```

### 3. **Limpeza e Manutenção**

```bash
# Limpar logs
node clear-logs.js

# Configurar chaves de segurança
./secure-keys.sh

# Configurar variáveis de ambiente
./configure-env.sh
```

---

## 🌐 **DEPLOY E PRODUÇÃO**

### 1. **Deploy para Plesk**

```bash
# Deploy via script batch (Windows)
deploy-plesk.bat

# Deploy via script shell (Linux)
./deploy-plesk.sh

# Configurar servidor de desenvolvimento
./start-dev-server.sh
```

### 2. **Configurações de Servidor**

```bash
# Configurar NGINX
cp nginx.conf.example /etc/nginx/sites-available/cdm-admin

# Configurar permissões
chmod +x *.sh

# Verificar configuração
./test-sleepy-allen.sh
```

---

## 📁 **ESTRUTURA DE ARQUIVOS IMPORTANTES**

### 1. **Configuração**

```
.env.local              # Configuração principal (Supabase)
.env.production         # Configuração de produção
.env.example           # Exemplo de configuração
package.json           # Dependências do projeto
vite.config.ts         # Configuração do Vite
tsconfig.json          # Configuração TypeScript
```

### 2. **Scripts de Desenvolvimento**

```
scripts/               # Scripts de migração
server/               # Servidor local (se usado)
supabase/             # Configurações do Supabase
deploy-plesk/         # Arquivos de deploy
deploy-plesk-root/    # Deploy para root
```

---

## 🎯 **COMANDOS MAIS UTILIZADOS**

### **Para Desenvolvimento:**

```bash
# 1. Instalar e iniciar
npm install && npm run dev

# 2. Testar Supabase
node test-inventory-access.js

# 3. Validar sistema
node validate-inventory-system.js
```

### **Para Diagnóstico:**

```bash
# 1. Verificar conexão
node test-supabase-connection.js

# 2. Diagnosticar problemas
node diagnose-inventory-system.js

# 3. Limpar cache
rm -rf node_modules .vite && npm install
```

### **Para Deploy:**

```bash
# 1. Build
npm run build

# 2. Deploy
./deploy-plesk.sh

# 3. Verificar
npm run preview
```

---

## 📝 **LOGS E DOCUMENTAÇÃO**

### **Arquivos de Correção Criados:**

- `CORREÇÃO_FINALIZADA.md` - Status final do projeto
- `CORRECAO_LOOP_INFINITO.md` - Correção do loop infinito
- `CORRECAO_INVENTARIO_COMPLETA.md` - Correção completa do inventário
- `FIX_TABELAS_SUPABASE.md` - Correção das tabelas Supabase
- `DIAGNOSTICO_SISTEMA_ATUAL.md` - Diagnóstico completo

### **Scripts de Teste Disponíveis:**

- ✅ `test-inventory-access.js` - Teste de acesso ao inventário
- ✅ `test-frontend-mapping.js` - Teste de mapeamento de dados
- ✅ `validate-inventory-system.js` - Validação completa
- ✅ `diagnose-inventory-system.js` - Diagnóstico detalhado

---

## 🚀 **INÍCIO RÁPIDO**

```bash
# Clone ou navegue para o projeto
cd "/home/achilles/Documentos/novos pro cdm/cdm-admin"

# Instale dependências
npm install

# Inicie o servidor
npm run dev

# Acesse no navegador
# http://localhost:3000
```

**O projeto está pronto para uso!** 🎉
