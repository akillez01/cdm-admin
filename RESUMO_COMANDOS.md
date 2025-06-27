# 🎯 RESUMO EXECUTIVO - COMANDOS CDM ADMIN

## 🚀 **COMANDOS ESSENCIAIS PARA INÍCIO**

### **1. Setup Inicial (Executar apenas uma vez)**

```bash
# Navegar para o projeto
cd "/home/achilles/Documentos/novos pro cdm/cdm-admin"

# Instalar dependências
npm install

# Verificar se Supabase está funcionando
node test-inventory-access.js
```

### **2. Iniciar Desenvolvimento (Uso diário)**

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Acesso: http://localhost:3000
```

### **3. Comandos de Build e Deploy**

```bash
# Build padrão
npm run build

# Build para produção/Plesk
npm run build:production

# Preview local
npm run preview
```

---

## 🧪 **SCRIPTS DE TESTE E DIAGNÓSTICO**

### **Scripts Node.js Disponíveis:**

```bash
# ✅ TESTES BÁSICOS
node test-inventory-access.js          # Testa acesso ao Supabase
node test-supabase-connection.js       # Testa conexão básica
node test-frontend-mapping.js          # Testa mapeamento de dados

# 🔍 DIAGNÓSTICOS
node validate-inventory-system.js      # Validação completa do sistema
node diagnose-inventory-system.js      # Diagnóstico detalhado
node diagnose-supabase.js             # Diagnóstico específico do Supabase

# 🛠️ SETUP E CONFIGURAÇÃO
node setup-daime-inventory.js         # Configurar inventário do Daime
node apply-daime-migration-fixed.js   # Aplicar migração do Daime
node check-supabase-tables.js         # Verificar tabelas existentes

# 🧹 MANUTENÇÃO
node clear-logs.js                    # Limpar logs
node simple-test.js                   # Teste simples de funcionalidades
```

### **Scripts Shell Disponíveis:**

```bash
# 🔧 CONFIGURAÇÃO
./setup-auto.sh                       # Setup automático completo
./configure-env.sh                    # Configurar variáveis de ambiente
./secure-keys.sh                      # Configurar chaves de segurança

# 🚀 DEPLOY
./deploy-plesk.sh                     # Deploy para servidor Plesk
./start-dev-server.sh                 # Iniciar servidor de desenvolvimento

# 🗄️ BANCO DE DADOS
./create-table-cli.sh                 # Criar tabelas via CLI
./create-table-curl.sh                # Criar tabelas via cURL
./create-table-psql.sh                # Criar tabelas via PostgreSQL
./fix-table.sh                        # Corrigir problemas em tabelas
```

---

## 📋 **SCRIPTS NPM COMPLETOS**

```bash
# DESENVOLVIMENTO
npm run dev                           # Servidor de desenvolvimento
npm run build                        # Build padrão
npm run build:production              # Build para produção
npm run build:plesk                   # Build específico para Plesk
npm run preview                       # Preview local
npm run preview:production            # Preview da versão de produção

# QUALIDADE DE CÓDIGO
npm run lint                          # Verificar código com ESLint

# DEPLOY
npm run predeploy                     # Preparar para deploy
npm run deploy                        # Deploy para GitHub Pages
npm run deploy:plesk                  # Deploy para Plesk

# MIGRAÇÃO
npm run migrate:export                # Exportar dados para MySQL
npm run migrate:help                  # Ajuda sobre migração

# SERVIDOR LOCAL
npm run server:install                # Instalar deps do servidor
npm run server:dev                    # Servidor local em desenvolvimento
npm run server:start                  # Iniciar servidor local
```

---

## 🗄️ **SUPABASE - CONFIGURAÇÃO E ACESSO**

### **Tabelas Principais:**

- `inventory_items` - Inventário geral (8 itens)
- `daime_inventory` - Inventário do Santo Daime (3 itens)
- `members` - Membros da comunidade
- `transactions` - Transações financeiras
- `events` - Eventos e trabalhos

### **Configuração (.env.local):**

```bash
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_BASE_URL=/cdm-admin
VITE_APP_TITLE=CDM Admin - Supabase
```

---

## 🚨 **COMANDOS DE EMERGÊNCIA**

### **Se o projeto não iniciar:**

```bash
# Limpar cache e reinstalar
rm -rf node_modules .vite dist
npm install
npm run dev
```

### **Se o Supabase não funcionar:**

```bash
# Testar conexão
node test-supabase-connection.js

# Verificar tabelas
node check-supabase-tables.js

# Diagnóstico completo
node validate-inventory-system.js
```

### **Se houver problemas de performance:**

```bash
# Limpar logs
node clear-logs.js

# Testar sistema
node simple-test.js
```

---

## 🎯 **FLUXO DE TRABALHO RECOMENDADO**

### **Desenvolvimento Diário:**

```bash
1. npm run dev                        # Iniciar servidor
2. # Desenvolver funcionalidades
3. npm run lint                       # Verificar código
4. npm run build                      # Testar build
```

### **Deploy para Produção:**

```bash
1. npm run build:production           # Build otimizado
2. node validate-inventory-system.js  # Validar sistema
3. ./deploy-plesk.sh                  # Deploy para servidor
```

### **Diagnóstico de Problemas:**

```bash
1. node test-inventory-access.js      # Testar dados
2. node diagnose-inventory-system.js  # Diagnóstico
3. node validate-inventory-system.js  # Validação completa
```

---

## ✅ **STATUS ATUAL DO PROJETO**

- 🚀 **Servidor**: Funcionando em `http://localhost:3000`
- 🗄️ **Supabase**: Conectado e operacional
- 📦 **Inventário**: 8 itens no geral, 3 no Daime
- 🔧 **Build**: Configurado para produção
- 📝 **Logs**: Limpos e informativos
- ⚡ **Performance**: Otimizada (sem loops infinitos)

**O projeto está 100% funcional e pronto para uso!** 🎉
