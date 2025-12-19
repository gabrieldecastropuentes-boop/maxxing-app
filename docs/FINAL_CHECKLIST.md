# ✅ Checklist Final - GO LIVE

## 📊 Status do Sistema de Tracking

### ✅ O que já está implementado e funcionando:

1. **Tracking de Eventos (`/api/track`)**
   - ✅ Recebe eventos do browser (home_view, quiz_step_view, checkout_click, etc.)
   - ✅ Salva sessões em `tracking_lmx_sessions`
   - ✅ Salva eventos em `tracking_lmx_events`
   - ✅ Captura UTMs, referrer, landing_url (persistência 7 dias no localStorage)
   - ✅ Captura cookies Facebook (_fbp, _fbc)
   - ✅ Gera `event_id` e `session_id` automaticamente
   - ✅ Responde sempre JSON (nunca body vazio)
   - ✅ Validação CORS configurável

2. **Webhook PerfectPay (`/api/webhooks/perfectpay`)**
   - ✅ Validação de secret/token
   - ✅ Idempotência (evita duplicatas)
   - ✅ Salva compras em `tracking_lmx_purchases`
   - ✅ Responde sempre JSON (nunca body vazio)
   - ✅ Logging detalhado

3. **Client-side Tracking (`src/lib/tracking.ts`)**
   - ✅ Função `trackEvent()` centralizada
   - ✅ Persistência de session_id no localStorage
   - ✅ Persistência de UTMs/referrer/landing_url (7 dias)
   - ✅ Captura automática de cookies Facebook
   - ✅ Geração automática de `event_id` (UUID)
   - ✅ Integrado em todos os componentes (Home, Quiz, VSL, Checkout)

4. **Banco de Dados (Supabase)**
   - ✅ Tabelas criadas: `tracking_lmx_sessions`, `tracking_lmx_events`, `tracking_lmx_purchases`
   - ✅ Índices otimizados
   - ✅ RLS habilitado (anon/authenticated revogados, service_role bypassa)
   - ✅ Views SQL para dashboard (`v_funnel_7d_by_campaign`, `v_dropoff_by_step_7d`, `v_sessions_7d`)

5. **Endpoints de Health**
   - ✅ `GET /api/health/tracking` - Verifica status das env vars (sem expor secrets)

---

## 🔑 Variáveis de Ambiente Necessárias

### Tabela de Configuração

