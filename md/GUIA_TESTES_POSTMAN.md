# 🧪 GUIA PASSO A PASSO - COMO FAZER OS TESTES NO POSTMAN

## 📋 PRÉ-REQUISITOS

### 1. **Instalar o Postman**

- Baixe em: https://www.postman.com/downloads/
- Ou use a versão web: https://web.postman.co/

### 2. **Arquivos necessários** (já criados):

- ✅ `CDM_Admin_API.postman_collection.json`
- ✅ `CDM_Admin_Local.postman_environment.json`
- ✅ `CDM_Admin_Production.postman_environment.json`

---

## 🔧 PASSO 1: CONFIGURAR O POSTMAN

### **1.1 - Importar a Collection**

1. Abra o Postman
2. Clique no botão **"Import"** (canto superior esquerdo)
3. Clique em **"Upload Files"**
4. Selecione o arquivo: `CDM_Admin_API.postman_collection.json`
5. Clique **"Import"**

### **1.2 - Importar os Environments**

1. Clique novamente em **"Import"**
2. Selecione os arquivos:
   - `CDM_Admin_Local.postman_environment.json`
   - `CDM_Admin_Production.postman_environment.json`
3. Clique **"Import"**

### **1.3 - Selecionar Environment**

1. No canto superior direito, clique no dropdown onde está escrito **"No Environment"**
2. Escolha:
   - **"CDM Admin - Local Development"** → Para testar localmente
   - **"CDM Admin - Production (Plesk)"** → Para testar no Plesk

---

## 🚀 PASSO 2: EXECUTAR OS TESTES

### **2.1 - TESTE DE CONECTIVIDADE (Primeiro teste)**

#### **Para Local:**

1. Certifique-se que o servidor está rodando: `npm run dev` ou `node server/index.js`
2. Environment: **"CDM Admin - Local Development"**

#### **Para Produção:**

1. Environment: **"CDM Admin - Production (Plesk)"**

### **2.2 - FAZER LOGIN (OBRIGATÓRIO)**

1. Na Collection "CDM Admin API", expanda **"🔐 Auth"**
2. Clique em **"Login"**
3. Verifique o Body (deve estar assim):
   ```json
   {
     "email": "admin@cdm.com",
     "password": "admin123"
   }
   ```
4. Clique **"Send"**

#### **Resultados esperados:**

