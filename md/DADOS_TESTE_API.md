# 🧪 DADOS DE TESTE - CDM Admin API

## 📝 EXEMPLOS DE PAYLOADS PARA TESTES

### 🔐 LOGIN DE TESTE

```json
{
  "email": "admin@cdm.com",
  "password": "admin123"
}
```

---

## 📦 INVENTÁRIO GERAL - EXEMPLOS

### Itens Básicos para Cerimônias:

```json
{
  "name": "Velas Brancas",
  "description": "Velas para iluminação das cerimônias",
  "category": "Ritual",
  "quantity": 100,
  "unit": "unidades",
  "minimum_stock": 20,
  "location": "Armazém Principal",
  "notes": "Verificar qualidade antes do uso",
  "supplier": "Casa das Velas",
  "purchase_date": "2025-01-15",
  "cost": 2.5
}
```

```json
{
  "name": "Água Mineral",
  "description": "Água para consumo durante as cerimônias",
  "category": "Consumível",
  "quantity": 50,
  "unit": "garrafas",
  "minimum_stock": 10,
  "location": "Despensa",
  "notes": "Manter refrigerada",
  "supplier": "Distribuidora Águas Puras",
  "purchase_date": "2025-06-20",
  "expiry_date": "2025-12-20",
  "cost": 1.5
}
```

```json
{
  "name": "Incenso Sândalo",
  "description": "Incenso natural para purificação",
  "category": "Ritual",
  "quantity": 25,
  "unit": "caixas",
  "minimum_stock": 5,
  "location": "Sala de Preparação",
  "notes": "Uso apenas em cerimônias especiais",
  "supplier": "Essências Naturais Ltda",
  "purchase_date": "2025-05-10",
  "cost": 8.0
}
```

```json
{
  "name": "Flores Naturais",
  "description": "Flores para decoração do altar",
  "category": "Decoração",
  "quantity": 20,
  "unit": "buquês",
  "minimum_stock": 3,
  "location": "Geladeira",
  "notes": "Renovar semanalmente",
  "supplier": "Floricultura Jardim",
  "purchase_date": "2025-06-25",
  "expiry_date": "2025-07-02",
  "cost": 15.0
}
```

---

## 🌿 INVENTÁRIO DO DAIME - EXEMPLOS

### Exemplo Completo:

```json
{
  "codigo": "CDM-2025-001",
  "graduacao": "Força 3",
  "litros": 15.5,
  "dataFeitio": "2025-01-15",
  "responsavelFeitio": "Mestre João",
  "localFeitio": "Casa de Feitio Principal",
  "tipoFeitio": "Novo",
  "panela": "Panela Grande",
  "observacoes": "Feitio realizado durante lua cheia com concentração especial",
  "status": "disponivel",
  "dataValidade": "2025-07-15",
  "localArmazenamento": "Despensa Sagrada - Prateleira A1",
  "temperatura": 18.0,
  "ph": 4.3,
  "cor": "Amarelo Dourado",
  "consistencia": "Líquida"
}
```

### Exemplo Força 1 (Principiantes):

```json
{
  "codigo": "CDM-2025-002",
  "graduacao": "Força 1",
  "litros": 20.0,
  "dataFeitio": "2025-02-10",
  "responsavelFeitio": "Padrinho Carlos",
  "localFeitio": "Casa de Feitio Principal",
  "tipoFeitio": "Novo",
  "panela": "Panela Média",
  "observacoes": "Feitio especial para novos irmãos",
  "status": "disponivel",
  "dataValidade": "2025-08-10",
  "localArmazenamento": "Despensa Sagrada - Prateleira B1",
  "temperatura": 17.5,
  "ph": 4.5,
  "cor": "Amarelo Claro",
  "consistencia": "Líquida"
}
```

### Exemplo Força 5 (Concentrado):

