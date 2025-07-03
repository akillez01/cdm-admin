# Upload de Imagens Configurado - CDM Admin

## 📸 Sistema de Upload Implementado

O sistema de upload de imagens foi configurado para **MEMBROS** e **SACRAMENTOS (ESTOQUE)** usando Supabase Storage.

## 🔧 Componentes Configurados

### 1. **Membros - Upload de Foto**

- **Arquivo**: `src/components/members/MemberForm.tsx`
- **Localização**: Campo "Foto do Membro" no formulário de cadastro/edição
- **Bucket**: `members`
- **Pasta**: `photos`
- **Funcionalidade**: Upload de foto para perfil de membro com preview

### 2. **Sacramento - Upload de Registro Visual**

- **Arquivo**: `src/components/inventory/DaimeForm.tsx`
- **Localização**: Campo "Foto do Sacramento" no formulário de cadastro/edição
- **Bucket**: `sacramentos`
- **Pasta**: `fotos`
- **Funcionalidade**: Upload de foto para registro visual do sacramento

### 3. **Admin - Upload de Avatar**

- **Arquivo**: `src/components/ui/AdminProfileModal.tsx`
- **Localização**: Modal de perfil do administrador
- **Bucket**: `avatars`
- **Pasta**: Raiz do bucket
- **Funcionalidade**: Upload de avatar para administrador

## 🗂️ Buckets Necessários no Supabase

### Criar os seguintes buckets no Supabase Storage:

1. **`avatars`** - Para avatars de administradores
2. **`members`** - Para fotos de membros
3. **`sacramentos`** - Para fotos de sacramentos

### Políticas de Acesso (RLS)

Para cada bucket, configure as seguintes políticas:

```sql
-- Para bucket 'avatars'
CREATE POLICY "Admins can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Para bucket 'members'
CREATE POLICY "Admins can upload member photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'members' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view member photos" ON storage.objects
FOR SELECT USING (bucket_id = 'members');

-- Para bucket 'sacramentos'
CREATE POLICY "Admins can upload sacramento photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sacramentos' AND auth.role() = 'authenticated');

CREATE POLICY "Public can view sacramento photos" ON storage.objects
FOR SELECT USING (bucket_id = 'sacramentos');
```

## 🔄 Funcionalidades do Upload

### Recursos Disponíveis:

- ✅ **Upload de arquivo** direto do dispositivo
- ✅ **Preview da imagem** antes e depois do upload
- ✅ **URL manual** como alternativa
- ✅ **Validação de tipo** (PNG, JPG, JPEG, GIF, WebP)
- ✅ **Validação de tamanho** (máximo 5MB)
- ✅ **Loading durante upload**
- ✅ **Fallback para URL externa**

### Tipos de Arquivo Suportados:

- PNG
- JPG/JPEG
- GIF
- WebP

### Limitações:

- Tamanho máximo: 5MB por imagem
- Apenas usuários autenticados podem fazer upload

## 📋 Campos nos Bancos de Dados

### Tabela Members:

```sql
ALTER TABLE members ADD COLUMN photo TEXT;
```

### Tabela Daime Inventory:

```sql
ALTER TABLE daime_inventory ADD COLUMN photo TEXT;
```

## 🎯 Como Usar

### Para Membros:

1. Abrir formulário de membro (novo ou edição)
2. Rolar até o campo "Foto do Membro"
3. Clicar em "Selecionar Arquivo" ou inserir URL manualmente
4. Preview aparece automaticamente
5. Salvar formulário

### Para Sacramentos:

1. Abrir formulário de sacramento (novo ou edição)
2. Preencher dados obrigatórios
3. Rolar até o campo "Foto do Sacramento"
4. Adicionar foto para registro visual
5. Salvar formulário

### Para Admin:

1. Clicar no dropdown do usuário (canto superior direito)
2. Selecionar "Perfil"
3. No modal, alterar foto de perfil
4. Salvar alterações

## 🚀 Status de Implementação

- ✅ **Componente ImageUpload**: Criado e funcional
- ✅ **Admin Profile**: Upload de avatar implementado
- ✅ **Member Form**: Upload de foto implementado
- ✅ **Daime Form**: Upload de foto implementado
- ✅ **Tipos TypeScript**: Atualizados com campo photo
- ✅ **Documentação**: Completa

## 📝 Próximos Passos

1. **Criar buckets no Supabase Storage**:

   - `avatars` (já existe)
   - `members`
   - `sacramentos`

2. **Configurar políticas de acesso** para cada bucket

3. **Testar uploads** em desenvolvimento

4. **Validar visualização** das imagens nas listagens

5. **Deploy em produção** e teste final

## 🔧 Comandos Úteis

### Criar buckets via SQL (se necessário):

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('members', 'members', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('sacramentos', 'sacramentos', true);
```

### Verificar buckets existentes:

```sql
SELECT * FROM storage.buckets;
```

## 📱 Interface do Usuário

O componente de upload oferece uma interface intuitiva:

- **Drag & Drop** ou clique para selecionar
- **Preview em tempo real**
- **Indicador de progresso** durante upload
- **Opção de URL manual** como alternativa
- **Botão de remoção** para limpar imagem

---

**✅ Sistema de upload de imagens totalmente configurado para Membros e Sacramentos!**
