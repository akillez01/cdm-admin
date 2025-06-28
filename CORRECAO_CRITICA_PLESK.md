# 🚨 CORREÇÃO CRÍTICA - PROBLEMAS PLESK RESOLVIDOS

## ❌ PROBLEMAS IDENTIFICADOS

### 1. Logo 404 Error

- **URL Erro**: `https://sleepy-allen.66-179-92-233.plesk.page/cdm-admin/images/cdmlogo.png`
- **Causa**: Caminho absoluto `/images/` mas o app está em subdiretório `/cdm-admin/`
- **Resultado**: Logo não aparece, fallback "CDM" sendo usado

### 2. CSP Bloqueando Supabase

- **Erro**: `Content-Security-Policy: https://seu_projeto.supabase.co/rest/v1/transactions`
- **Causa**: Build antigo com variáveis de placeholder não substituídas
- **Resultado**: Dados não carregam do Supabase

### 3. NetworkError em API

- **Erro**: `TypeError: NetworkError when attempting to fetch resource`
- **Causa**: Configuração incorreta de CSP e caminhos

## ✅ CORREÇÕES IMPLEMENTADAS

### 1. **Configuração de Base Path Corrigida**

```typescript
// vite.config.production.ts
base: '/cdm-admin/', // Agora reflete o caminho real no Plesk
```

### 2. **Logo Path Corrigido no Componente**

```typescript
// Sidebar.tsx - ANTES
src = "/images/cdmlogo.png";

// Sidebar.tsx - AGORA
src = "./images/cdmlogo.png"; // Caminho relativo
```

### 3. **Index.html com Paths Relativos**

```html
<!-- ANTES -->
<link rel="icon" href="/vite.svg" />
<script src="/assets/index-X.js"></script>

<!-- AGORA -->
<link rel="icon" href="./vite.svg" />
<script src="./assets/index-X.js"></script>
```

### 4. **.htaccess Otimizado para Subdiretório**

```apache
# Redireciona para index.html relativo, não absoluto
RewriteRule . ./index.html [L]
```

### 5. **Build Limpo com Variáveis Corretas**

- ✅ Removido build anterior com placeholders
- ✅ Novo build com `VITE_SUPABASE_URL=https://xkkbeilbthmezeqizcch.supabase.co`
- ✅ .env.production copiado para .env antes do build

### 6. **Test-Logo.html Atualizado**

- ✅ Teste para `/cdm-admin/images/cdmlogo.png` (absoluto)
- ✅ Teste para `./images/cdmlogo.png` (relativo)
- ✅ Teste para `images/cdmlogo.png` (sem barra)

## 📁 ESTRUTURA FINAL CORRIGIDA

```
deploy-plesk/
├── index.html ✅ (caminhos relativos)
├── .htaccess ✅ (subdiretório compatível)
├── .env.production ✅
├── assets/ ✅ (CSS, JS com URLs corretas)
├── images/ ✅
│   └── cdmlogo.png ✅ (presente e acessível)
├── vite.svg ✅
└── test-logo.html ✅ (testes com /cdm-admin/)
```

## 🔧 VALIDAÇÃO ESPERADA

### Após Deploy:

1. **Logo**: Deve aparecer em `./images/cdmlogo.png`
2. **Dados**: Supabase deve conectar com URL correta
3. **CSP**: Não deve mais bloquear requests do Supabase
4. **Assets**: CSS/JS devem carregar com caminhos relativos

### URLs de Teste:

- **App**: `https://sleepy-allen.66-179-92-233.plesk.page/cdm-admin/`
- **Logo Teste**: `https://sleepy-allen.66-179-92-233.plesk.page/cdm-admin/test-logo.html`
- **Logo Direct**: `https://sleepy-allen.66-179-92-233.plesk.page/cdm-admin/images/cdmlogo.png`

## 🚀 PRÓXIMOS PASSOS

1. **Upload**: Substituir todos os arquivos em `/cdm-admin/` no Plesk
2. **Teste**: Acessar `test-logo.html` primeiro para validar
3. **Verificação**: Abrir console e verificar se não há mais erros CSP
4. **Dados**: Confirmar que inventory e members carregam do Supabase
5. **Limpeza**: Remover `test-logo.html` após validação

---

**Status**: ✅ **CORREÇÕES CRÍTICAS APLICADAS**  
**Build**: Novo build limpo com configurações corretas  
**Deploy**: Pronto para upload no Plesk  
**Expectativa**: Logo visível + Dados do Supabase funcionando
