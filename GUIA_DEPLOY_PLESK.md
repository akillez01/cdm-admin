# 🚀 GUIA DE DEPLOY PARA PLESK - CDM ADMIN

## 📂 **PASTA PARA ENVIAR AO PLESK: `dist/`**

### 🔨 **PASSO 1: Fazer o Build**

```bash
cd "/home/achilles/Documentos/novos pro cdm/cdm-admin"

# Opção 1: Build automático com script
./deploy-plesk.sh

# Opção 2: Build manual
npm run build:production
```

### 📁 **PASSO 2: Arquivos Gerados**

Após o build, você terá a pasta `dist/` com:

```
dist/
├── index.html              # Página principal
├── .htaccess               # Configuração Apache/Nginx
├── assets/                 # CSS e JS compilados
│   ├── index-ByBzQ6hQ.js  # JavaScript principal
│   └── index-BqOMMAUZ.css # CSS principal
└── images/                 # Imagens estáticas
    └── cdmlogo.png
```

### 📤 **PASSO 3: Upload para Plesk**

#### **Opção A: Via Script Automático**

```bash
# Executa build e prepara pasta deploy-plesk/
./deploy-plesk.sh

# Pasta gerada: deploy-plesk/
# (já otimizada para Plesk)
```

#### **Opção B: Upload Manual**

1. **Conecte-se ao Plesk**
2. **Vá para File Manager**
3. **Navegue para o diretório público** (`httpdocs/` ou `public_html/`)
4. **Faça upload de TODO o conteúdo da pasta `dist/`**
5. **Não envie a pasta `dist/` em si, mas sim SEU CONTEÚDO**

### 🗂️ **ESTRUTURA NO SERVIDOR PLESK**

```
/httpdocs/                  # Diretório raiz do site
├── index.html             # ← Upload este arquivo
├── .htaccess              # ← Upload este arquivo
├── assets/                # ← Upload esta pasta
│   ├── *.js
│   └── *.css
└── images/                # ← Upload esta pasta
    └── cdmlogo.png
```

---

## ⚙️ **CONFIGURAÇÕES IMPORTANTES**

### 1. **Variáveis de Ambiente para Produção**

Certifique-se de que o `.env.production` esteja configurado:

```bash
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_BASE_URL=/
VITE_APP_TITLE=CDM Admin
```

### 2. **Configuração do Plesk**

- **Tipo de Site**: SPA (Single Page Application)
- **Servidor Web**: Apache ou Nginx
- **PHP**: Não necessário (aplicação React)
- **SSL**: Recomendado ativar

### 3. **Arquivos Essenciais**

- ✅ `index.html` - Página principal
- ✅ `.htaccess` - Routing para SPA
- ✅ `assets/` - JavaScript e CSS
- ✅ `images/` - Recursos visuais

---

## 🎯 **COMANDOS RESUMIDOS**

### **Build Rápido:**

```bash
npm run build:production
# Enviar conteúdo da pasta dist/ para Plesk
```

### **Build Completo com Script:**

```bash
./deploy-plesk.sh
# Enviar conteúdo da pasta deploy-plesk/ para Plesk
```

### **Verificar Build Localmente:**

```bash
npm run preview:production
# Testar em http://localhost:4173
```

---

## 🔍 **VERIFICAÇÃO PÓS-DEPLOY**

### **1. Testar URLs:**

- ✅ `https://seudominio.com/` - Página inicial
- ✅ `https://seudominio.com/inventory` - Inventário
- ✅ `https://seudominio.com/members` - Membros
- ✅ `https://seudominio.com/finance` - Finanças

### **2. Verificar Console:**

- ✅ Sem erros 404 para arquivos
- ✅ Supabase conectando corretamente
- ✅ Dados carregando normalmente

### **3. Funcionalidades:**

- ✅ Navegação entre páginas
- ✅ Carregamento de dados do inventário
- ✅ Interface responsiva

---

## 🚨 **PROBLEMAS COMUNS E SOLUÇÕES**

### **404 em rotas:**

- ✅ Verificar se `.htaccess` foi enviado
- ✅ Verificar configuração SPA no Plesk

### **Recursos não carregam:**

- ✅ Verificar se pasta `assets/` foi enviada
- ✅ Verificar permissões dos arquivos

### **Erro de conexão Supabase:**

- ✅ Verificar variáveis de ambiente
- ✅ Verificar CORS no Supabase

---

## ✅ **CHECKLIST FINAL**

- [ ] Build executado com sucesso
- [ ] Pasta `dist/` ou `deploy-plesk/` criada
- [ ] Arquivos enviados para `httpdocs/`
- [ ] Site acessível no navegador
- [ ] Navegação funcionando
- [ ] Dados carregando do Supabase
- [ ] Console sem erros críticos

---

## 🎉 **RESULTADO ESPERADO**

Após o deploy, você terá:

- ✅ Site funcionando em seu domínio
- ✅ Todas as páginas acessíveis
- ✅ Dados reais do Supabase
- ✅ Interface responsiva
- ✅ Performance otimizada

**Pasta para enviar: CONTEÚDO da `dist/` (não a pasta `dist/` em si)**
