# 🔧 CORREÇÃO: Erro Google OAuth - Provider não habilitado

## ❌ **Problema identificado:**

```
error_code: "validation_failed"
msg: "Unsupported provider: provider is not enabled"
```

**Tradução**: O provedor Google não está ativado no Supabase.

## ✅ **SOLUÇÃO COMPLETA:**

### 🚀 **PASSO 1: Ativar Google no Supabase**

Dashboard já aberto: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers

1. **Encontre "Google"** na lista de provedores
2. **Clique no botão toggle** para ativar
3. **Você verá campos para preencher**:
   - Client ID
   - Client Secret

### 🔗 **PASSO 2: Criar Credenciais no Google Cloud**

1. **Acesse**: https://console.cloud.google.com/
2. **Crie/Selecione um projeto**
3. **Ative a Google+ API**:

   - Vá para "APIs & Services" > "Library"
   - Procure "Google+ API" ou "Google Identity"
   - Clique "Enable"

4. **Crie credenciais OAuth**:

   - Vá para "APIs & Services" > "Credentials"
   - Clique "Create Credentials" > "OAuth 2.0 Client ID"
   - Selecione "Web application"

5. **Configure URLs de redirecionamento**:

   ```
   Authorized redirect URIs:
   https://xkkbeilbthmezeqizcch.supabase.co/auth/v1/callback
   ```

6. **Copie as credenciais**:
   - Client ID (formato: xxx.apps.googleusercontent.com)
   - Client Secret

### 🔧 **PASSO 3: Configurar no Supabase**

1. **Volte para o Supabase** (já aberto)
2. **No provedor Google**:
   - **Client ID**: Cole o Client ID do Google
   - **Client Secret**: Cole o Client Secret do Google
3. **Clique "Save"**

### 🧪 **PASSO 4: Testar**

1. **Recarregue a página** do seu app: http://localhost:3000
2. **Clique "Continuar com Google"**
3. **Deve redirecionar** para a tela de login do Google

## 🎯 **ALTERNATIVA RÁPIDA (Apenas email/senha):**

Se não quiser configurar Google agora, você pode:

1. **Criar usuários normais** no Supabase
2. **Remover temporariamente** o botão Google do LoginForm
3. **Usar apenas** email/senha

### Para remover o botão Google temporariamente:

```bash
# Editar LoginForm para esconder Google
# Mudar onGoogleLogin={loginWithGoogle} para onGoogleLogin={undefined}
```

## 📋 **URLs importantes:**

- **Google Console**: https://console.cloud.google.com/
- **Supabase Auth**: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers
- **App**: http://localhost:3000

## ⚡ **Resumo:**

1. ✅ **Ativar Google** no Supabase (dashboard aberto)
2. ✅ **Criar credenciais** no Google Cloud Console
3. ✅ **Configurar URLs** de redirecionamento
4. ✅ **Testar** o login

**Após isso, o Google OAuth funcionará perfeitamente!** 🎉
