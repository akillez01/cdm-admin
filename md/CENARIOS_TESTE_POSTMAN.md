# 🧪 CENÁRIOS DE TESTE POSTMAN - CDM Admin API

## 📋 ROTEIRO COMPLETO DE TESTES

### 🎯 OBJETIVO

Testar todos os endpoints da API CDM Admin, especialmente os novos endpoints de inventário que foram criados para corrigir o erro JSON.parse.

---

## 🔧 CONFIGURAÇÃO INICIAL

### 1. **Importe os arquivos no Postman:**

- `CDM_Admin_API.postman_collection.json` - Collection completa
- `CDM_Admin_Local.postman_environment.json` - Environment local
- `CDM_Admin_Production.postman_environment.json` - Environment produção

### 2. **Selecione o Environment:**

- **Local:** Para testes durante desenvolvimento
- **Production:** Para testes no servidor Plesk

---

## 🚀 CENÁRIOS DE TESTE

### 📝 **CENÁRIO 1: TESTE BÁSICO DE CONECTIVIDADE**

#### Objetivo: Verificar se a API está respondendo

**Passos:**

1. Selecione environment "Local" ou "Production"
2. Execute: `GET {{base_url}}/stats` (sem autenticação)
3. **Resultado esperado:** Erro 401 (não autorizado)
4. **Se der erro 404:** API não está funcionando

---

### 🔐 **CENÁRIO 2: TESTE DE AUTENTICAÇÃO**

#### Objetivo: Testar login e obtenção de token

**Passos:**

1. Execute: `POST {{base_url}}/auth/login`
   ```json
   {
     "email": "{{admin_email}}",
     "password": "{{admin_password}}"
   }
   ```
2. **Resultado esperado:** Status 200 + token JWT
3. **Verificar:** Token foi salvo automaticamente na variável `{{token}}`
4. Execute: `GET {{base_url}}/auth/me`
5. **Resultado esperado:** Status 200 + dados do usuário

**Problemas possíveis:**

- **401:** Email/senha incorretos
- **500:** Erro de banco de dados

---

### 📦 **CENÁRIO 3: TESTE INVENTÁRIO GERAL (PRINCIPAL)**

#### Objetivo: Testar os endpoints que causavam erro JSON.parse

**Passos:**

#### 3.1 - Listar Inventário

```http
GET {{base_url}}/inventory
```

**Resultado esperado:** Status 200 + array de itens

#### 3.2 - Criar Item (CRÍTICO)

```http
POST {{base_url}}/inventory
Content-Type: application/json

{
  "name": "Teste Postman",
  "description": "Item criado via Postman para teste",
  "category": "Teste",
  "quantity": 10,
  "unit": "unidades",
  "minimum_stock": 2,
  "location": "Armazém Teste",
  "notes": "Teste de correção do erro JSON.parse",
  "supplier": "Fornecedor Teste",
  "purchase_date": "2025-06-27",
  "cost": 5.50
}
```

**Resultado esperado:** Status 201 + dados do item criado
**CRÍTICO:** Se der erro JSON.parse, a correção não funcionou!

#### 3.3 - Atualizar Item (CRÍTICO)

```http
PUT {{base_url}}/inventory/{{test_item_id}}
Content-Type: application/json

{
  "quantity": 8,
  "notes": "Quantidade atualizada via Postman"
}
```

**Resultado esperado:** Status 200 + dados atualizados

#### 3.4 - Deletar Item

```http
DELETE {{base_url}}/inventory/{{test_item_id}}
```

**Resultado esperado:** Status 200 + mensagem de sucesso

---

### 🌿 **CENÁRIO 4: TESTE INVENTÁRIO DO DAIME**

#### Objetivo: Testar CRUD completo do inventário do Daime

**Passos:**

#### 4.1 - Listar Daime

```http
GET {{base_url}}/daime-inventory
```

#### 4.2 - Criar Feitio

```http
POST {{base_url}}/daime-inventory
Content-Type: application/json

{
  "codigo": "TESTE-2025-001",
  "graduacao": "Força 3",
  "litros": 5.0,
  "dataFeitio": "2025-06-27",
  "responsavelFeitio": "Teste Postman",
  "localFeitio": "Casa de Teste",
  "tipoFeitio": "Novo",
  "panela": "Panela Teste",
  "observacoes": "Feitio criado via Postman para teste",
  "status": "disponivel",
  "dataValidade": "2025-12-27",
  "localArmazenamento": "Despensa Teste",
  "temperatura": 18.0,
  "ph": 4.2,
  "cor": "Amarelo",
  "consistencia": "Líquida"
}
```

#### 4.3 - Atualizar Feitio

```http
PUT {{base_url}}/daime-inventory/{{test_daime_id}}
Content-Type: application/json

{
  "litros": 3.5,
  "status": "consumido",
  "observacoes": "Parcialmente consumido em teste"
}
```

#### 4.4 - Deletar Feitio

```http
DELETE {{base_url}}/daime-inventory/{{test_daime_id}}
```

---

### 👥 **CENÁRIO 5: TESTE OUTRAS ROTAS**

#### 5.1 - Listar Membros

```http
GET {{base_url}}/members
```

#### 5.2 - Listar Transações

```http
GET {{base_url}}/transactions
```

