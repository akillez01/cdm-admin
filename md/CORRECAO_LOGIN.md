# 🔧 CORREÇÃO: Login com yan@cdm.local

## ❌ **Problema identificado:**

Você está tentando fazer login com `yan@cdm.local`, mas:

1. O sistema estava configurado apenas para `yan@cdm.com`
2. O usuário `yan@cdm.local` não existe no Supabase

## ✅ **Correção aplicada:**

1. ✅ Código atualizado para aceitar tanto `@cdm.com` quanto `@cdm.local`
2. ⏳ Você precisa criar o usuário no Supabase

## 🚀 **Próximos passos:**

### 1. Criar usuário no Supabase

O dashboard já foi aberto: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/users

**Clique em "Add user" e crie:**

- **Email:** `yan@cdm.local`
- **Senha:** [escolha uma senha]
- ✅ **Marque:** "Email confirmed"

### 2. Testar o login

Após criar o usuário:

1. Acesse: http://localhost:3000/
2. Use: `yan@cdm.local`
3. Digite a senha que você definiu

## 📋 **Usuários autorizados agora:**

- `yan@cdm.com` e `yan@cdm.local`
- `michel@cdm.com` e `michel@cdm.local`
- `admin@cdm.com` e `admin@cdm.local`

## ⚡ **Após criar o usuário, o login funcionará!**
