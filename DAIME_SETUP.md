# Configuração do Inventário do Sacramento do Daime

## Passo 1: Aplicar a migração no banco de dados

### Opção A: Via Supabase Dashboard (Recomendado)

1. Acesse o dashboard do seu projeto Supabase
2. Vá para **SQL Editor**
3. Copie todo o conteúdo do arquivo `supabase/setup_daime_table.sql`
4. Cole no editor SQL e clique em **Run**

### Opção B: Via CLI do Supabase

Se você tem o Supabase CLI instalado:

```bash
supabase db push
```

## Passo 2: Verificar a tabela criada

Após executar a migração, você deve ver:

- Uma nova tabela `daime_inventory` com todos os campos necessários
- Índices para otimização de consultas
- Políticas de segurança RLS configuradas
- Dados de exemplo inseridos

## Passo 3: Configurar autenticação (se necessário)

Para que as políticas de admin funcionem, certifique-se de que seus usuários tenham o campo `role` configurado no JWT token do Supabase.

## Estrutura da Tabela

A tabela `daime_inventory` contém os seguintes campos:

- `id`: UUID único (gerado automaticamente)
- `codigo`: Código único do sacramento (ex: DM001)
- `graduacao`: Força do sacramento (Força 1 a 5)
- `litros`: Quantidade em litros
- `data_feitio`: Data do feitio
- `responsavel_feitio`: Nome do responsável
- `local_feitio`: Local onde foi feito
- `tipo_feitio`: Tipo (Novo, Concentração, Reforço)
- `panela`: Identificação da panela
- `observacoes`: Observações adicionais
- `status`: Status (disponivel, reservado, consumido, vencido)
- `data_validade`: Data de validade (opcional)
- `local_armazenamento`: Local de armazenamento
- `temperatura`: Temperatura de armazenamento
- `ph`: pH do sacramento
- `cor`: Cor (Amarelo, Marrom Claro, Marrom, Marrom Escuro, Roxo)
- `consistencia`: Consistência (Líquida, Densa, Muito Densa)
- `created_at` e `updated_at`: Timestamps automáticos

## Funcionalidades Implementadas

✅ **CRUD Completo**: Criar, ler, editar e excluir registros de sacramento  
✅ **Validações**: Campos obrigatórios e valores permitidos  
✅ **Segurança**: Políticas RLS para controle de acesso  
✅ **Interface**: Modal completo para cadastro e edição  
✅ **Visualização**: Tabela com filtros e ações  
✅ **Métricas**: Cards com estatísticas do inventário

## Próximos Passos

- [ ] Implementar filtros avançados na tabela
- [ ] Adicionar funcionalidade de exportação
- [ ] Implementar sistema de notificações para validade
- [ ] Adicionar histórico de alterações
- [ ] Implementar backup automático dos dados

## Problemas Conhecidos

Se você encontrar erro de política RLS, verifique se:

1. O usuário está autenticado
2. O campo `role` está configurado no JWT token
3. As políticas foram aplicadas corretamente

Para desenvolvimento, você pode temporariamente desabilitar RLS:

```sql
ALTER TABLE daime_inventory DISABLE ROW LEVEL SECURITY;
```

(Não recomendado para produção!)
