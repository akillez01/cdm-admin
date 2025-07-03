# 🔧 Guia Completo: Configurar Autenticação Google

## 🚀 **PASSO A PASSO DETALHADO**

### 🔗 **PARTE 1: Google Cloud Console**

Google Console já aberto: https://console.cloud.google.com/

#### **1.1 Criar/Selecionar Projeto**

1. **Se não tiver projeto**: Clique "New Project"
   - Nome: `CDM Admin OAuth`
   - Clique "Create"
2. **Se já tiver**: Selecione o projeto desejado

#### **1.2 Ativar APIs Necessárias**

1. **Vá para**: "APIs & Services" > "Library"
2. **Procure**: "Google+ API" ou "Google Identity"
3. **Clique**: "Enable" na API encontrada

#### **1.3 Criar Credenciais OAuth**

1. **Vá para**: "APIs & Services" > "Credentials"
2. **Clique**: "Create Credentials" > "OAuth 2.0 Client ID"
3. **Configure tela de consentimento** (se pedido):
   - User Type: External
   - App name: CDM Admin
   - User support email: seu email
   - Developer contact: seu email
   - Clique "Save and Continue"

#### **1.4 Configurar Client ID**

1. **Application type**: Web application
2. **Name**: CDM Admin Web Client
3. **Authorized redirect URIs**:
   ```
   https://xkkbeilbthmezeqizcch.supabase.co/auth/v1/callback
   ```
4. **Clique**: "Create"

#### **1.5 Copiar Credenciais**

Após criar, você verá:

```
Client ID: 123456789-abcdef.apps.googleusercontent.com
Client Secret: GOCSPX-abc123def456
```

**⚠️ COPIE ESTES VALORES!**

---

### 🔧 **PARTE 2: Configurar Supabase**

#### **2.1 Acessar Providers**

1. **Acesse**: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers
2. **Encontre**: "Google" na lista

#### **2.2 Configurar Google Provider**

1. **Toggle**: Ative o Google (botão deve ficar azul)
2. **Client ID**: Cole o Client ID do Google
3. **Client Secret**: Cole o Client Secret do Google
4. **Clique**: "Save"

---

### ⚙️ **PARTE 3: Reativar no Código**

#### **3.1 Reativar Google Login**

Edite o arquivo: `src/components/ProtectedRoute.tsx`

```tsx
// MUDE DE:
return (
  <LoginForm
    onLogin={login}
    onGoogleLogin={undefined}
    isLoading={isLoading}
    error={error || undefined}
  />
);

// PARA:
return (
  <LoginForm
    onLogin={login}
    onGoogleLogin={loginWithGoogle}
    isLoading={isLoading}
    error={error || undefined}
  />
);
```

#### **3.2 Adicionar loginWithGoogle no useAuth**

```tsx
// Também mude:
const { isAuthenticated, isLoading, login, error } = useAuth();

// PARA:
const { isAuthenticated, isLoading, login, loginWithGoogle, error } = useAuth();
```

---

### 🧪 **PARTE 4: Testar**

1. **Reinicie** a aplicação: `npm run dev`
2. **Acesse**: http://localhost:3000
3. **Clique**: "Continuar com Google"
4. **Deve redirecionar** para o Google
5. **Após autenticar**, volta para o app logado

---

### 🎯 **RESUMO DOS URLS:**

- **Google Console**: https://console.cloud.google.com/
- **Supabase Auth**: https://supabase.com/dashboard/project/xkkbeilbthmezeqizcch/auth/providers
- **App**: http://localhost:3000

---

### ⚠️ **PROBLEMAS COMUNS:**

#### **Erro "unauthorized_client"**

- Verificar se a URL de redirect está correta
- Aguardar alguns minutos após salvar no Google

#### **Erro "access_denied"**

- Verificar se o Client ID/Secret estão corretos
- Verificar se o app está em produção no Google

#### **Não redireciona**

- Verificar se salvou as configurações no Supabase
- Verificar se o provider está ativado (toggle azul)

---

### 🚀 **STATUS APÓS CONFIGURAÇÃO:**

- ✅ Login com email/senha
- ✅ Login com Google OAuth
- ✅ Logout funcionando
- ✅ Sistema completo

**Execute os passos acima e o Google OAuth funcionará perfeitamente!** 🎉
