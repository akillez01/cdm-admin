# ⚡ Configuração Rápida - CDM Admin

## 🎯 **Problema Atual**

O sistema está tentando usar Supabase em vez da nova API MySQL.

## ✅ **Solução Imediata (2 minutos)**

### **1. Configurar Variáveis de Ambiente**

```bash
# Na pasta raiz do projeto (/cdm-admin):
echo "VITE_USE_SUPABASE=false" > .env
echo "VITE_API_URL=http://localhost:3001/api" >> .env
```

### **2. Limpar Cache do Vite**

```bash
# Parar o servidor frontend (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

### **3. Verificar se Backend Está Rodando**

```bash
# Em outro terminal:
curl http://localhost:3001/api/stats

# Se der erro, iniciar o backend:
./start-dev-server.sh
```

### **4. Verificar no Navegador**

1. Abra http://localhost:5173/cdm-admin
2. Pressione F12 (Console)
3. Deve mostrar: "🟢 Usando API MySQL como provider de dados"
4. No canto inferior direito aparecerá um painel de debug

---

## 📋 **Checklist Rápido**

- [ ] Arquivo `.env` criado na raiz com `VITE_USE_SUPABASE=false`
- [ ] Cache do Vite limpo (`rm -rf node_modules/.vite`)
- [ ] Servidor backend rodando na porta 3001
- [ ] Frontend recarregado (Ctrl+F5)
- [ ] Console mostra "🟢 Usando API MySQL"

---

## 🔧 **Se Ainda Não Funcionar**

### **Opção A: Usar Supabase (Temporário)**

```bash
# .env
VITE_USE_SUPABASE=true
```

### **Opção B: Configurar MySQL Local**

```bash
# 1. Instalar MySQL
sudo apt install mysql-server

# 2. Configurar banco
mysql -u root -p
CREATE DATABASE cdm_admin;
exit

# 3. Configurar backend
cd server
cp .env.development .env
# Editar .env com suas credenciais

# 4. Importar schema
mysql -u root -p cdm_admin < database/mysql_schema.sql

# 5. Iniciar servidor
npm install
npm run dev
```

---

## 🎯 **Comandos de Emergência**

```bash
# Reset completo
rm -rf node_modules server/node_modules
rm -rf node_modules/.vite
npm install
cd server && npm install && cd ..

# Verificar configuração
cat .env
echo "==="
curl http://localhost:3001/api/stats

# Logs em tempo real
cd server && npm run dev
```

---

## 💡 **Dicas Importantes**

1. **Arquivo .env deve estar na RAIZ do projeto** (mesmo nível que package.json)
2. **Sempre limpar cache após mudar .env**: `rm -rf node_modules/.vite`
3. **Backend deve rodar na porta 3001** antes do frontend
4. **Use o painel de debug** no canto da tela para verificar configuração

---

**🚨 URGENTE: Se nada funcionar, execute:**

```bash
cp .env.local .env
rm -rf node_modules/.vite
npm run dev
```

Isso força o uso da nova API e limpa todo o cache!