| ENV_NAME | Onde obter | Onde configurar | Obrigatório? | Status atual |
|----------|------------|-----------------|--------------|--------------|
| **SUPABASE_URL** | Painel Supabase → Settings → API → Project URL | Vercel Dashboard → Settings → Environment Variables | ✅ **SIM** | ⚠️ Verificar |
| **SUPABASE_SERVICE_ROLE_KEY** | Painel Supabase → Settings → API → service_role (secret) | Vercel Dashboard → Settings → Environment Variables | ✅ **SIM** | ⚠️ Verificar |
| **PUBLIC_SUPABASE_URL** | Mesmo que SUPABASE_URL | Vercel Dashboard → Settings → Environment Variables | ⚠️ Opcional (só se usar client-side Supabase) | ⚠️ Verificar |
| **PUBLIC_SUPABASE_ANON_KEY** | Painel Supabase → Settings → API → anon (public) | Vercel Dashboard → Settings → Environment Variables | ⚠️ Opcional (só se usar client-side Supabase) | ⚠️ Verificar |
| **PERFECTPAY_WEBHOOK_SECRET** | Painel PerfectPay → Webhooks → Secret/Token | Vercel Dashboard → Settings → Environment Variables | ⚠️ Opcional (só se configurar webhook) | ⚠️ Verificar |
| **PERFECTPAY_WEBHOOK_TOKEN** | Mesmo que PERFECTPAY_WEBHOOK_SECRET (fallback) | Vercel Dashboard → Settings → Environment Variables | ⚠️ Opcional (só se configurar webhook) | ⚠️ Verificar |
| **PUBLIC_FB_PIXEL_ID** | Meta Business → Events Manager → Pixel ID | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para Pixel) | ⚠️ Não configurado |
| **FB_PIXEL_ID** | Mesmo que PUBLIC_FB_PIXEL_ID (fallback) | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para Pixel) | ⚠️ Não configurado |
| **META_CAPI_ACCESS_TOKEN** | Meta Business → Events Manager → Settings → Conversions API → Access Token | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para CAPI) | ⚠️ Não configurado |
| **FB_ACCESS_TOKEN** | Mesmo que META_CAPI_ACCESS_TOKEN (fallback) | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para CAPI) | ⚠️ Não configurado |
| **PUBLIC_GA_ID** | Google Analytics 4 → Admin → Data Streams → Measurement ID | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para GA4) | ⚠️ Não configurado |
| **PUBLIC_SITE_URL** | Seu domínio (ex: https://glowmax.app) | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para SEO/OG) | ⚠️ Verificar |
| **ALLOWED_ORIGINS** | Lista de origens permitidas (ex: https://glowmax.app,https://www.glowmax.app) | Vercel Dashboard → Settings → Environment Variables | ❌ Não (opcional - para CORS restrito) | ⚠️ Verificar |

---

## 📋 Checklist GO LIVE (Ordem de Prioridade)

### 🔴 Prioridade 1 - CRÍTICO (Obrigatório para funcionar)

- [ ] **1.1** Configurar `SUPABASE_URL` no Vercel
  - Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
  - Adicione: `SUPABASE_URL` = `https://<seu-project-ref>.supabase.co`
  - Onde obter: Painel Supabase → Settings → API → Project URL

- [ ] **1.2** Configurar `SUPABASE_SERVICE_ROLE_KEY` no Vercel
  - Acesse: Vercel Dashboard → Seu Projeto → Settings → Environment Variables
  - Adicione: `SUPABASE_SERVICE_ROLE_KEY` = `<service_role_secret>`
  - ⚠️ **ATENÇÃO**: Este é um secret! Não compartilhe publicamente.
  - Onde obter: Painel Supabase → Settings → API → service_role (secret)

- [ ] **1.3** Aplicar migrations SQL no Supabase
  - Acesse: Painel Supabase → SQL Editor
  - Execute: `sql/tracking_tables_PURO.sql` (se ainda não aplicado)
  - Execute: `supabase/migrations/20251215_enable_rls_tracking.sql`
  - Execute: `supabase/migrations/20251215_fix_purchases_table.sql`

- [ ] **1.4** Testar endpoint `/api/track` em produção
  - Acesse: `https://seu-dominio.com/api/health/tracking`
  - Verifique: `status: "ready"` e `required.configured: 2`
  - Teste: Envie um evento via browser console:
    ```javascript
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'test_event',
        event_id: 'test_' + Date.now(),
        session_id: 'test_session_' + Date.now(),
        page: window.location.href
      })
    }).then(r => r.json()).then(console.log);
    ```
  - Verifique no Supabase: Evento deve aparecer em `tracking_lmx_events`

---

### 🟡 Prioridade 2 - IMPORTANTE (Recomendado)

- [ ] **2.1** Configurar `PERFECTPAY_WEBHOOK_SECRET` (se usar webhook)
  - Acesse: Painel PerfectPay → Webhooks → Configurar
  - Obtenha o secret/token fornecido pela PerfectPay
  - Configure no Vercel: `PERFECTPAY_WEBHOOK_SECRET` = `<secret>`
  - Configure a URL do webhook na PerfectPay: `https://seu-dominio.com/api/webhooks/perfectpay`

- [ ] **2.2** Testar webhook PerfectPay
  - Use o modo test: `https://seu-dominio.com/api/webhooks/perfectpay?test=1` (só funciona em dev)
  - Ou envie um payload de teste via curl:
    ```bash
    curl -X POST https://seu-dominio.com/api/webhooks/perfectpay \
      -H "Content-Type: application/json" \
      -H "x-webhook-secret: SEU_SECRET" \
      -d '{"code":"TEST123","sale_status":"approved","sale_amount":99.90,"currency":"BRL"}'
    ```
  - Verifique no Supabase: Compra deve aparecer em `tracking_lmx_purchases`

- [ ] **2.3** Configurar `PUBLIC_SITE_URL` (para SEO/OG tags)
  - Configure no Vercel: `PUBLIC_SITE_URL` = `https://seu-dominio.com`

- [ ] **2.4** Configurar `ALLOWED_ORIGINS` (para CORS restrito)
  - Configure no Vercel: `ALLOWED_ORIGINS` = `https://seu-dominio.com,https://www.seu-dominio.com`
  - ⚠️ Se não configurar, aceita qualquer origem em dev (não recomendado em produção)

---

### 🟢 Prioridade 3 - OPCIONAL (Melhorias futuras)

- [ ] **3.1** Configurar Facebook Pixel (`PUBLIC_FB_PIXEL_ID`)
  - Acesse: Meta Business → Events Manager → Criar Pixel
  - Obtenha o Pixel ID
  - Configure no Vercel: `PUBLIC_FB_PIXEL_ID` = `<pixel_id>`
  - ⚠️ Após configurar, descomente o código CAPI em `/api/track.ts` (linha ~303)

- [ ] **3.2** Configurar Meta CAPI (`META_CAPI_ACCESS_TOKEN`)
  - Acesse: Meta Business → Events Manager → Settings → Conversions API
  - Gere um Access Token
  - Configure no Vercel: `META_CAPI_ACCESS_TOKEN` = `<access_token>`
  - ⚠️ Após configurar, descomente o código CAPI em `/api/track.ts` (linha ~303)

- [ ] **3.3** Configurar Google Analytics 4 (`PUBLIC_GA_ID`)
  - Acesse: Google Analytics 4 → Admin → Data Streams
  - Obtenha o Measurement ID (formato: `G-XXXXXXXXXX`)
  - Configure no Vercel: `PUBLIC_GA_ID` = `G-XXXXXXXXXX`

---

## 🧪 Testes Finais

### Teste 1: Health Check
```bash
curl https://seu-dominio.com/api/health/tracking
```
**Esperado:**
```json
{
  "ok": true,
  "status": "ready",
  "summary": {
    "required": { "total": 2, "configured": 2 },
    "optional": { "total": 5, "configured": 0 }
  },
  "checks": { ... }
}
```

### Teste 2: Tracking de Evento
```bash
curl -X POST https://seu-dominio.com/api/track \
  -H "Content-Type: application/json" \
  -H "Origin: https://seu-dominio.com" \
  -d '{
    "event_name": "test_event",
    "event_id": "test_123",
    "session_id": "test_session_123",
    "page": "https://seu-dominio.com/test"
  }'
```
**Esperado:**
```json
{
  "ok": true,
  "event_id": "test_123",
  "event_name": "test_event"
}
```

### Teste 3: Webhook PerfectPay
```bash
curl -X POST https://seu-dominio.com/api/webhooks/perfectpay \
  -H "Content-Type: application/json" \
  -H "x-webhook-secret: SEU_SECRET" \
  -d '{
    "code": "TEST123",
    "sale_status": "approved",
    "sale_amount": 99.90,
    "currency": "BRL"
  }'
```
**Esperado:**
```json
{
  "ok": true,
  "id": "<uuid>",
  "order_id": "TEST123"
}
```

---

## 📝 Notas Importantes

1. **Nunca commite secrets no Git**
   - Use apenas variáveis de ambiente no Vercel
   - O arquivo `env.example` contém apenas placeholders

2. **RLS (Row Level Security)**
   - As tabelas de tracking têm RLS habilitado
   - `anon` e `authenticated` não têm acesso
   - Apenas `service_role` (usado pelo backend) pode inserir

3. **Idempotência**
   - Eventos são deduplicados por `event_id`
   - Compras são deduplicadas por `provider_event_id` ou `order_id`

4. **CORS**
   - Se `ALLOWED_ORIGINS` não estiver configurado, aceita qualquer origem em dev
   - Em produção, configure para restringir a seu domínio

5. **Facebook CAPI**
   - O código está preparado mas comentado (linha ~303 em `/api/track.ts`)
   - Descomente após configurar `META_CAPI_ACCESS_TOKEN`

---

## 🚀 Próximos Passos Após GO LIVE

1. Monitorar logs no Vercel Dashboard → Functions
2. Verificar eventos no Supabase: `SELECT * FROM tracking_lmx_events ORDER BY created_at DESC LIMIT 10;`
3. Configurar alertas no Supabase para erros de inserção
4. Configurar dashboard no Supabase usando as views SQL (`v_funnel_7d_by_campaign`, etc.)
5. Integrar Meta Pixel/CAPI quando tiver credenciais

---

**Última atualização:** 2025-01-15

