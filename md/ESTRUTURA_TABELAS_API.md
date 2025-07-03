# 🗄️ ESTRUTURA DE TABELAS E MAPEAMENTOS - CDM Admin API

## 📊 TABELAS DO BANCO DE DADOS

### 🔐 1. TABELA: `users`

Armazena usuários do sistema com autenticação.

| Campo           | Tipo                  | Descrição            | Obrigatório |
| --------------- | --------------------- | -------------------- | ----------- |
| `id`            | INT PRIMARY KEY       | ID único do usuário  | ✅          |
| `name`          | VARCHAR(255)          | Nome completo        | ✅          |
| `email`         | VARCHAR(255) UNIQUE   | Email de login       | ✅          |
| `password_hash` | VARCHAR(255)          | Senha criptografada  | ✅          |
| `role`          | ENUM('admin', 'user') | Nível de permissão   | ✅          |
| `active`        | BOOLEAN               | Status ativo/inativo | ✅          |
| `created_at`    | TIMESTAMP             | Data de criação      | Auto        |
| `updated_at`    | TIMESTAMP             | Data de atualização  | Auto        |

**Endpoints:**

- `POST /auth/login` - Login
- `GET /auth/me` - Dados do usuário

---

### 📦 2. TABELA: `inventory_items`

Inventário geral da organização.

| Campo           | Tipo                                 | Descrição              | Obrigatório |
| --------------- | ------------------------------------ | ---------------------- | ----------- |
| `id`            | INT PRIMARY KEY                      | ID único do item       | ✅          |
| `name`          | VARCHAR(255)                         | Nome do item           | ✅          |
| `description`   | TEXT                                 | Descrição detalhada    | ❌          |
| `category`      | VARCHAR(100)                         | Categoria do item      | ✅          |
| `quantity`      | DECIMAL(10,2)                        | Quantidade atual       | ✅          |
| `unit`          | VARCHAR(50)                          | Unidade de medida      | ✅          |
| `minimum_stock` | DECIMAL(10,2)                        | Estoque mínimo         | ❌          |
| `location`      | VARCHAR(255)                         | Local de armazenamento | ❌          |
| `notes`         | TEXT                                 | Observações            | ❌          |
| `supplier`      | VARCHAR(255)                         | Fornecedor             | ❌          |
| `purchase_date` | DATE                                 | Data de compra         | ❌          |
| `expiry_date`   | DATE                                 | Data de validade       | ❌          |
| `cost`          | DECIMAL(10,2)                        | Custo unitário         | ❌          |
| `status`        | ENUM('available', 'low', 'depleted') | Status do estoque      | ❌          |
| `created_at`    | TIMESTAMP                            | Data de criação        | Auto        |
| `updated_at`    | TIMESTAMP                            | Data de atualização    | Auto        |

**Endpoints:**

- `GET /inventory` - Listar todos
- `POST /inventory` - Criar novo
- `PUT /inventory/:id` - Atualizar
- `DELETE /inventory/:id` - Deletar

---

### 🌿 3. TABELA: `daime_inventory`

Inventário específico do Sacramento Daime.

| Campo                 | Tipo                                                        | Descrição                      | Obrigatório |
| --------------------- | ----------------------------------------------------------- | ------------------------------ | ----------- |
| `id`                  | INT PRIMARY KEY                                             | ID único do item               | ✅          |
| `codigo`              | VARCHAR(50) UNIQUE                                          | Código identificador           | ✅          |
| `graduacao`           | ENUM('Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5') | Graduação/Força                | ✅          |
| `litros`              | DECIMAL(8,2)                                                | Quantidade em litros           | ✅          |
| `data_feitio`         | DATE                                                        | Data do feitio                 | ✅          |
| `responsavel_feitio`  | VARCHAR(255)                                                | Responsável pelo feitio        | ✅          |
| `local_feitio`        | VARCHAR(255)                                                | Local onde foi feito           | ❌          |
| `tipo_feitio`         | VARCHAR(100)                                                | Tipo (Novo, Concentrado, etc.) | ❌          |
| `panela`              | VARCHAR(100)                                                | Panela utilizada               | ❌          |
| `observacoes`         | TEXT                                                        | Observações do feitio          | ❌          |
| `status`              | ENUM('disponivel', 'consumido', 'vencido')                  | Status atual                   | ❌          |
| `data_validade`       | DATE                                                        | Data de validade               | ❌          |
| `local_armazenamento` | VARCHAR(255)                                                | Local de armazenamento         | ❌          |
| `temperatura`         | DECIMAL(4,1)                                                | Temperatura de armazenamento   | ❌          |
| `ph`                  | DECIMAL(3,1)                                                | Nível de pH                    | ❌          |
| `cor`                 | VARCHAR(50)                                                 | Cor do Daime                   | ❌          |
| `consistencia`        | VARCHAR(50)                                                 | Consistência                   | ❌          |
| `created_at`          | TIMESTAMP                                                   | Data de criação                | Auto        |
| `updated_at`          | TIMESTAMP                                                   | Data de atualização            | Auto        |

