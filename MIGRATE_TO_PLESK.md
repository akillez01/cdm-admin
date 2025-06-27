# 🔄 Migração do Supabase para Banco no Plesk

## 📋 **Visão Geral**

Este guia te ajudará a migrar completamente do Supabase para um banco de dados tradicional (MySQL/PostgreSQL) hospedado no Plesk.

---

## 🎯 **Opções de Migração**

### **Opção 1: MySQL (Mais comum no Plesk)**

- ✅ Disponível na maioria dos planos Plesk
- ✅ Interface familiar (phpMyAdmin)
- ✅ Boa performance para aplicações médias

### **Opção 2: PostgreSQL**

- ✅ Mais recursos avançados
- ⚠️ Nem todos os planos Plesk incluem
- ✅ Melhor para aplicações complexas

---

## 🚀 **Passo 1: Preparar Banco no Plesk**

### **1.1 Criar Banco MySQL**

1. **Acesse Plesk Panel**
2. **Databases** → **Add Database**
3. **Configure:**
   ```
   Database Name: cdm_admin
   Username: cdm_user
   Password: [senha_segura]
   ```

### **1.2 Anotar Informações**

```
Host: localhost (ou IP do servidor)
Port: 3306 (MySQL) / 5432 (PostgreSQL)
Database: cdm_admin
Username: cdm_user
Password: [sua_senha]
```

---

## 🗄️ **Passo 2: Criar Estrutura do Banco**

### **2.1 Script SQL para MySQL**

```sql
-- Arquivo: database/mysql_schema.sql

-- Tabela de usuários
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'viewer') DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de membros
CREATE TABLE members (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    birth_date DATE,
    baptism_date DATE,
    join_date DATE NOT NULL,
    status ENUM('active', 'inactive', 'visitor') DEFAULT 'active',
    groups JSON,
    ministries JSON,
    skills JSON,
    photo VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de transações
CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    member_id VARCHAR(36),
    member_name VARCHAR(255),
    type ENUM('tithe', 'offering', 'donation', 'expense') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    payment_method ENUM('cash', 'check', 'card', 'pix', 'transfer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL
);

-- Tabela de inventário geral
CREATE TABLE inventory_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    location VARCHAR(255),
    value DECIMAL(10,2) NOT NULL DEFAULT 0,
    supplier VARCHAR(255),
    purchase_date DATE,
    min_quantity INT DEFAULT 0,
    status ENUM('available', 'low', 'depleted') DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela do inventário do Daime
CREATE TABLE daime_inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    codigo VARCHAR(50) UNIQUE NOT NULL,
    graduacao ENUM('Força 1', 'Força 2', 'Força 3', 'Força 4', 'Força 5') NOT NULL,
    litros DECIMAL(8,2) NOT NULL,
    data_feitio DATE NOT NULL,
    responsavel_feitio VARCHAR(255) NOT NULL,
    local_feitio VARCHAR(255),
    tipo_feitio ENUM('Novo', 'Concentração', 'Reforço') DEFAULT 'Novo',
    panela VARCHAR(100),
    observacoes TEXT,
    status ENUM('disponivel', 'reservado', 'consumido', 'vencido') DEFAULT 'disponivel',
    data_validade DATE,
    local_armazenamento VARCHAR(255),
    temperatura DECIMAL(4,1),
    ph DECIMAL(3,1),
    cor ENUM('Amarelo', 'Marrom Claro', 'Marrom', 'Marrom Escuro', 'Roxo') DEFAULT 'Amarelo',
    consistencia ENUM('Líquida', 'Densa', 'Muito Densa') DEFAULT 'Líquida',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de eventos
CREATE TABLE events (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    description TEXT,
    location VARCHAR(255),
    budget DECIMAL(10,2),
    status ENUM('planned', 'ongoing', 'completed', 'cancelled') DEFAULT 'planned',
    organizer VARCHAR(255),
    participants JSON,
    resources JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_inventory_status ON inventory_items(status);
CREATE INDEX idx_daime_codigo ON daime_inventory(codigo);
CREATE INDEX idx_daime_status ON daime_inventory(status);
CREATE INDEX idx_events_start_date ON events(start_date);

-- Dados de exemplo
INSERT INTO users (id, name, email, password_hash, role) VALUES
('admin-1', 'Administrador', 'admin@cdm.com', '$2a$10$hash_aqui', 'admin');

INSERT INTO daime_inventory (
    codigo, graduacao, litros, data_feitio, responsavel_feitio,
    local_feitio, tipo_feitio, panela, observacoes, status,
    local_armazenamento, temperatura, ph, cor, consistencia
) VALUES
(
    'DM001', 'Força 3', 15.5, '2024-12-15', 'Padrinho João',
    'Casa de Feitio - Núcleo Central', 'Concentração', 'Panela 1',
    'Feitio realizado com jagube do Rio Jordão', 'disponivel',
    'Despensa Principal - Prateleira A', 18.0, 3.2, 'Marrom', 'Densa'
),
(
    'DM002', 'Força 4', 8.2, '2024-11-28', 'Madrinha Maria',
    'Casa de Feitio - Núcleo Norte', 'Novo', 'Panela 2',
    'Primeira força do ano, muito concentrada', 'reservado',
    'Despensa Principal - Prateleira B', 16.0, 3.1, 'Marrom Escuro', 'Muito Densa'
);
```

---

## 🔧 **Passo 3: Configurar Aplicação**

### **3.1 Instalar Dependências**

```bash
npm install mysql2 bcryptjs jsonwebtoken cors express dotenv
# ou para PostgreSQL:
npm install pg bcryptjs jsonwebtoken cors express dotenv
```

