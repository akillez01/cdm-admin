# 🎯 PREENCHIMENTO DA POLÍTICA - Página Atual

## ✅ **POLÍTICA 1: LEITURA DE AVATARS**

Na página que você está vendo, preencha:

### **Policy name:**

```
Anyone can view avatars
```

### **Allowed operation:**

- Marque apenas: ✅ **SELECT**
- Deixe os outros desmarcados

### **Target roles:**

- Deixe **vazio** (aplicará para todos/público)

### **Policy definition (SQL):**

```sql
bucket_id = 'avatars'
```

### **Clique: Save policy**

---

## ✅ **POLÍTICA 2: UPLOAD DE AVATARS**

Após salvar a primeira, crie nova política:

### **Policy name:**

```
Authenticated users can upload avatars
```

### **Allowed operation:**

- Marque apenas: ✅ **INSERT**
- Deixe os outros desmarcados

### **Target roles:**

- Deixe **vazio**

### **Policy definition (SQL):**

```sql
bucket_id = 'avatars' AND auth.role() = 'authenticated'
```

### **Clique: Save policy**

---

## 🚀 **TESTE APÓS CRIAR AS 2 POLÍTICAS**

1. ✅ Recarregue o CDM Admin
2. ✅ Vá para perfil do admin (dropdown)
3. ✅ Teste upload de avatar
4. ✅ Deve aparecer: "Imagem enviada com sucesso!"

---

**🎯 Comece com a POLÍTICA 1 (SELECT) usando os valores acima!**