```json
{
  "codigo": "CDM-2025-003",
  "graduacao": "Força 5",
  "litros": 8.0,
  "dataFeitio": "2025-03-21",
  "responsavelFeitio": "Mestre Antonio",
  "localFeitio": "Casa de Feitio Especial",
  "tipoFeitio": "Concentrado",
  "panela": "Panela Pequena",
  "observacoes": "Feitio para cerimônias de cura. Uso restrito.",
  "status": "disponivel",
  "dataValidade": "2025-09-21",
  "localArmazenamento": "Cofre Sagrado",
  "temperatura": 16.0,
  "ph": 3.8,
  "cor": "Marrom Escuro",
  "consistencia": "Concentrada"
}
```

### Exemplo Item Consumido:

```json
{
  "codigo": "CDM-2024-050",
  "graduacao": "Força 2",
  "litros": 0.0,
  "dataFeitio": "2024-12-01",
  "responsavelFeitio": "Padrinho José",
  "localFeitio": "Casa de Feitio Principal",
  "tipoFeitio": "Novo",
  "panela": "Panela Grande",
  "observacoes": "Completamente utilizado nas cerimônias de junho/2025",
  "status": "consumido",
  "dataValidade": "2025-06-01",
  "localArmazenamento": "N/A",
  "temperatura": null,
  "ph": null,
  "cor": "Amarelo",
  "consistencia": "Líquida"
}
```

---

## 🔄 EXEMPLOS DE ATUALIZAÇÃO

### Atualizar Quantidade no Inventário Geral:

```json
{
  "quantity": 75,
  "notes": "Quantidade reduzida após cerimônia do dia 25/06/2025"
}
```

### Atualizar Status do Daime:

```json
{
  "litros": 12.0,
  "status": "disponivel",
  "observacoes": "Ainda disponível após cerimônia. Litros atualizados."
}
```

### Marcar Daime como Consumido:

```json
{
  "litros": 0.0,
  "status": "consumido",
  "observacoes": "Totalmente utilizado na cerimônia de cura de 26/06/2025"
}
```

---

## 🎯 CENÁRIOS DE TESTE RECOMENDADOS

### 1. Fluxo Completo - Inventário Geral:

1. **LOGIN** → Obter token
2. **POST /inventory** → Criar vela
3. **GET /inventory** → Listar e pegar ID
4. **PUT /inventory/{id}** → Reduzir quantidade
5. **DELETE /inventory/{id}** → Remover item

### 2. Fluxo Completo - Daime:

1. **LOGIN** → Obter token
2. **POST /daime-inventory** → Criar novo feitio
3. **GET /daime-inventory** → Listar todos
4. **GET /daime-inventory?status=disponivel** → Filtrar disponíveis
5. **PUT /daime-inventory/{id}** → Marcar como consumido
6. **DELETE /daime-inventory/{id}** → Remover registro

### 3. Teste de Validações:

1. **POST /inventory** → Sem campos obrigatórios (deve dar erro 400)
2. **POST /daime-inventory** → Com graduação inválida (deve dar erro 400)
3. **PUT /inventory/99999** → ID inexistente (deve dar erro 404)

### 4. Teste de Autenticação:

1. **GET /inventory** → Sem token (deve dar erro 401)
2. **POST /inventory** → Token inválido (deve dar erro 403)
3. **DELETE /inventory/1** → Usuário sem permissão admin (deve dar erro 403)

---

## 📊 VALORES PARA TESTE

### Graduações Válidas:

- "Força 1"
- "Força 2"
- "Força 3"
- "Força 4"
- "Força 5"

### Status Válidos (Daime):

- "disponivel"
- "consumido"
- "vencido"

### Status Válidos (Inventário Geral):

- "available"
- "low"
- "depleted"

### Categorias Sugeridas (Inventário Geral):

- "Ritual"
- "Consumível"
- "Decoração"
- "Limpeza"
- "Manutenção"
- "Escritório"

---

**🎯 Com esses dados você pode testar todos os cenários da API!**

_Criado em: 27 de junho de 2025_
