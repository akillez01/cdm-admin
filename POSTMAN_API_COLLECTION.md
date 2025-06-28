# 📋 COLLECTION POSTMAN - CDM Admin API

Esta é a lista completa de todas as rotas da API para testar no Postman.

## 🔧 CONFIGURAÇÃO INICIAL

### Base URLs:

- **Local:** `http://localhost:3001/api`
- **Produção:** `https://sleepy-allen.66-179-92-233.plesk.page/api`

### Headers Globais:

```json
{
  "Content-Type": "application/json"
}
```

### Autenticação:

Para rotas protegidas, adicione no header:

```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

---

## 🔐 1. AUTENTICAÇÃO

### 1.1 Login

- **Method:** `POST`
- **URL:** `{{base_url}}/auth/login`
- **Body (JSON):**

```json
{
  "email": "admin@exemplo.com",
  "password": "123456"
}
```

- **Response:** Retorna token de autenticação
- **Rate Limit:** 5 tentativas por 15 minutos

### 1.2 Verificar Token

- **Method:** `GET`
- **URL:** `{{base_url}}/auth/me`
- **Headers:** `Authorization: Bearer {{token}}`
- **Response:** Dados do usuário logado

---

## 📦 2. INVENTÁRIO GERAL

### 2.1 Listar Inventário

- **Method:** `GET`
- **URL:** `{{base_url}}/inventory`
- **Headers:** `Authorization: Bearer {{token}}`
- **Response:** Lista todos os itens do inventário

### 2.2 Criar Item do Inventário

- **Method:** `POST`
- **URL:** `{{base_url}}/inventory`
- **Headers:** `Authorization: Bearer {{token}}`
- **Body (JSON):**

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
  "expiry_date": null,
  "cost": 2.5
}
```

- **Validações:**
  - `name`: obrigatório
  - `category`: obrigatório
  - `quantity`: obrigatório (número)
  - `unit`: obrigatório

### 2.3 Atualizar Item do Inventário

- **Method:** `PUT`
- **URL:** `{{base_url}}/inventory/{{item_id}}`
- **Headers:** `Authorization: Bearer {{token}}`
- **Body (JSON):** (apenas campos que deseja atualizar)

```json
{
  "quantity": 45,
  "notes": "Quantidade atualizada após uso na cerimônia"
}
```

### 2.4 Deletar Item do Inventário

- **Method:** `DELETE`
- **URL:** `{{base_url}}/inventory/{{item_id}}`
- **Headers:** `Authorization: Bearer {{token}}`
- **Response:** Mensagem de confirmação

---

## 🌿 3. INVENTÁRIO DO DAIME

### 3.1 Listar Inventário do Daime

- **Method:** `GET`
- **URL:** `{{base_url}}/daime-inventory`
- **Headers:** `Authorization: Bearer {{token}}`
- **Query Params (opcionais):**
  - `status`: disponivel, consumido, vencido
  - `graduacao`: Força 1, Força 2, Força 3, Força 4, Força 5
  - `search`: busca por código, responsável ou local

### 3.2 Criar Item do Daime

- **Method:** `POST`
- **URL:** `{{base_url}}/daime-inventory`
- **Headers:** `Authorization: Bearer {{token}}`
- **Body (JSON):**

```json
{
  "codigo": "DAI-2025-001",
  "graduacao": "Força 3",
  "litros": 10.5,
  "dataFeitio": "2025-01-20",
  "responsavelFeitio": "João Silva",
  "localFeitio": "Casa de Feitio Principal",
  "tipoFeitio": "Novo",
  "panela": "Panela 1",
  "observacoes": "Feitio realizado com concentração total",
  "status": "disponivel",
  "dataValidade": "2025-07-20",
  "localArmazenamento": "Despensa Sagrada",
  "temperatura": 18.5,
  "ph": 4.2,
  "cor": "Amarelo",
  "consistencia": "Líquida"
}
```

- **Validações:**
  - `codigo`: obrigatório e único
  - `graduacao`: obrigatório (Força 1-5)
  - `litros`: obrigatório (número positivo)
  - `dataFeitio`: obrigatório (data válida)
  - `responsavelFeitio`: obrigatório

