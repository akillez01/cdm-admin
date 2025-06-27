# Checklist Pós-Deploy

## ✅ Verificações Essenciais

### 1. Acesso Básico

- [ ] Site carrega em `https://seudominio.com`
- [ ] Todas as páginas são acessíveis (Dashboard, Membros, Finanças, etc.)
- [ ] Não há erros 404 ao navegar entre páginas
- [ ] HTTPS está funcionando corretamente

### 2. Funcionalidades do Sistema

- [ ] Login funciona corretamente
- [ ] Dashboard exibe dados
- [ ] Membros: listar, adicionar, editar
- [ ] Finanças: listar transações, filtros
- [ ] Inventário Geral: CRUD funciona
- [ ] Sacramento do Daime: CRUD funciona
- [ ] Modal de perfil do admin funciona

### 3. Conexão com Banco

- [ ] Dados são salvos no Supabase
- [ ] Dados são carregados corretamente
- [ ] Políticas de segurança funcionam
- [ ] Apenas admins podem editar dados críticos

### 4. Performance e SEO

- [ ] Site carrega em menos de 3 segundos
- [ ] Imagens são otimizadas
- [ ] Compressão Gzip está ativa
- [ ] Cache de recursos estáticos funciona

### 5. Segurança

- [ ] HTTPS forçado (redirect HTTP → HTTPS)
- [ ] Headers de segurança configurados
- [ ] Arquivos sensíveis não são acessíveis
- [ ] CORS configurado corretamente no Supabase

## 🔧 Troubleshooting

### Problemas Comuns

#### Site não carrega

```bash
# Verificar se arquivos foram enviados corretamente
# Verificar .htaccess ou nginx.conf
# Verificar logs do servidor no Plesk
```

#### Erro 404 nas rotas

```bash
# Verificar se .htaccess está na raiz
# Para Nginx: verificar nginx.conf
# Verificar se try_files está configurado
```

#### Erro de conexão com Supabase

```bash
# Verificar variáveis de ambiente
# Verificar URL e chaves do Supabase
# Verificar CORS no Supabase Dashboard
```

#### Problemas de autenticação

```bash
# Verificar Site URL no Supabase
# Verificar Redirect URLs no Supabase
# Verificar políticas RLS
```

## 📊 Monitoramento

### Métricas para Acompanhar

- [ ] Tempo de carregamento da página
- [ ] Taxa de erro (JavaScript)
- [ ] Uptime do servidor
- [ ] Uso de recursos (CPU, memória)

### Logs Importantes

- [ ] Logs do servidor web (Apache/Nginx)
- [ ] Logs de aplicação no Plesk
- [ ] Console do navegador para erros JS
- [ ] Logs do Supabase

## 🔄 Manutenção

### Atualizações Regulares

- [ ] Backup dos dados antes de atualizar
- [ ] Testar em ambiente de desenvolvimento
- [ ] Atualizar dependências de segurança
- [ ] Monitorar performance pós-atualização

### Backup

- [ ] Backup automático configurado no Plesk
- [ ] Backup do código fonte (Git)
- [ ] Backup do banco via Supabase
- [ ] Testar restauração de backup

## 📞 Suporte

### Informações para Suporte

- **Versão do Node.js**: Verificar com `node --version`
- **Versão do projeto**: Verificar package.json
- **URL do Supabase**: Verificar .env.production
- **Versão do Plesk**: Verificar no painel
- **Servidor web**: Apache ou Nginx

### Contatos Úteis

- **Suporte Plesk**: Documentação oficial
- **Suporte Supabase**: Discord/GitHub
- **Hospedagem**: Contato do provedor
