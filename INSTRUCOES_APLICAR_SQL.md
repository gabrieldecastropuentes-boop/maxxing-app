# 🗄️ Como Aplicar o SQL no Supabase

## 📋 Passo a Passo

### 1. Acessar SQL Editor do Supabase

👉 **Link direto:** https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/sql/new

Ou:
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Vá em **SQL Editor** no menu lateral
- Clique em **"New query"**

### 2. Copiar e Colar o SQL

1. Abra o arquivo: `sql/tracking_tables.sql`
2. Copie **todo o conteúdo**
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** ou pressione `Cmd/Ctrl + Enter`

### 3. Verificar se Funcionou

Execute estas queries para verificar:

```sql
-- Verificar tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'tracking_lmx%';

-- Verificar estrutura
SELECT * FROM tracking_lmx_sessions LIMIT 1;
SELECT * FROM tracking_lmx_events LIMIT 1;
SELECT * FROM tracking_lmx_purchases LIMIT 1;
```

### 4. Verificar Índices

```sql
-- Ver índices criados
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename LIKE 'tracking_lmx%';
```

---

## ✅ Resultado Esperado

Após executar o SQL, você deve ter:

- ✅ 3 tabelas criadas
- ✅ Índices criados
- ✅ Trigger criado (atualiza last_seen_at automaticamente)

---

## 🆘 Troubleshooting

### Erro: "relation already exists"
**Solução:** As tabelas já existem. Você pode:
- Dropar e recriar (cuidado: perde dados!)
- Ou usar `CREATE TABLE IF NOT EXISTS` (já está no SQL)

### Erro: "permission denied"
**Solução:** Certifique-se de estar usando a conta admin do Supabase

---

**Status:** ✅ SQL pronto para executar