### 3.3 Atualizar Item do Daime

- **Method:** `PUT`
- **URL:** `{{base_url}}/daime-inventory/{{item_id}}`
- **Headers:** `Authorization: Bearer {{token}}`
- **Body (JSON):** (campos para atualizar)

```json
{
  "litros": 8.0,
  "status": "consumido",
  "observacoes": "Utilizado na cerimônia de 25/06/2025"
}
```

### 3.4 Deletar Item do Daime

- **Method:** `DELETE`
- **URL:** `{{base_url}}/daime-inventory/{{item_id}}`
- **Headers:** `Authorization: Bearer {{token}}`

---

## 👥 4. MEMBROS

### 4.1 Listar Membros

- **Method:** `GET`
- **URL:** `{{base_url}}/members`
- **Headers:** `Authorization: Bearer {{token}}`

---

## 💰 5. TRANSAÇÕES

### 5.1 Listar Transações

- **Method:** `GET`
- **URL:** `{{base_url}}/transactions`
- **Headers:** `Authorization: Bearer {{token}}`

---

## 📅 6. EVENTOS

### 6.1 Listar Eventos

- **Method:** `GET`
- **URL:** `{{base_url}}/events`
- **Headers:** `Authorization: Bearer {{token}}`

---

## 📊 7. ESTATÍSTICAS

### 7.1 Dashboard Stats

- **Method:** `GET`
- **URL:** `{{base_url}}/stats`
- **Headers:** `Authorization: Bearer {{token}}`
- **Response:**

```json
{
  "membersCount": 150,
  "dimeItemsCount": 25,
  "totalLitros": 120.5,
  "monthlyRevenue": 5000.0,
  "monthlyExpenses": 1200.0
}
```

---

## 🔧 CONFIGURAÇÃO POSTMAN

### Variáveis de Ambiente:

1. Crie um Environment com as variáveis:

```json
{
  "base_url": "http://localhost:3001/api", // Para local
  "base_url": "https://sleepy-allen.66-179-92-233.plesk.page/api", // Para produção
  "token": "" // Será preenchido após login
}
```

### Script Pre-request para Login:

No request de login, adicione no tab "Tests":

```javascript
// Salvar token após login bem-sucedido
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("token", response.token);
  console.log("Token salvo:", response.token);
}
```

### Headers Template:

Para requests autenticados:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer {{token}}"
}
```

---

## 🧪 EXEMPLOS DE TESTE

### Fluxo Completo de Teste:

1. **Login:**

   ```json
   POST /auth/login
   {
     "email": "admin@teste.com",
     "password": "123456"
   }
   ```

2. **Criar Item de Inventário:**

   ```json
   POST /inventory
   {
     "name": "Teste Postman",
     "category": "Teste",
     "quantity": 5,
     "unit": "unidades"
   }
   ```

3. **Listar Inventário:**

   ```json
   GET /inventory
   ```

4. **Atualizar Item:**

   ```json
   PUT /inventory/1
   {
     "quantity": 3
   }
   ```

5. **Deletar Item:**
   ```json
   DELETE /inventory/1
   ```

---

## ⚠️ CÓDIGOS DE RESPOSTA

- **200:** Sucesso
- **201:** Criado com sucesso
- **400:** Dados inválidos / Validação falhou
- **401:** Token não fornecido
- **403:** Token inválido / Sem permissão
- **404:** Recurso não encontrado
- **429:** Rate limit excedido
- **500:** Erro interno do servidor

---

## 🔍 TROUBLESHOOTING

### Erro 401 - Unauthorized:

- Verifique se o token está sendo enviado no header
- Faça login novamente para obter token válido

### Erro 403 - Forbidden:

- Usuário não tem permissão de admin
- Token pode estar expirado

### Erro 400 - Bad Request:

- Verifique se todos os campos obrigatórios estão sendo enviados
- Verifique se os tipos de dados estão corretos

### Erro 404 - Not Found:

- Verifique se a URL está correta
- Verifique se o recurso existe (ID válido)

---

**🎯 Agora você tem tudo o que precisa para testar a API no Postman!**

_Criado em: 27 de junho de 2025_
