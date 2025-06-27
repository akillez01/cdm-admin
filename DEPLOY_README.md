# 🚀 Deploy CDM Admin para Plesk

Este guia te ajudará a fazer o deploy do sistema CDM Admin no Plesk de forma rápida e segura.

## 📋 Pré-requisitos

- ✅ Conta no Supabase configurada
- ✅ Domínio ou subdomínio configurado no Plesk
- ✅ Acesso ao painel Plesk
- ✅ Node.js instalado localmente (para build)

## 🔧 Configuração Rápida

### 1. Configurar Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.production.example .env.production

# Edite com suas configurações
nano .env.production
```

Preencha com suas informações do Supabase:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui
VITE_BASE_URL=/
```

### 2. Configurar Banco de Dados

1. Acesse seu dashboard Supabase
2. Vá para **SQL Editor**
3. Execute o conteúdo do arquivo `supabase/setup_daime_table.sql`

### 3. Fazer Build e Deploy

#### Opção A: Script Automático (Linux/Mac)

```bash
chmod +x deploy-plesk.sh
./deploy-plesk.sh
```

#### Opção B: Script Automático (Windows)

```cmd
deploy-plesk.bat
```

#### Opção C: Manual

```bash
npm install
npm run build:production
```

### 4. Upload para Plesk

1. **Acesse File Manager** no Plesk
2. **Navegue** até `public_html` ou `httpdocs`
3. **Faça upload** de todos os arquivos da pasta `dist/`
4. **Extraia** se necessário

## ⚡ Deploy Rápido (5 minutos)

Para quem tem pressa:

```bash
# 1. Configure ambiente
cp .env.production.example .env.production
# Edite .env.production com suas chaves do Supabase

# 2. Execute o banco no Supabase
# Cole o conteúdo de supabase/setup_daime_table.sql no SQL Editor

# 3. Build e envie
npm install && npm run build:production
# Envie pasta dist/ para seu Plesk

# 4. Teste
# Acesse seu domínio e verifique se funciona
```

## 🔍 Verificação

Após o deploy, teste:

- ✅ Site carrega: `https://seudominio.com`
- ✅ Login funciona
- ✅ Dados são salvos
- ✅ Todas as páginas carregam

## 🐛 Problemas Comuns

### Site não carrega

- Verifique se `.htaccess` foi enviado
- Confira logs no Plesk Panel

### Erro 404 nas rotas

- Confirme que `.htaccess` está na raiz
- Verifique configuração do Apache

### Erro de conexão

- Verifique variáveis em `.env.production`
- Confirme URL do Supabase
- Configure CORS no Supabase

### Dados não salvam

- Verifique chaves do Supabase
- Execute script do banco
- Confirme políticas RLS

## 📞 Precisa de Ajuda?

1. **Consulte** `DEPLOY_PLESK.md` para guia completo
2. **Use** `POST_DEPLOY_CHECKLIST.md` para verificação
3. **Verifique** logs no console do navegador
4. **Confira** logs no painel Plesk

## 🎯 Próximos Passos

Após deploy bem-sucedido:

- [ ] Configure backup automático
- [ ] Configure monitoramento
- [ ] Configure certificado SSL
- [ ] Teste todas as funcionalidades
- [ ] Configure domínio personalizado (opcional)

---

**💡 Dica**: Mantenha sempre um backup antes de fazer alterações!

**🔐 Segurança**: Nunca compartilhe suas chaves do Supabase publicamente!