**Endpoints:**

- `GET /daime-inventory` - Listar todos (com filtros)
- `POST /daime-inventory` - Criar novo feitio
- `PUT /daime-inventory/:id` - Atualizar feitio
- `DELETE /daime-inventory/:id` - Deletar registro

---

### 👥 4. TABELA: `members`

Membros da organização.

| Campo        | Tipo                                    | Descrição           | Obrigatório |
| ------------ | --------------------------------------- | ------------------- | ----------- |
| `id`         | INT PRIMARY KEY                         | ID único do membro  | ✅          |
| `name`       | VARCHAR(255)                            | Nome completo       | ✅          |
| `email`      | VARCHAR(255)                            | Email de contato    | ❌          |
| `phone`      | VARCHAR(20)                             | Telefone            | ❌          |
| `address`    | TEXT                                    | Endereço completo   | ❌          |
| `birth_date` | DATE                                    | Data de nascimento  | ❌          |
| `join_date`  | DATE                                    | Data de entrada     | ✅          |
| `status`     | ENUM('active', 'inactive', 'suspended') | Status do membro    | ✅          |
| `notes`      | TEXT                                    | Observações         | ❌          |
| `created_at` | TIMESTAMP                               | Data de criação     | Auto        |
| `updated_at` | TIMESTAMP                               | Data de atualização | Auto        |

**Endpoints:**

- `GET /members` - Listar membros

---

### 💰 5. TABELA: `transactions`

Transações financeiras.

| Campo            | Tipo                                             | Descrição                   | Obrigatório |
| ---------------- | ------------------------------------------------ | --------------------------- | ----------- |
| `id`             | INT PRIMARY KEY                                  | ID único da transação       | ✅          |
| `type`           | ENUM('tithe', 'offering', 'donation', 'expense') | Tipo de transação           | ✅          |
| `amount`         | DECIMAL(10,2)                                    | Valor da transação          | ✅          |
| `description`    | VARCHAR(255)                                     | Descrição                   | ✅          |
| `date`           | DATE                                             | Data da transação           | ✅          |
| `member_id`      | INT                                              | ID do membro (se aplicável) | ❌          |
| `category`       | VARCHAR(100)                                     | Categoria da transação      | ❌          |
| `payment_method` | VARCHAR(50)                                      | Método de pagamento         | ❌          |
| `notes`          | TEXT                                             | Observações                 | ❌          |
| `created_at`     | TIMESTAMP                                        | Data de criação             | Auto        |
| `updated_at`     | TIMESTAMP                                        | Data de atualização         | Auto        |

**Endpoints:**

- `GET /transactions` - Listar transações

---

### 📅 6. TABELA: `events`

Eventos e cerimônias.

| Campo              | Tipo                                                   | Descrição               | Obrigatório |
| ------------------ | ------------------------------------------------------ | ----------------------- | ----------- |
| `id`               | INT PRIMARY KEY                                        | ID único do evento      | ✅          |
| `title`            | VARCHAR(255)                                           | Título do evento        | ✅          |
| `description`      | TEXT                                                   | Descrição do evento     | ❌          |
| `start_date`       | DATETIME                                               | Data/hora de início     | ✅          |
| `end_date`         | DATETIME                                               | Data/hora de fim        | ❌          |
| `location`         | VARCHAR(255)                                           | Local do evento         | ❌          |
| `max_participants` | INT                                                    | Máximo de participantes | ❌          |
| `status`           | ENUM('scheduled', 'ongoing', 'completed', 'cancelled') | Status                  | ✅          |
| `notes`            | TEXT                                                   | Observações             | ❌          |
| `created_at`       | TIMESTAMP                                              | Data de criação         | Auto        |
| `updated_at`       | TIMESTAMP                                              | Data de atualização     | Auto        |

**Endpoints:**

- `GET /events` - Listar eventos

---

### 📊 7. TABELA: `access_logs`

Logs de acesso ao sistema.

| Campo        | Tipo            | Descrição             | Obrigatório |
| ------------ | --------------- | --------------------- | ----------- |
| `id`         | INT PRIMARY KEY | ID único do log       | ✅          |
| `user_id`    | INT             | ID do usuário         | ✅          |
| `ip_address` | VARCHAR(45)     | IP do acesso          | ✅          |
| `user_agent` | TEXT            | User agent do browser | ❌          |
| `created_at` | TIMESTAMP       | Data/hora do acesso   | Auto        |

---

## 🔄 MAPEAMENTOS DE CAMPOS

### Frontend ⟷ Banco de Dados

#### Inventário Geral (`inventory_items`):

```json
{
  "Frontend": "Banco de Dados",
  "name": "name",
  "description": "description",
  "category": "category",
  "quantity": "quantity",
  "unit": "unit",
  "location": "location",
  "value": "cost",
  "supplier": "supplier",
  "purchaseDate": "purchase_date",
  "minQuantity": "minimum_stock",
  "status": "status",
  "notes": "notes"
}
```

