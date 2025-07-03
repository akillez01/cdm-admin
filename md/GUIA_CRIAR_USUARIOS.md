# 👥 Guia: Como Configurar Usuários Administradores no Supabase

## 🔗 **Passo 1: Acessar o Dashboard**

✅ **Dashboard já está aberto**: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users

## 👤 **Passo 2: Criar Usuários Administradores**

### **Para cada usuário, faça:**

1. **Clique no botão "Add user"** (canto superior direito)

2. **Preencha os dados:**

   - **Email**: `yan@cdm.com`
   - **Password**: [crie uma senha segura, ex: `Yan2025#CDM`]
   - ✅ **Marque**: "Email confirmed"
   - ✅ **Marque**: "Auto Confirm User"

3. **Clique em "Create user"**

4. **Repita para os outros usuários:**

### **👨‍💼 Usuário 1 - Yan**

- **Email**: `yan@cdm.com`
- **Senha**: `Yan2025#CDM` (ou sua escolha)
- ✅ Email confirmed
- ✅ Auto confirm user

### **👨‍💼 Usuário 2 - Michel**

- **Email**: `michel@cdm.com`
- **Senha**: `Michel2025#CDM` (ou sua escolha)
- ✅ Email confirmed
- ✅ Auto confirm user

### **👨‍💼 Usuário 3 - Administrador**

- **Email**: `admin@cdm.com`
- **Senha**: `Admin2025#CDM` (ou sua escolha)
- ✅ Email confirmed
- ✅ Auto confirm user

## ⚠️ **IMPORTANTE:**

- **SEMPRE marque "Email confirmed"** - senão o login falhará
- **Use senhas fortes** com letras, números e símbolos
- **Anote as senhas** em local seguro

## ✅ **Passo 3: Verificar Criação**

Após criar, você verá os 3 usuários listados na tela com:

- Status: "Confirmed"
- Last sign in: "Never"
- Provider: "email"

## 🚀 **Passo 4: Testar Login**

1. Acesse: http://localhost:3000
2. Use qualquer um dos emails criados
3. Digite a senha correspondente
4. Clique em "Entrar"

## 🎯 **Resultado Esperado:**

- Login bem-sucedido
- Redirecionamento para o dashboard
- Menu lateral com opções de administrador

---

**📞 Se tiver dúvidas:** Siga exatamente os passos acima e teste com um usuário primeiro!
