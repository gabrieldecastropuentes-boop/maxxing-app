# 🗄️ Migrations - Tabelas de Tracking

## 📋 Tabelas Criadas

### 1. `tracking_lmx_sessions`
Armazena sessões de tracking com chave de ligação.

### 2. `tracking_lmx_events`
Armazena eventos de tracking com `event_id` para dedup Meta.

### 3. `tracking_lmx_purchases`
Armazena compras vinculadas a sessões.

---

## 🚀 Como Aplicar as Migrations

### Opção 1: Migrate (Recomendado para Produção)

```bash
# Gerar migration
npx prisma migrate dev --name add_tracking_tables

# Aplicar em produção
npx prisma migrate deploy
```

### Opção 2: Push (Desenvolvimento)

```bash
# Push direto (cria tabelas sem migration)
npx prisma db push
```

### Opção 3: Via Supabase Dashboard

1. Acesse: https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/sql/new
2. Execute o SQL gerado pelo Prisma:

```bash
# Gerar SQL
npx prisma migrate dev --create-only --name add_tracking_tables

# Copiar o SQL do arquivo gerado em prisma/migrations/
```

---

## ✅ Verificar se Funcionou

```bash
# Abrir Prisma Studio
npx prisma studio

# Ou verificar via SQL
# No Supabase SQL Editor:
SELECT * FROM tracking_lmx_sessions LIMIT 10;
SELECT * FROM tracking_lmx_events LIMIT 10;
SELECT * FROM tracking_lmx_purchases LIMIT 10;
```

---

## 🔗 Relacionamentos

- `TrackingSession` → `TrackingEvent[]` (1:N)
- `TrackingSession` → `TrackingPurchase[]` (1:N)
- `TrackingEvent` → `TrackingSession` (N:1)
- `TrackingPurchase` → `TrackingSession` (N:1, opcional)

---

**Status:** ✅ Schema criado - Aguardando aplicar migrations