#### Inventário do Daime (`daime_inventory`):

```json
{
  "Frontend": "Banco de Dados",
  "codigo": "codigo",
  "graduacao": "graduacao",
  "litros": "litros",
  "dataFeitio": "data_feitio",
  "responsavelFeitio": "responsavel_feitio",
  "localFeitio": "local_feitio",
  "tipoFeitio": "tipo_feitio",
  "panela": "panela",
  "observacoes": "observacoes",
  "status": "status",
  "dataValidade": "data_validade",
  "localArmazenamento": "local_armazenamento",
  "temperatura": "temperatura",
  "ph": "ph",
  "cor": "cor",
  "consistencia": "consistencia"
}
```

---

## 📋 RESUMO DE ENDPOINTS POR TABELA

### 🔐 AUTENTICAÇÃO

| Método | Endpoint      | Descrição               | Auth |
| ------ | ------------- | ----------------------- | ---- |
| POST   | `/auth/login` | Login do usuário        | ❌   |
| GET    | `/auth/me`    | Dados do usuário logado | ✅   |

### 📦 INVENTÁRIO GERAL

| Método | Endpoint         | Descrição         | Auth | Admin |
| ------ | ---------------- | ----------------- | ---- | ----- |
| GET    | `/inventory`     | Listar inventário | ✅   | ❌    |
| POST   | `/inventory`     | Criar item        | ✅   | ✅    |
| PUT    | `/inventory/:id` | Atualizar item    | ✅   | ✅    |
| DELETE | `/inventory/:id` | Deletar item      | ✅   | ✅    |

### 🌿 INVENTÁRIO DO DAIME

| Método | Endpoint               | Descrição        | Auth | Admin |
| ------ | ---------------------- | ---------------- | ---- | ----- |
| GET    | `/daime-inventory`     | Listar feitios   | ✅   | ❌    |
| POST   | `/daime-inventory`     | Criar feitio     | ✅   | ✅    |
| PUT    | `/daime-inventory/:id` | Atualizar feitio | ✅   | ✅    |
| DELETE | `/daime-inventory/:id` | Deletar feitio   | ✅   | ✅    |

### 👥 MEMBROS

| Método | Endpoint   | Descrição      | Auth | Admin |
| ------ | ---------- | -------------- | ---- | ----- |
| GET    | `/members` | Listar membros | ✅   | ❌    |

### 💰 TRANSAÇÕES

| Método | Endpoint        | Descrição         | Auth | Admin |
| ------ | --------------- | ----------------- | ---- | ----- |
| GET    | `/transactions` | Listar transações | ✅   | ❌    |

### 📅 EVENTOS

| Método | Endpoint  | Descrição      | Auth | Admin |
| ------ | --------- | -------------- | ---- | ----- |
| GET    | `/events` | Listar eventos | ✅   | ❌    |

### 📊 ESTATÍSTICAS

| Método | Endpoint | Descrição              | Auth | Admin |
| ------ | -------- | ---------------------- | ---- | ----- |
| GET    | `/stats` | Estatísticas dashboard | ✅   | ❌    |

---

## 🔍 FILTROS E PARÂMETROS

### GET `/daime-inventory` - Parâmetros de Query:

- `status`: `disponivel`, `consumido`, `vencido`
- `graduacao`: `Força 1`, `Força 2`, `Força 3`, `Força 4`, `Força 5`
- `search`: Busca por código, responsável ou local

**Exemplo:**

```
GET /daime-inventory?status=disponivel&graduacao=Força 3&search=João
```

---

## ⚠️ VALIDAÇÕES E REGRAS

### Campos Obrigatórios por Endpoint:

#### POST `/inventory`:

- `name` (string, não vazio)
- `category` (string, não vazio)
- `quantity` (número)
- `unit` (string, não vazio)

#### POST `/daime-inventory`:

- `codigo` (string, único)
- `graduacao` (enum válido)
- `litros` (número positivo)
- `dataFeitio` (data válida)
- `responsavelFeitio` (string, não vazio)

#### POST `/auth/login`:

- `email` (email válido)
- `password` (mínimo 6 caracteres)

---

## 🎯 CÓDIGOS DE RESPOSTA

| Código  | Descrição             | Quando Ocorre                    |
| ------- | --------------------- | -------------------------------- |
| **200** | OK                    | Sucesso na operação              |
| **201** | Created               | Item criado com sucesso          |
| **400** | Bad Request           | Dados inválidos/validação falhou |
| **401** | Unauthorized          | Token não fornecido              |
| **403** | Forbidden             | Token inválido/sem permissão     |
| **404** | Not Found             | Recurso não encontrado           |
| **429** | Too Many Requests     | Rate limit excedido              |
| **500** | Internal Server Error | Erro interno do servidor         |

---

**📝 Documento criado em: 27 de junho de 2025**  
**🎯 Para uso com Postman e desenvolvimento da API CDM Admin**
