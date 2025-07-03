# 📸 Configuração COMPLETA - Upload de Imagens

## ✅ O QUE FOI IMPLEMENTADO

### 1. **MEMBROS** - Upload de Foto de Perfil

- Formulário de cadastro/edição de membros
- Campo "Foto do Membro" com upload
- Bucket: `members/photos/`

### 2. **SACRAMENTOS** - Upload de Registro Visual

- Formulário de cadastro/edição de sacramento
- Campo "Foto do Sacramento" para registro
- Bucket: `sacramentos/fotos/`

### 3. **ADMIN** - Upload de Avatar (já funcionando)

- Modal de perfil do administrador
- Bucket: `avatars/`

## 🎯 PRÓXIMOS PASSOS OBRIGATÓRIOS

### 1. **Criar Buckets no Supabase** (OBRIGATÓRIO)

Acesse: https://supabase.com/dashboard → Storage → Buckets

**Criar os buckets:**

- `members` (público)
- `sacramentos` (público)

### 2. **Configurar Políticas** (OBRIGATÓRIO)

No painel Storage → Policies, adicionar:

```sql
-- Para bucket 'members'
CREATE POLICY "Authenticated users can upload member photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'members' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view member photos" ON storage.objects
FOR SELECT USING (bucket_id = 'members');

-- Para bucket 'sacramentos'
CREATE POLICY "Authenticated users can upload sacramento photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view sacramento photos" ON storage.objects
FOR SELECT USING (bucket_id = 'sacramentos');
```

### 3. **Adicionar Colunas no Banco** (OBRIGATÓRIO)

Execute no SQL Editor do Supabase:

```sql
-- Adicionar campo photo nas tabelas
ALTER TABLE members ADD COLUMN IF NOT EXISTS photo TEXT;
ALTER TABLE daime_inventory ADD COLUMN IF NOT EXISTS photo TEXT;
```

## 🚀 COMO TESTAR

### Teste 1 - Upload Membro:

1. Ir para "Membros" → "Novo Membro"
2. Preencher dados obrigatórios
3. Rolar até "Foto do Membro"
4. Fazer upload de uma imagem
5. Salvar

### Teste 2 - Upload Sacramento:

1. Ir para "Estoque" → "Registrar Sacramento"
2. Preencher dados obrigatórios
3. Rolar até "Foto do Sacramento"
4. Fazer upload de uma imagem para registro
5. Salvar

### Teste 3 - Upload Admin:

1. Clicar no dropdown do usuário (canto superior direito)
2. "Perfil" → Alterar foto
3. Fazer upload de avatar
4. Salvar

## ⚠️ IMPORTANTE

**SEM os buckets criados, o upload NÃO funcionará!**

Certifique-se de:

- ✅ Buckets `members` e `sacramentos` criados
- ✅ Políticas de acesso configuradas
- ✅ Colunas `photo` adicionadas nas tabelas
- ✅ Teste de upload em cada formulário

## 📁 ESTRUTURA DE PASTAS

```
Supabase Storage:
├── avatars/           (já existe)
├── members/
│   └── photos/        (fotos de membros)
└── sacramentos/
    └── fotos/         (fotos de sacramentos)
```

## 🎯 FUNCIONALIDADES DISPONÍVEIS

- ✅ Upload de arquivo (arrastar ou clicar)
- ✅ Preview da imagem em tempo real
- ✅ URL manual como alternativa
- ✅ Validação de tipo e tamanho
- ✅ Progress indicator durante upload
- ✅ Fallback para URL externa

---

**🎉 Sistema de upload PRONTO para Membros e Sacramentos!**

Execute os passos obrigatórios no Supabase e teste! 🚀
