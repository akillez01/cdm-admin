# 👥 Sistema de Usuários Administradores - CDM Admin

## 🎯 Visão Geral

Este documento explica como configurar e gerenciar os usuários administradores do sistema CDM Admin, incluindo a criação dos usuários **Yan** e **Michel** conforme solicitado.

## 🔐 Usuários Administradores Configurados

O sistema agora possui os seguintes usuários administradores:

### 1. **Yan** (Administrador Principal)

- **Email:** `yan@cdm.local`
- **Senha:** `yan123cdm`
- **Role:** `admin`
- **Permissões:** Acesso total ao sistema

### 2. **Michel** (Administrador Principal)

- **Email:** `michel@cdm.local`
- **Senha:** `michel123cdm`
- **Role:** `admin`
- **Permissões:** Acesso total ao sistema

### 3. **Admin Padrão** (Backup)

- **Email:** `admin@cdm.local`
- **Senha:** `admin123`
- **Role:** `admin`
- **Permissões:** Acesso total ao sistema

## 🚀 Como Configurar

### Opção 1: Script Automático (Recomendado)

Execute o script de configuração:

```bash
chmod +x setup-admin-users.sh
./setup-admin-users.sh
```

### Opção 2: Configuração Manual

1. **Instalar dependências:**

```bash
npm install
cd server && npm install && cd ..
```

2. **Configurar banco de dados:**

```bash
# Criar arquivo .env no servidor
cp server/.env.example server/.env
# Editar as configurações do banco em server/.env
```

3. **Criar usuários administradores:**

```bash
node scripts/create-admin-users.js
```

## 🔧 Configuração do Banco de Dados

Certifique-se de que o banco MySQL está configurado corretamente:

### 1. **Criar banco de dados:**

```sql
CREATE DATABASE cdm_admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. **Executar schema:**

```bash
mysql -u root -p cdm_admin < server/database/mysql_schema.sql
```

### 3. **Verificar tabelas criadas:**

```sql
USE cdm_admin;
SHOW TABLES;
```

## 🖥️ Sistema de Autenticação

### Frontend

O sistema agora inclui:

- **Tela de Login:** Interface moderna e responsiva
- **Proteção de Rotas:** Todas as páginas protegidas por autenticação
- **Contexto de Autenticação:** Gerenciamento global do estado do usuário
- **Logout:** Funcionalidade completa de saída do sistema

### Backend

- **JWT Tokens:** Autenticação baseada em tokens seguros
- **Criptografia bcrypt:** Senhas criptografadas com bcrypt
- **Rate Limiting:** Proteção contra ataques de força bruta
- **Middleware de Autenticação:** Verificação automática de tokens

## 🔑 Como Fazer Login

1. **Acesse o sistema:** `http://localhost:5173`

2. **Use uma das credenciais:**

   - **Yan:** `yan@cdm.local` / `yan123cdm`
   - **Michel:** `michel@cdm.local` / `michel123cdm`
   - **Admin:** `admin@cdm.local` / `admin123`

3. **Sistema automático:** O token será salvo automaticamente

## 🛡️ Segurança

### Senhas

- ⚠️ **IMPORTANTE:** Altere as senhas padrão no primeiro acesso
- As senhas são criptografadas com bcrypt (salt rounds: 10)
- Senhas devem ter pelo menos 6 caracteres

### Tokens JWT

- Tokens válidos por 24 horas
- Renovação automática na interface
- Logout remove o token localmente

### Roles e Permissões

- **admin:** Acesso total ao sistema
- **manager:** Acesso de gerenciamento (futuro)
- **viewer:** Apenas visualização (futuro)

## 📊 Monitoramento

### Logs de Acesso

Todos os logins são registrados na tabela `access_logs`:

- User ID
- IP Address
- User Agent
- Timestamp

### Verificar Usuários Ativos

```sql
SELECT id, name, email, role, active, created_at
FROM users
WHERE role = 'admin'
ORDER BY created_at;
```

## 🔧 Comandos Úteis

### Criar Novo Usuário Admin

```bash
node scripts/create-admin-users.js
```

### Verificar Status do Sistema

```bash
# Iniciar servidor
npm run server:dev

# Iniciar frontend
npm run dev

# Verificar logs
tail -f server/logs/app.log
```

### Reset de Senha (via SQL)

```sql
-- Gerar hash da nova senha (use um script Node.js com bcrypt)
UPDATE users
SET password_hash = '$2a$10$novoHashAqui'
WHERE email = 'usuario@cdm.local';
```

## 🚨 Troubleshooting

### Problema: Não consigo fazer login

**Soluções:**

1. Verificar se o banco está rodando
2. Conferir credenciais na tabela `users`
3. Verificar logs do servidor
4. Confirmar se JWT_SECRET está configurado

### Problema: Erro de conexão com banco

**Soluções:**

1. Verificar configurações em `server/.env`
2. Testar conexão: `mysql -u usuario -p banco`
3. Verificar se as tabelas existem

### Problema: Token inválido

**Soluções:**

1. Fazer logout e login novamente
2. Limpar localStorage do navegador
3. Verificar JWT_SECRET no servidor

## 📱 Testando com Postman

Para testar a API use as collections disponíveis:

1. **Import:** `CDM_Admin_API.postman_collection.json`
2. **Environment:** `CDM_Admin_Local.postman_environment.json`
3. **Login:** Use a rota `POST /api/auth/login`
4. **Token:** Será salvo automaticamente

### Exemplo de Login:

```json
POST http://localhost:3001/api/auth/login
{
  "email": "yan@cdm.local",
  "password": "yan123cdm"
}
```

## 📝 Próximos Passos

1. **Alterar senhas padrão** após primeiro acesso
2. **Configurar HTTPS** em produção
3. **Implementar 2FA** para maior segurança
4. **Criar roles adicionais** conforme necessário
5. **Configurar backup** regular do banco

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs em `server/logs/`
2. Conferir configurações em `server/.env`
3. Testar conexão com o banco manualmente
4. Verificar se todas as dependências estão instaladas

---

**🎉 Sistema configurado e pronto para uso!**

_Criado em: 2 de julho de 2025_
_Usuários: Yan e Michel configurados como solicitado_