- ✅ **Status: 200 OK**
- ✅ **Response com token:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Administrador CDM",
      "email": "admin@cdm.com",
      "role": "admin"
    }
  }
  ```
- ✅ **Token salvo automaticamente** (verifique no Console: "Token salvo: ...")

#### **Se der erro:**

- **401 Unauthorized:** Email/senha incorretos
- **500 Internal Server Error:** Problema no banco de dados
- **404 Not Found:** API não está funcionando

---

### **2.3 - TESTE CRÍTICO: INVENTÁRIO GERAL**

#### **🎯 Este é o teste MAIS IMPORTANTE - estava causando o erro JSON.parse!**

#### **A) Listar Inventário**

1. Expanda **"📦 Inventário Geral"**
2. Clique em **"Listar Inventário"**
3. Clique **"Send"**
4. **Esperado:** Status 200 + lista de itens

#### **B) Criar Item (CRÍTICO!)**

1. Clique em **"Criar Item"**
2. Verifique o Body:
   ```json
   {
     "name": "Vela Branca",
     "description": "Velas para cerimônias",
     "category": "Ritual",
     "quantity": 50,
     "unit": "unidades",
     "minimum_stock": 10,
     "location": "Armazém A",
     "notes": "Verificar qualidade antes do uso",
     "supplier": "Fornecedor ABC",
     "purchase_date": "2025-01-15",
     "cost": 2.5
   }
   ```
3. Clique **"Send"**

#### **Resultado CRÍTICO:**

- ✅ **Status: 201 Created** + dados do item criado
- ❌ **Se der erro JSON.parse:** A correção não funcionou!

#### **C) Atualizar Item (CRÍTICO!)**

1. Primeiro, pegue o ID de um item (da listagem)
2. Clique em **"Atualizar Item"**
3. Altere a URL: `{{base_url}}/inventory/ID_DO_ITEM`
4. Body:
   ```json
   {
     "quantity": 45,
     "notes": "Quantidade atualizada após uso na cerimônia"
   }
   ```
5. Clique **"Send"**
6. **Esperado:** Status 200 + dados atualizados

#### **D) Deletar Item**

1. Clique em **"Deletar Item"**
2. Altere a URL: `{{base_url}}/inventory/ID_DO_ITEM`
3. Clique **"Send"**
4. **Esperado:** Status 200 + mensagem de sucesso

---

### **2.4 - TESTE INVENTÁRIO DO DAIME**

1. Expanda **"🌿 Inventário do Daime"**
2. Teste na ordem:
   - **"Listar Daime"** → Status 200
   - **"Criar Item Daime"** → Status 201
   - **"Atualizar Item Daime"** → Status 200 (altere o ID na URL)
   - **"Deletar Item Daime"** → Status 200 (altere o ID na URL)

---

### **2.5 - TESTE OUTRAS ROTAS**

Teste rapidamente:

- **👥 Membros** → "Listar Membros"
- **💰 Transações** → "Listar Transações"
- **📅 Eventos** → "Listar Eventos"
- **📊 Estatísticas** → "Dashboard Stats"

---

## 🔍 PASSO 3: ANALISAR OS RESULTADOS

### **✅ SINAIS DE SUCESSO:**

#### **Inventário Geral (CRÍTICO):**

- ✅ POST /inventory retorna **201** (não erro JSON.parse!)
- ✅ PUT /inventory/:id retorna **200** (não erro JSON.parse!)
- ✅ GET /inventory retorna **200**
- ✅ DELETE /inventory/:id retorna **200**

#### **Autenticação:**

- ✅ Login retorna **200** + token
- ✅ Token é salvo automaticamente
- ✅ Rotas protegidas funcionam com o token

#### **Outras Rotas:**

- ✅ Todas retornam **200** ou códigos esperados

### **❌ SINAIS DE PROBLEMA:**

#### **PROBLEMAS CRÍTICOS:**

- ❌ **Erro JSON.parse** em POST/PUT inventory → Correção não funcionou
- ❌ **404** em qualquer rota → API não está rodando
- ❌ **500** em login → Problema de banco de dados

#### **PROBLEMAS ESPERADOS (Normal):**

- ✅ **401** sem token → Autenticação funcionando
- ✅ **400** com dados inválidos → Validações funcionando
- ✅ **404** com ID inexistente → Comportamento correto

---

## 🎯 PASSO 4: TESTES ESPECÍFICOS

### **Teste 1: Verificar se a correção funcionou**

```json
POST {{base_url}}/inventory
{
  "name": "TESTE CORREÇÃO JSON",
  "category": "Teste",
  "quantity": 1,
  "unit": "unidade"
}
```

**Se retornar Status 201:** ✅ **CORREÇÃO FUNCIONOU!**  
**Se retornar erro JSON.parse:** ❌ **CORREÇÃO NÃO FUNCIONOU**

### **Teste 2: Validação de dados**

```json
POST {{base_url}}/inventory
{
  "description": "Item sem nome - deve dar erro"
}
```

**Esperado:** Status 400 + erro de validação

### **Teste 3: Sem autenticação**

1. Remova o token do header
2. Tente GET /inventory
3. **Esperado:** Status 401

---

## 📱 PASSO 5: DICAS PRÁTICAS

### **Como ver o que está acontecendo:**

#### **1. Console do Postman:**

- Vá em **View → Show Postman Console**
- Veja logs de requests e responses

#### **2. Response Body:**

- Sempre verifique o body da response
- JSON válido = ✅
- HTML/erro = ❌

#### **3. Status Codes:**

- **200/201:** Sucesso
- **400:** Dados inválidos (normal)
- **401/403:** Problema de autenticação
- **404:** Endpoint não existe
- **500:** Erro interno

### **Atalhos úteis:**

- **Ctrl/Cmd + Enter:** Enviar request
- **Ctrl/Cmd + D:** Duplicar request
- **Tab:** Auto-completar

---

## 🚨 PASSO 6: SOLUÇÃO DE PROBLEMAS

### **Problema: Erro 401 em todas as rotas**

**Solução:**

1. Faça login novamente
2. Verifique se o token foi salvo
3. Verifique se o environment está selecionado

### **Problema: Erro 404 em todas as rotas**

**Solução:**

1. Verifique se a API está rodando
2. Verifique a URL base no environment
3. Para local: `http://localhost:3001/api`
4. Para produção: `https://sleepy-allen.66-179-92-233.plesk.page/api`

### **Problema: Erro JSON.parse ainda acontece**

**Solução:**

1. A API não foi atualizada corretamente
2. Faça upload dos arquivos novos para o Plesk
3. Reinicie o servidor

### **Problema: Login retorna 500**

**Solução:**

1. Banco de dados não está configurado
2. Execute o script: `setup_database_teste.sql`
3. Verifique as credenciais do banco

---

## ✅ CHECKLIST FINAL

### **Antes de começar:**

- [ ] Postman instalado
- [ ] Collection importada
- [ ] Environments importados
- [ ] Environment selecionado
- [ ] API rodando (local) ou deploy feito (produção)

### **Testes obrigatórios:**

- [ ] Login realizado com sucesso
- [ ] POST /inventory funcionando (sem erro JSON.parse)
- [ ] PUT /inventory/:id funcionando (sem erro JSON.parse)
- [ ] GET /inventory listando itens
- [ ] Outras rotas básicas funcionando

### **Indicadores de sucesso:**

- [ ] Nenhum erro JSON.parse
- [ ] Status codes corretos (200, 201, 400, 401)
- [ ] Responses em JSON válido
- [ ] Token sendo salvo automaticamente
- [ ] Validações funcionando

---

**🎯 Agora você sabe exatamente como testar a API!**  
**📝 Siga este guia passo a passo e você conseguirá validar se a correção do erro JSON.parse funcionou!** ✅

_Criado em: 27 de junho de 2025_