### **3.2 Criar API Backend**

```javascript
// server/index.js
const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do banco
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Rotas de autenticação
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rotas do inventário do Daime
app.get("/api/daime-inventory", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM daime_inventory ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/daime-inventory", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Apenas admins podem adicionar" });
    }

    const {
      codigo,
      graduacao,
      litros,
      data_feitio,
      responsavel_feitio,
      local_feitio,
      tipo_feitio,
      panela,
      observacoes,
      status,
      data_validade,
      local_armazenamento,
      temperatura,
      ph,
      cor,
      consistencia,
    } = req.body;

    const [result] = await pool.execute(
      `INSERT INTO daime_inventory (
                codigo, graduacao, litros, data_feitio, responsavel_feitio,
                local_feitio, tipo_feitio, panela, observacoes, status,
                data_validade, local_armazenamento, temperatura, ph, cor, consistencia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        codigo,
        graduacao,
        litros,
        data_feitio,
        responsavel_feitio,
        local_feitio,
        tipo_feitio,
        panela,
        observacoes,
        status,
        data_validade,
        local_armazenamento,
        temperatura,
        ph,
        cor,
        consistencia,
      ]
    );

    res.json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mais rotas...

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### **3.3 Configurar Variáveis de Ambiente**

```env
# .env.production
# Configuração do Banco
DB_HOST=localhost
DB_USER=cdm_user
DB_PASSWORD=sua_senha_segura
DB_NAME=cdm_admin
DB_PORT=3306

# JWT
JWT_SECRET=sua_chave_jwt_muito_segura

# API
API_URL=https://seudominio.com/api
VITE_API_URL=https://seudominio.com/api

# App
VITE_BASE_URL=/
VITE_APP_TITLE=CDM Admin
VITE_APP_VERSION=1.0.0
```

---

## 🔄 **Passo 4: Modificar Frontend**

### **4.1 Criar Hook de API**

```typescript
// src/hooks/useApi.ts
import { useCallback } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function useApi() {
  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const apiRequest = useCallback(
    async (endpoint: string, options: RequestInit = {}) => {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return response.json();
    },
    []
  );

  // Inventário do Daime
  const getDaimeInventory = useCallback(async () => {
    return apiRequest("/daime-inventory");
  }, [apiRequest]);

  const addDaimeInventoryItem = useCallback(
    async (item: any) => {
      return apiRequest("/daime-inventory", {
        method: "POST",
        body: JSON.stringify(item),
      });
    },
    [apiRequest]
  );

  const updateDaimeInventoryItem = useCallback(
    async (id: string, item: any) => {
      return apiRequest(`/daime-inventory/${id}`, {
        method: "PUT",
        body: JSON.stringify(item),
      });
    },
    [apiRequest]
  );

  const deleteDaimeInventoryItem = useCallback(
    async (id: string) => {
      return apiRequest(`/daime-inventory/${id}`, {
        method: "DELETE",
      });
    },
    [apiRequest]
  );

  return {
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem,
  };
}
```

### **4.2 Substituir Hook do Supabase**

```typescript
// src/pages/Inventory.tsx
import { useApi } from "../hooks/useApi"; // Em vez de useSupabase

const Inventory: React.FC = () => {
  const {
    getDaimeInventory,
    addDaimeInventoryItem,
    updateDaimeInventoryItem,
    deleteDaimeInventoryItem,
  } = useApi(); // Substituir useSupabase

  // Resto do código permanece igual...
};
```

---

## 📦 **Passo 5: Deploy no Plesk**

### **5.1 Estrutura de Arquivos**

```
public_html/
├── index.html (frontend React)
├── assets/ (CSS, JS)
├── api/ (backend Node.js)
│   ├── index.js
│   ├── package.json
│   └── .env
└── .htaccess
```

### **5.2 Configurar Node.js no Plesk**

1. **Extensions** → **Node.js**
2. **Enable Node.js**
3. **Document Root**: `/api`
4. **Startup File**: `index.js`
5. **Install Dependencies**: `npm install`

### **5.3 Configurar .htaccess**

```apache
# .htaccess na raiz
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ /api/index.js [L]

# Frontend routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

---

## ✅ **Passo 6: Migrar Dados**

### **6.1 Exportar do Supabase**

```sql
-- No SQL Editor do Supabase
SELECT * FROM daime_inventory;
-- Salvar como CSV ou JSON
```

### **6.2 Importar no MySQL**

```sql
-- Via phpMyAdmin ou linha de comando
LOAD DATA INFILE 'dados_exportados.csv'
INTO TABLE daime_inventory
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;
```

---

## 🎯 **Resumo da Migração**

### **Antes (Supabase):**

- ✅ Frontend React
- ✅ Banco PostgreSQL gerenciado
- ✅ Autenticação integrada
- ✅ API REST automática

### **Depois (Plesk):**

- ✅ Frontend React (mesmo)
- ✅ Banco MySQL/PostgreSQL no Plesk
- ✅ Backend Node.js customizado
- ✅ Controle total dos dados

### **Vantagens da Migração:**

- 🎯 **Controle Total**: Seus dados ficam no seu servidor
- 💰 **Custo**: Pode ser mais barato longo prazo
- 🔧 **Customização**: Backend totalmente customizável
- 🔒 **Segurança**: Controle total sobre segurança

### **Considerações:**

- ⚠️ **Complexidade**: Mais código para manter
- 🛠️ **Manutenção**: Você gerencia backup/updates
- 🔧 **Setup**: Configuração inicial mais complexa

---

**Quer que eu implemente alguma parte específica desta migração?**
