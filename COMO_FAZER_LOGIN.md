# 🔐 COMO FAZER LOGIN NO POSTMAN - PASSO A PASSO

## 🎯 **OBJETIVO**

Fazer login na API para obter o token de autenticação que será usado em todas as outras requisições.

---

## 📋 **PRÉ-REQUISITOS**

- ✅ Postman instalado e configurado
- ✅ Collection "CDM Admin API" importada
- ✅ Environment selecionado (Local ou Production)

---

## 🚀 **PASSO A PASSO - LOGIN**

### **1. Localizar o Request de Login**

1. No Postman, na aba **Collections** (lado esquerdo)
2. Expanda **"CDM Admin API"**
3. Expanda **"🔐 Auth"**
4. Clique em **"Login"**

### **2. Verificar a URL**

- Na aba do request, verifique se a URL está:
  ```
  {{base_url}}/auth/login
  ```
- Se estiver com `{{base_url}}`, está correto!

### **3. Verificar o Method**

- Deve estar **POST** (não GET)
- Se não estiver, clique no dropdown e mude para **POST**

### **4. Verificar Headers**

- Clique na aba **"Headers"**
- Deve ter:
  ```
  Content-Type: application/json
  ```

### **5. Configurar o Body**

1. Clique na aba **"Body"**
2. Selecione **"raw"**
3. No dropdown ao lado, selecione **"JSON"**
4. Cole este conteúdo:
   ```json
   {
     "email": "admin@cdm.com",
     "password": "admin123"
   }
   ```

### **6. Executar o Login**

1. Clique no botão **"Send"** (azul, à direita)
2. Aguarde a resposta

---

## ✅ **RESULTADOS ESPERADOS**

### **✅ LOGIN COM SUCESSO:**

#### **Status Code:**

- **200 OK** (em verde, canto superior direito)

#### **Response Body:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBjZG0uY29tIiwicm9sZSI6ImFkbWluIiwibmFtZSI6IkFkbWluaXN0cmFkb3IgQ0RNIiwiaWF0IjoxNzE5NDg2MDAwLCJleHAiOjE3MTk1NzI0MDB9.ABC123...",
  "user": {
    "id": 1,
    "name": "Administrador CDM",
    "email": "admin@cdm.com",
    "role": "admin"
  }
}
```

#### **Console (Verificar token salvo):**

1. Vá em **View → Show Postman Console** (ou Ctrl+Alt+C)
2. Deve aparecer: `Token salvo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **Environment (Token automático):**

1. Canto superior direito → Clique no ícone do "olho" 👁️
2. Deve mostrar a variável `token` preenchida

---

## ❌ **POSSÍVEIS ERROS E SOLUÇÕES**

### **❌ Status 401 Unauthorized**

```json
{
  "error": "Credenciais inválidas"
}
```

**Solução:**

- Verifique email e senha no Body
- Certifique-se que está usando: `admin@cdm.com` / `admin123`

### **❌ Status 404 Not Found**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>404 Not Found</title>
    ...
  </head>
</html>
```

**Solução:**

- API não está rodando
- Para **Local:** Execute `npm run dev` no terminal
- Para **Production:** Verifique se o deploy foi feito

### **❌ Status 500 Internal Server Error**

```json
{
  "error": "Erro interno do servidor"
}
```

**Solução:**

- Problema no banco de dados
- Execute o script: `setup_database_teste.sql`
- Verifique se o banco está configurado

### **❌ Erro de Conexão**

```
Error: getaddrinfo ENOTFOUND localhost
```

**Solução:**

- Servidor local não está rodando
- Mude para environment "Production" ou inicie o servidor

---

## 🔧 **TROUBLESHOOTING DETALHADO**

### **1. Verificar Environment**

1. Canto superior direito → Dropdown de environment
2. Certifique-se que está selecionado:
   - **"CDM Admin - Local Development"** (para localhost)
   - **"CDM Admin - Production (Plesk)"** (para produção)

### **2. Verificar URL Base**

1. Clique no ícone do "olho" 👁️ no environment
2. Verifique se `base_url` está correto:
   - **Local:** `http://localhost:3001/api`
   - **Production:** `https://sleepy-allen.66-179-92-233.plesk.page/api`

### **3. Testar Conexão Básica**

Antes do login, teste se a API responde:

1. Crie um novo request: **GET** `{{base_url}}/stats`
2. **NÃO** coloque autenticação
3. Envie
4. **Esperado:** Status 401 (não autorizado) - significa que API está funcionando

---

## 📱 **INTERFACE VISUAL**

### **Como deve estar o Postman:**

```
┌─ Postman Interface ────────────────────────────────────────┐
│ Collections     │  Request: Login                         │
│                 │  ┌─ POST {{base_url}}/auth/login ─────┐ │
│ ▼ CDM Admin API │  │                                    │ │
│   ▼ 🔐 Auth     │  │ Headers | Body | Pre-req | Tests   │ │
│     → Login ←   │  │ ┌─ Body ─────────────────────────┐ │ │
│     → Verify    │  │ │ ○ none  ○ form  ● raw  ○ bin  │ │ │
│   ▼ 📦 Invent.. │  │ │ {                             │ │ │
│     → List      │  │ │   "email": "admin@cdm.com",   │ │ │
│                 │  │ │   "password": "admin123"      │ │ │
│                 │  │ │ }                             │ │ │
│                 │  │ └───────────────────────────────┘ │ │
│                 │  │           [ Send ]                │ │
│                 │  └────────────────────────────────────┘ │
│                 │  Response: 200 OK                     │
│                 │  { "token": "...", "user": {...} }    │
└─────────────────┴────────────────────────────────────────┘
```

---

## 🎯 **TESTE RÁPIDO (30 segundos)**

### **Checklist pré-login:**

- [ ] Collection importada
- [ ] Environment selecionado
- [ ] Request "Login" aberto
- [ ] Method = POST
- [ ] URL = `{{base_url}}/auth/login`
- [ ] Body = JSON com email/senha

### **Executar:**

1. **Send** → ⏳ Aguardar resposta
2. **Verificar:** Status 200 + token na response
3. **Confirmar:** Token salvo no environment (👁️)

### **Se deu certo:**

- ✅ **Status 200** + **token recebido** = **LOGIN OK!**
- ✅ Agora pode usar qualquer outra rota da API
- ✅ Token será usado automaticamente nas próximas requisições

### **Se deu erro:**

- ❌ Veja a seção de erros acima
- ❌ Verifique se API está rodando
- ❌ Confirme credenciais: `admin@cdm.com` / `admin123`

---

## 🔄 **PRÓXIMOS PASSOS APÓS LOGIN**

### **1. Verificar se token funciona:**

```
🔐 Auth → Verificar Token → Send
Esperado: Status 200 + dados do usuário
```

### **2. Testar rota protegida:**

```
📦 Inventário Geral → Listar Inventário → Send
Esperado: Status 200 + lista de itens
```

### **3. Se token expirar:**

- Faça login novamente
- Token tem validade de 24 horas
- Script automático salvará o novo token

---

**🎯 Agora você sabe exatamente como fazer login!**  
**🔐 Uma vez logado, todas as outras requisições funcionarão automaticamente!** ✅

_Criado em: 27 de junho de 2025_
