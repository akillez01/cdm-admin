# 🖼️ Guia Visual: Tela de Usuários do Supabase

## 📸 **Baseado no seu screenshot - Como deve parecer:**

### 🔍 **O que você deve ver na tela:**

```
🔗 https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users

┌─────────────────────────────────────────────────────────────┐
│ Authentication > Users                                       │
│                                                             │
│ [Add user] [Invite user]                        [Search...] │
│                                                             │
│ Email                 | Last Sign In | Provider | Actions  │
│ ─────────────────────────────────────────────────────────── │
│ (seus usuários aqui)  |              |          |          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 **Se a tela estiver vazia (sem usuários):**

1. **Clique no botão "Add user"** (azul, canto superior esquerdo)

2. **Uma janela modal vai abrir com campos:**

   ```
   ┌─── Add User ─────────────────────────┐
   │                                     │
   │ Email: [_________________________]  │
   │                                     │
   │ Password: [____________________]    │
   │                                     │
   │ ☐ Email confirmed                   │  ← MARQUE ESTA OPÇÃO
   │ ☐ Auto Confirm User                 │  ← MARQUE ESTA OPÇÃO
   │                                     │
   │        [Cancel]     [Create user]   │
   │                                     │
   └─────────────────────────────────────┘
   ```

3. **Preencha exatamente assim:**

   - **Email**: `yan@cdm.com`
   - **Password**: `Yan123#CDM`
   - ✅ **Email confirmed** (DEVE estar marcado)
   - ✅ **Auto Confirm User** (DEVE estar marcado)

4. **Clique "Create user"**

### ✅ **Se deu certo, você verá:**

```
│ yan@cdm.com          | Never        | email    | [...]    │
```

### 🔄 **Repita para os outros:**

- `michel@cdm.com` com senha `Michel123#CDM`
- `admin@cdm.com` com senha `Admin123#CDM`

## 🚨 **Problemas Comuns e Soluções:**

### ❌ **Se não conseguir criar usuário:**

- **Erro "Invalid email"**: Use exatamente `yan@cdm.com`
- **Erro "Password too weak"**: Use pelo menos 8 caracteres com números
- **Login falha depois**: Certifique-se que marcou "Email confirmed"

### ❌ **Se o botão "Add user" não aparecer:**

- Você pode não ter permissões de admin no projeto
- Tente recarregar a página
- Verifique se está no projeto correto

### ❌ **Se a página carrega em branco:**

- Verifique sua conexão com internet
- Tente outro navegador
- Limpe cache e cookies do Supabase

## 📞 **Precisa de ajuda?**

Descreva exatamente o que você vê na tela:

- Há um botão "Add user"?
- Já existem usuários listados?
- Alguma mensagem de erro?
- A página carregou completamente?

---

**💡 Dica**: Se tiver dúvidas, descreva o que está vendo na sua tela atual!
