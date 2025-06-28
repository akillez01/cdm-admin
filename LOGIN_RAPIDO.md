# 🔐 LOGIN RÁPIDO - POSTMAN

## 📍 **ONDE ENCONTRAR:**

```
Collections → CDM Admin API → 🔐 Auth → Login
```

## 🎯 **CONFIGURAÇÃO:**

### **Method:** `POST`

### **URL:** `{{base_url}}/auth/login`

### **Body (JSON):**

```json
{
  "email": "admin@cdm.com",
  "password": "admin123"
}
```

## ▶️ **EXECUTAR:**

```
1. Verificar Body está correto
2. Clicar "Send"
3. Aguardar resposta
```

## ✅ **RESULTADO ESPERADO:**

```
Status: 200 OK
Response: {
  "token": "eyJhbGciOiJIUzI1NiI...",
  "user": {
    "id": 1,
    "name": "Administrador CDM",
    "email": "admin@cdm.com",
    "role": "admin"
  }
}

Console: "Token salvo: eyJhbGciOiJIUzI1NiI..."
```

## 🚨 **SE DER ERRO:**

| Erro    | Solução               |
| ------- | --------------------- |
| **401** | Verifique email/senha |
| **404** | API não está rodando  |
| **500** | Problema no banco     |

## 🎯 **TESTE SE FUNCIONOU:**

```
🔐 Auth → Verificar Token → Send
✅ Esperado: Status 200 + dados do usuário
```

---

**🚀 É só isso! Depois do login, todas as outras rotas funcionam automaticamente!** 🔓
