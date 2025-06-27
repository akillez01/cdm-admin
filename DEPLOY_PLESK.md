# Configuração de Deploy para Plesk

## Guia Completo de Deploy no Plesk

### 1. Preparação do Ambiente

#### 1.1 Configurar Variáveis de Ambiente

Crie um arquivo `.env.production` na raiz do projeto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_publica_aqui

# App Configuration
VITE_APP_TITLE=CDM Admin
VITE_APP_VERSION=1.0.0
VITE_BASE_URL=/
```

#### 1.2 Configurar Build para Produção

O projeto já está configurado para build, mas vamos ajustar para Plesk.

### 2. Configuração do Supabase

#### 2.1 Aplicar Migrações no Banco

1. Acesse seu painel do Supabase
2. Vá para **SQL Editor**
3. Execute o script `supabase/setup_daime_table.sql`

#### 2.2 Configurar Domínio Personalizado (Opcional)

Se você tem um domínio próprio, configure no Supabase:

1. **Settings** → **API**
2. **Site URL**: `https://seudominio.com`
3. **Redirect URLs**: `https://seudominio.com/**`

### 3. Build do Projeto

#### 3.1 Instalar Dependências

```bash
npm install
```

#### 3.2 Build para Produção

```bash
npm run build:production
```

### 4. Upload para Plesk

#### 4.1 Via File Manager (Recomendado)

1. Acesse o Plesk Panel
2. Vá para **Files** → **File Manager**
3. Navegue até `public_html` ou `httpdocs`
4. Faça upload do conteúdo da pasta `dist/`
5. Extraia os arquivos se necessário

#### 4.2 Via FTP

```bash
# Conecte via FTP e envie os arquivos da pasta dist/
# para a pasta pública do seu domínio
```

### 5. Configuração do Plesk

#### 5.1 Configurar Document Root

1. **Websites & Domains** → **Hosting Settings**
2. Document root: `/public_html` ou `/httpdocs`

#### 5.2 Configurar Rewrite Rules (.htaccess)

O arquivo `.htaccess` já está incluído no build.

#### 5.3 Configurar HTTPS

1. **Websites & Domains** → **SSL/TLS Certificates**
2. Configure Let's Encrypt ou certificado personalizado

### 6. Verificação

#### 6.1 Testar Acesso

- Acesse `https://seudominio.com`
- Verifique se todas as rotas funcionam
- Teste login e funcionalidades

#### 6.2 Verificar Conexão com Banco

- Teste login/cadastro
- Verifique se dados são salvos
- Teste inventário do Daime

### 7. Manutenção

#### 7.1 Atualizações

Para atualizar:

1. Faça alterações no código
2. Execute `npm run build:production`
3. Substitua arquivos no Plesk

#### 7.2 Backup

- Configure backup automático no Plesk
- Mantenha backup do código fonte
- Backup do banco via Supabase

### 8. Troubleshooting

#### 8.1 Problemas Comuns

- **404 nas rotas**: Verificar .htaccess
- **Erro de conexão**: Verificar variáveis de ambiente
- **CORS**: Configurar no Supabase

#### 8.2 Logs

- Verificar logs no Plesk Panel
- Console do navegador para erros JavaScript

### 9. Otimizações

#### 9.1 Performance

- Compressão Gzip (configurar no Plesk)
- Cache de recursos estáticos
- CDN (opcional)

#### 9.2 SEO

- Configurar meta tags
- Sitemap.xml
- Robots.txt
