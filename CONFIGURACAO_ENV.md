# 🎯 Como Configurar o .env - CDM Admin

## 📋 **Situação Atual**

Suas credenciais do Supabase foram atualizadas nos arquivos de exemplo. Agora vou te ajudar a configurar o ambiente de desenvolvimento.

## ⚡ **Configuração Rápida (30 segundos)**

### **Opção 1: Script Automático (Recomendado)**

```bash
./configure-env.sh
```

### **Opção 2: Manual**

```bash
cp .env.development.example .env
```

## 🔍 **Verificar Configuração**

Após criar o .env, verifique se está correto:

```bash
cat .env | grep VITE_USE_SUPABASE
# Deve mostrar: VITE_USE_SUPABASE=false (para usar MySQL)
# Ou: VITE_USE_SUPABASE=true (para usar Supabase)
```

## 🎚️ **Modos de Operação**

### **Modo 1: MySQL Local (Recomendado)**

```env
VITE_USE_SUPABASE=false
VITE_API_URL=http://localhost:3001/api
```

- ✅ Mais rápido
- ✅ Dados locais
- ✅ Controle total
- ❗ Precisa do backend rodando

### **Modo 2: Supabase (Fallback)**

```env
VITE_USE_SUPABASE=true
```

- ✅ Funciona imediatamente
- ✅ Dados na nuvem
- ❗ Dependente da internet
- ❗ Limitações de quota

## 🚀 **Testando a Configuração**

### **1. Configurar .env**

```bash
./configure-env.sh
```

### **2. Limpar Cache**

```bash
rm -rf node_modules/.vite
```

### **3. Iniciar Frontend**

```bash
npm run dev
```

### **4. Verificar no Navegador**

- Abra: http://localhost:5173/cdm-admin
- Console (F12) deve mostrar:
  - `🟢 Usando API MySQL` (se false)
  - `🔵 Usando Supabase` (se true)
- Painel de debug no canto direito

## 🔄 **Alternando Entre Modos**

### **Para usar MySQL:**

```bash
echo "VITE_USE_SUPABASE=false" > .env.temp
echo "VITE_API_URL=http://localhost:3001/api" >> .env.temp
cat .env.development.example >> .env.temp
mv .env.temp .env
```

### **Para usar Supabase:**

```bash
echo "VITE_USE_SUPABASE=true" > .env.temp
cat .env.development.example >> .env.temp
mv .env.temp .env
```

## 🛠️ **Backend (se usar MySQL)**

### **1. Configurar Backend**

```bash
cd server
cp .env.development .env
# Editar credenciais do MySQL se necessário
```

### **2. Iniciar Backend**

```bash
./start-dev-server.sh
```

### **3. Testar API**

```bash
curl http://localhost:3001/api/stats
```

## 📊 **Status dos Arquivos**

```
✅ .env.production.example  - Suas credenciais reais
✅ .env.development.example - Template desenvolvimento
✅ .env.local              - Backup
✅ configure-env.sh        - Script automático
✅ .gitignore              - .env protegido
```

## 🔒 **Segurança**

- ✅ `.env` está no `.gitignore`
- ✅ Credenciais não serão commitadas
- ✅ Apenas arquivos `.example` são versionados
- ✅ Cada desenvolvedor tem seu próprio `.env`

## 🆘 **Resolução de Problemas**

### **Ainda vendo erros do Supabase?**

```bash
# 1. Verificar .env
cat .env | head -5

# 2. Limpar tudo
rm -rf node_modules/.vite
rm .env

# 3. Reconfigurar
./configure-env.sh

# 4. Reiniciar
npm run dev
```

### **Backend não responde?**

```bash
# Verificar se está rodando
curl http://localhost:3001/api/stats

# Se não, iniciar
./start-dev-server.sh
```

## 🎯 **Comando Final**

Execute isto para configurar tudo:

```bash
./configure-env.sh && rm -rf node_modules/.vite && npm run dev
```

---

**💡 Agora posso ver sua configuração através dos arquivos `.example` que estão versionados!**
