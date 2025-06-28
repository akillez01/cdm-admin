# 🚀 DEPLOY COMPLETO PARA PLESK - CDM ADMIN

## ✅ **PASTA PRONTA PARA UPLOAD: `deploy-plesk/`**

### 📁 **CONTEÚDO DA PASTA `deploy-plesk/` (COMPLETA)**

```
deploy-plesk/
├── index.html                 # ✅ Página principal otimizada para Plesk
├── vite.svg                   # ✅ Favicon do site
├── .htaccess                  # ✅ Configuração Apache para SPA
├── .env.production            # ✅ Variáveis de ambiente para produção
├── assets/                    # ✅ JavaScript e CSS compilados
│   ├── browser-C0zXTumQ.js   # ✅ Scripts do navegador
│   ├── index-D-vrDhA2.js     # ✅ JavaScript principal
│   └── index-CWfnR0Ha.css    # ✅ CSS principal
├── images/                    # ✅ Imagens do site
│   └── cdmlogo.png           # ✅ Logo do CDM
├── api/                       # ✅ Backend opcional (se necessário)
└── [arquivos de configuração] # ✅ Documentação e configs extras
```

---

## 🎯 **INSTRUÇÕES DE UPLOAD PARA PLESK**

### **PASSO 1: Acesse o Plesk**

1. Faça login no seu painel Plesk
2. Vá para **"Websites & Domains"**
3. Clique no seu domínio
4. Clique em **"File Manager"**

### **PASSO 2: Navegue para o Diretório Público**

- Navegue para `httpdocs/` (ou `public_html/` dependendo da configuração)
- **IMPORTANTE**: Esta deve ser a pasta raiz do seu site

### **PASSO 3: Upload dos Arquivos**

```bash
# Faça upload de TODOS os arquivos da pasta deploy-plesk/
# PARA a raiz do seu site (httpdocs/)

Estrutura final no servidor:
/httpdocs/
├── index.html              ← Upload direto aqui
├── vite.svg               ← Upload direto aqui
├── .htaccess              ← Upload direto aqui
├── assets/                ← Upload pasta completa
│   ├── browser-C0zXTumQ.js
│   ├── index-D-vrDhA2.js
│   └── index-CWfnR0Ha.css
└── images/                ← Upload pasta completa
    └── cdmlogo.png
```

---

## ⚙️ **CONFIGURAÇÕES APLICADAS**

### **1. Arquivo `index.html` Otimizado**

- ✅ Referências corretas para arquivos JS e CSS
- ✅ Meta tags de segurança configuradas
- ✅ CSP ajustado para Plesk
- ✅ Favicon configurado

### **2. Arquivo `.htaccess` Configurado**

- ✅ Rewrite rules para SPA (Single Page Application)
- ✅ Headers de segurança
- ✅ Compressão ativada
- ✅ Cache control otimizado

### **3. Variáveis de Ambiente (`.env.production`)**

```bash
VITE_USE_SUPABASE=true
VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
VITE_APP_TITLE=CDM Admin
VITE_BASE_URL=/
```

---

## 🧪 **TESTE PÓS-DEPLOY**

### **1. URLs para Testar:**

```
https://seudominio.com/           # Página inicial
https://seudominio.com/inventory  # Inventário
https://seudominio.com/members    # Membros
https://seudominio.com/finance    # Finanças
https://seudominio.com/events     # Eventos
https://seudominio.com/reports    # Relatórios
```

### **2. Verificações Essenciais:**

- ✅ Site carrega sem erros 404
- ✅ Navegação entre páginas funciona
- ✅ Dados do inventário aparecem (via Supabase)
- ✅ Console sem erros críticos
- ✅ Site responsivo em mobile

---

## 🚨 **TROUBLESHOOTING**

### **Erro 404 nas rotas:**

```bash
# Solução: Verificar se .htaccess foi uploadado
# Localização: /httpdocs/.htaccess
```

### **Arquivos não carregam:**

```bash
# Solução: Verificar se pasta assets/ foi uploadada
# Localização: /httpdocs/assets/
```

### **Dados não aparecem:**

```bash
# Solução: Verificar conexão com Supabase no console
# Abrir F12 → Console → Procurar erros de rede
```

---

## ✅ **CHECKLIST FINAL**

- [ ] Pasta `deploy-plesk/` criada e completa
- [ ] Todos os arquivos da `deploy-plesk/` enviados para `/httpdocs/`
- [ ] Site acessível no navegador
- [ ] Navegação SPA funcionando
- [ ] Dados carregando do Supabase
- [ ] Interface responsiva
- [ ] Console limpo (sem erros críticos)

---

## 🎉 **RESULTADO ESPERADO**

Após o upload completo, você terá:

- ✅ **Site funcionando**: Todas as páginas acessíveis
- ✅ **Dados reais**: Inventário carregando do Supabase
- ✅ **Performance**: Otimizada para produção
- ✅ **Segurança**: Headers e CSP configurados
- ✅ **SEO**: Meta tags configuradas

**A pasta `deploy-plesk/` está 100% pronta para produção!** 🚀

## 📞 **SUPORTE**

Se encontrar problemas:

1. Verifique o console do navegador (F12)
2. Confirme que todos os arquivos foram enviados
3. Teste a conexão com Supabase
4. Verifique as configurações do Plesk
