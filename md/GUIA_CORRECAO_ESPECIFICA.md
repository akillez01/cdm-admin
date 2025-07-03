# 🔧 GUIA ESPECÍFICO DE CORREÇÃO - CDM Admin Deploy

## 🎯 PROBLEMA: Logo e Dados não aparecem após deploy no Plesk

### 📋 CHECKLIST RÁPIDO

1. **✅ Upload correto:**

   - Arquivo: `cdm-admin-deploy-final-YYYYMMDD-HHMM.zip`
   - Extrair em: `/httpdocs/cdm-admin/`
   - Verificar se `images/cdmlogo.png` está presente

2. **✅ Permissões:**

   ```bash
   chmod 755 cdm-admin/images/
   chmod 644 cdm-admin/images/cdmlogo.png
   chmod 644 cdm-admin/.htaccess
   ```

3. **✅ Teste direto da logo:**

   - URL: `https://seu-dominio.plesk.page/cdm-admin/images/cdmlogo.png`
   - Deve carregar a imagem diretamente

4. **✅ Teste do app:**
   - URL: `https://seu-dominio.plesk.page/cdm-admin/`
   - Deve carregar o painel sem erro 404

## 🔍 DIAGNÓSTICOS DISPONÍVEIS

### 1. Diagnóstico Específico

```
https://seu-dominio.plesk.page/cdm-admin/diagnostico-especifico.html
```

- Testa logo em múltiplos caminhos
- Verifica conectividade Supabase
- Valida CSP e assets
- Relatório detalhado com soluções

### 2. Correção Específica

```
https://seu-dominio.plesk.page/cdm-admin/correcao-especifica.html
```

- Correções automáticas
- Testes focados em problemas específicos
- Guias passo-a-passo

### 3. Diagnóstico Completo

```
https://seu-dominio.plesk.page/cdm-admin/diagnostico-completo.html
```

- Análise completa do sistema
- Múltiplos testes simultâneos
- Relatório final com soluções

## 🚨 PROBLEMAS MAIS COMUNS

### ❌ Problema 1: Logo não aparece

**Causa:** Permissões ou caminho incorreto

**Solução:**

1. Verificar se `images/cdmlogo.png` existe
2. Executar: `chmod 644 images/cdmlogo.png`
3. Executar: `chmod 755 images/`
4. Testar URL direta da logo

**Teste rápido:**

```bash
curl -I https://seu-dominio.plesk.page/cdm-admin/images/cdmlogo.png
```

Deve retornar `HTTP/1.1 200 OK`

### ❌ Problema 2: Dados não carregam

**Causa:** CORS, CSP ou configuração Supabase

**Solução:**

1. Ir para [Supabase Dashboard](https://supabase.com/dashboard)
2. Authentication > URL Configuration
3. Adicionar: `https://seu-dominio.plesk.page/cdm-admin`
4. Verificar CSP no `index.html`

**Teste rápido:**
Abrir Developer Tools (F12) e verificar:

- Console: erros de CORS ou CSP
- Network: requisições para Supabase

### ❌ Problema 3: App não carrega (404)

**Causa:** SPA routing ou .htaccess

**Solução:**

1. Verificar se `.htaccess` está presente
2. Verificar se `index.html` está na raiz
3. Testar URL base: `https://seu-dominio.plesk.page/cdm-admin/`

## 🔧 COMANDOS ÚTEIS SSH

```bash
# Ir para o diretório
cd /var/www/vhosts/seu-dominio.com/httpdocs/cdm-admin

# Verificar estrutura
ls -la

# Verificar permissões específicas
ls -la images/cdmlogo.png

# Corrigir permissões em massa
find . -type f -name "*.png" -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Verificar logs de erro (se disponível)
tail -f /var/log/httpd/error_log
```

## 📞 SUPORTE TÉCNICO

Se os problemas persistirem após seguir este guia:

1. **Capture screenshots** dos diagnósticos
2. **Copie logs** do Developer Tools (F12 > Console)
3. **Verifique** se seguiu todos os passos
4. **Teste** em navegador diferente/incógnito

## ✅ VERIFICAÇÃO FINAL

**Todos estes devem funcionar:**

- [ ] `https://seu-dominio.plesk.page/cdm-admin/` - App carrega
- [ ] `https://seu-dominio.plesk.page/cdm-admin/images/cdmlogo.png` - Logo carrega
- [ ] `https://seu-dominio.plesk.page/cdm-admin/diagnostico-especifico.html` - Diagnóstico carrega
- [ ] Logo aparece no painel sidebar
- [ ] Dados do inventário carregam
- [ ] Sem erros no console (F12)

## 🎯 PRÓXIMOS PASSOS

1. **Upload** do ZIP mais recente
2. **Acesse** diagnóstico específico
3. **Execute** correções automáticas
4. **Verifique** todos os itens da lista
5. **Teste** funcionalidades principais

---

**🔄 Última atualização:** $(date)
**📦 Versão do deploy:** cdm-admin-deploy-final-$(date +%Y%m%d-%H%M).zip