#### 5.3 - Listar Eventos

```http
GET {{base_url}}/events
```

#### 5.4 - Estatísticas Dashboard

```http
GET {{base_url}}/stats
```

---

## 🔍 **CENÁRIOS DE TESTE DE ERRO**

### ❌ **CENÁRIO 6: TESTES DE VALIDAÇÃO**

#### 6.1 - Criar Inventário sem Campos Obrigatórios

```http
POST {{base_url}}/inventory
Content-Type: application/json

{
  "description": "Item sem nome - deve dar erro"
}
```

**Resultado esperado:** Status 400 + detalhes do erro

#### 6.2 - Criar Daime com Graduação Inválida

```http
POST {{base_url}}/daime-inventory
Content-Type: application/json

{
  "codigo": "ERRO-001",
  "graduacao": "Força 10",
  "litros": 5.0,
  "dataFeitio": "2025-06-27",
  "responsavelFeitio": "Teste"
}
```

**Resultado esperado:** Status 400 + erro de validação

#### 6.3 - Atualizar Item Inexistente

```http
PUT {{base_url}}/inventory/99999
Content-Type: application/json

{
  "quantity": 10
}
```

**Resultado esperado:** Status 404 + "Item não encontrado"

---

### 🔐 **CENÁRIO 7: TESTES DE AUTENTICAÇÃO**

#### 7.1 - Acesso sem Token

```http
GET {{base_url}}/inventory
# Remova o header Authorization
```

**Resultado esperado:** Status 401

#### 7.2 - Token Inválido

```http
GET {{base_url}}/inventory
Authorization: Bearer token_invalido_aqui
```

**Resultado esperado:** Status 403

#### 7.3 - Login com Credenciais Inválidas

```http
POST {{base_url}}/auth/login
Content-Type: application/json

{
  "email": "inexistente@email.com",
  "password": "senha_errada"
}
```

**Resultado esperado:** Status 401

---

## 📊 **CHECKLIST DE VALIDAÇÃO**

### ✅ **INVENTÁRIO GERAL (CRÍTICO)**

- [ ] GET /inventory retorna 200
- [ ] POST /inventory retorna 201 (não JSON.parse error!)
- [ ] PUT /inventory/:id retorna 200 (não JSON.parse error!)
- [ ] DELETE /inventory/:id retorna 200
- [ ] Validações funcionam (400 para dados inválidos)

### ✅ **INVENTÁRIO DO DAIME**

- [ ] GET /daime-inventory retorna 200
- [ ] POST /daime-inventory retorna 201
- [ ] PUT /daime-inventory/:id retorna 200
- [ ] DELETE /daime-inventory/:id retorna 200
- [ ] Filtros funcionam (status, graduacao, search)

### ✅ **AUTENTICAÇÃO**

- [ ] POST /auth/login retorna 200 + token
- [ ] GET /auth/me retorna 200 + dados do usuário
- [ ] Rotas protegidas retornam 401 sem token
- [ ] Token inválido retorna 403

### ✅ **OUTRAS ROTAS**

- [ ] GET /members retorna 200
- [ ] GET /transactions retorna 200
- [ ] GET /events retorna 200
- [ ] GET /stats retorna 200

---

## 🚨 **INDICADORES DE PROBLEMAS**

### 🔴 **PROBLEMAS CRÍTICOS:**

- **JSON.parse error** em POST/PUT inventory → Correção não funcionou
- **404 em qualquer endpoint** → API não está rodando
- **500 em /auth/login** → Problema de banco de dados
- **CORS error** → Configuração de CORS incorreta

### 🟡 **PROBLEMAS MENORES:**

- **401/403 esperados** → Autenticação funcionando
- **400 em validações** → Validações funcionando
- **404 em IDs inexistentes** → Comportamento correto

---

## 📝 **RELATÓRIO DE TESTE**

### Template para Documentar Resultados:

```markdown
## RELATÓRIO DE TESTE - Data: ****\_\_\_****

### Ambiente Testado: [ ] Local [ ] Produção

### Resultados:

#### INVENTÁRIO GERAL:

- GET /inventory: [ ] ✅ [ ] ❌ - Status: \_\_\_
- POST /inventory: [ ] ✅ [ ] ❌ - Status: \_\_\_
- PUT /inventory/:id: [ ] ✅ [ ] ❌ - Status: \_\_\_
- DELETE /inventory/:id: [ ] ✅ [ ] ❌ - Status: \_\_\_

#### AUTENTICAÇÃO:

- POST /auth/login: [ ] ✅ [ ] ❌ - Status: \_\_\_
- GET /auth/me: [ ] ✅ [ ] ❌ - Status: \_\_\_

#### OBSERVAÇÕES:

- Erro JSON.parse corrigido: [ ] ✅ [ ] ❌
- Todas as validações funcionando: [ ] ✅ [ ] ❌
- Performance adequada: [ ] ✅ [ ] ❌

#### PROBLEMAS ENCONTRADOS:

_Liste aqui os problemas encontrados_

#### CONCLUSÃO:

[ ] Sistema funcionando perfeitamente
[ ] Problemas menores identificados
[ ] Problemas críticos encontrados
```

---

**🎯 Use este roteiro para validar completamente a API!**  
**📝 Criado em: 27 de junho de 2025**
