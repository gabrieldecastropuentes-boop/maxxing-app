# Comandos de Teste - PerfectPay Webhook

## ⚠️ Pré-requisitos

1. Configure `PERFECTPAY_WEBHOOK_SECRET` no Vercel Dashboard
2. Configure `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` no Vercel Dashboard
3. Aplique a migration SQL: `supabase/migrations/20251215_tracking_purchases_offer_fields.sql`

---

## 🧪 Teste 1: Evento Novo (deve gravar)

Este comando deve retornar `200 OK` com `duplicate: false` e criar um novo registro no banco.

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{
    "code": "TEST_NEW_'$(date +%s)'",
    "sale_status": "approved",
    "sale_amount": 99.90,
    "currency": "BRL",
    "product_code": "PPPBDPJI",
    "affiliate_code": "PPA23VRV",
    "session_id": "sess_test_123",
    "event_type": "sale_approved"
  }'
```

**Resposta esperada:**
```json
{
  "ok": true,
  "id": "uuid-do-registro",
  "order_id": "TEST_NEW_...",
  "offer_type": "MAIN",
  "is_bump": false
}
```

---

## 🔁 Teste 2: Evento Repetido (deve retornar duplicate=true)

Use o mesmo `code` do Teste 1. Este comando deve retornar `200 OK` com `duplicate: true` e **não** criar um novo registro.

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{
    "code": "TEST_NEW_<USE_O_MESMO_CODE_DO_TESTE_1>",
    "sale_status": "approved",
    "sale_amount": 99.90,
    "currency": "BRL",
    "product_code": "PPPBDPJI",
    "affiliate_code": "PPA23VRV",
    "session_id": "sess_test_123",
    "event_type": "sale_approved"
  }'
```

**Resposta esperada:**
```json
{
  "ok": true,
  "duplicate": true,
  "id": "uuid-do-registro-original",
  "order_id": "TEST_NEW_..."
}
```

---

## 🧪 Teste 3: Modo de Teste (apenas em dev local)

**⚠️ Só funciona em ambiente de desenvolvimento (`npm run dev`)**

```bash
curl -X POST "http://localhost:4321/api/webhooks/perfectpay?test=1" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{}'
```

Este comando usa um payload mock automático quando o body está vazio.

---

## 📦 Teste 4: BUMP (oferta adicional)

Teste com um produto BUMP para verificar o mapeamento:

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{
    "code": "BUMP_TEST_'$(date +%s)'",
    "sale_status": "approved",
    "sale_amount": 49.90,
    "currency": "BRL",
    "product_code": "PPPBDPJF",
    "affiliate_code": "PPA23VRR",
    "session_id": "sess_test_456",
    "event_type": "sale_approved"
  }'
```

**Resposta esperada:**
```json
{
  "ok": true,
  "id": "uuid-do-registro",
  "order_id": "BUMP_TEST_...",
  "offer_type": "BUMP_1",
  "is_bump": true
}
```

---

## 🔍 Teste 5: Product Code em Estrutura Aninhada

Teste com `product_code` dentro de `items` (parsing recursivo):

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{
    "code": "NESTED_TEST_'$(date +%s)'",
    "sale_status": "approved",
    "sale_amount": 99.90,
    "currency": "BRL",
    "items": [
      {
        "product_code": "PPPBDPJI",
        "quantity": 1,
        "price": 99.90
      }
    ],
    "session_id": "sess_test_789",
    "event_type": "sale_approved"
  }'
```

**Resposta esperada:** Mesma do Teste 1 (product_code encontrado recursivamente)

---

## ❌ Teste 6: Erro - Secret Inválido

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SECRET_INVALIDO" \
  -d '{
    "code": "ERROR_TEST",
    "sale_status": "approved"
  }'
```

**Resposta esperada:**
```json
{
  "ok": false,
  "error": "unauthorized"
}
```
**Status:** `401 Unauthorized`

---

## ❌ Teste 7: Erro - Secret Ausente

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ERROR_TEST",
    "sale_status": "approved"
  }'
```

**Resposta esperada:**
```json
{
  "ok": false,
  "error": "unauthorized"
}
```
**Status:** `401 Unauthorized` (ou `500` se `PERFECTPAY_WEBHOOK_SECRET` não estiver configurado)

---

## ❌ Teste 8: Erro - Order ID Ausente

```bash
curl -X POST "https://seu-dominio.com/api/webhooks/perfectpay" \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET_AQUI" \
  -d '{
    "sale_status": "approved",
    "sale_amount": 99.90
  }'
```

**Resposta esperada:**
```json
{
  "ok": false,
  "error": "missing order_id",
  "details": {
    "payload_keys": ["sale_status", "sale_amount", ...]
  }
}
```
**Status:** `400 Bad Request`

---

## 📊 Verificar Registros no Supabase

Após executar os testes, verifique os registros no Supabase:

```sql
SELECT 
  id,
  order_id,
  provider_event_id,
  product_code,
  offer_type,
  is_bump,
  bump_index,
  affiliate_code,
  status,
  amount,
  currency,
  session_id,
  created_at
FROM public.tracking_lmx_purchases
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔐 Headers Alternativos Suportados

O webhook aceita secret em qualquer um destes headers:

1. `x-webhook-secret: <secret>`
2. `x-perfectpay-secret: <secret>`
3. `Authorization: Bearer <secret>`
4. `Authorization: <secret>` (sem Bearer prefix)

Todos são equivalentes e igualmente seguros.
