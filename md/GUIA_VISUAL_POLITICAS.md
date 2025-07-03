# 🎯 GUIA VISUAL - Criar Políticas no Supabase

## 📋 **POLÍTICA 1: LEITURA DE AVATARS**

Na página de **New Policy** que abri:

1. **Policy name**: `Anyone can view avatars`
2. **Allowed operation**: Marque `SELECT`
3. **Target**: Selecione `objects`
4. **USING expression**: Cole: `bucket_id = 'avatars'`
5. **WITH CHECK expression**: Deixe vazio
6. Clique **Save policy**

## 📋 **POLÍTICA 2: UPLOAD DE AVATARS**

Clique **New Policy** novamente:

1. **Policy name**: `Authenticated users can upload avatars`
2. **Allowed operation**: Marque `INSERT`
3. **Target**: Selecione `objects`
4. **WITH CHECK expression**: Cole: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`
5. **USING expression**: Deixe vazio
6. Clique **Save policy**

## ✅ **TESTE IMEDIATO**

Após criar essas 2 políticas:

1. ✅ **Recarregue** o CDM Admin
2. ✅ **Vá para perfil** do admin (dropdown)
3. ✅ **Tente upload** de avatar
4. ✅ **Deve aparecer**: "Imagem enviada com sucesso!"

## 🔄 **SE AINDA DER ERRO**

Crie também política para **UPDATE**:

1. **Policy name**: `Authenticated users can update avatars`
2. **Allowed operation**: Marque `UPDATE`
3. **Target**: Selecione `objects`
4. **USING expression**: Cole: `bucket_id = 'avatars' AND auth.role() = 'authenticated'`

## 📱 **RESUMO DAS EXPRESSÕES**

**Para copiar/colar:**

**SELECT (leitura):**

```
bucket_id = 'avatars'
```

**INSERT (upload):**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

**UPDATE (atualização):**

```
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

---

**🚀 Crie as 2 primeiras políticas e teste o upload de avatar!**
