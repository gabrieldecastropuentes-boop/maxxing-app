# ✅ Implementação Final - Tracking Completo

## 🎉 Status: Implementado Conforme Especificações

---

## 📋 Entregáveis Completos

### A) ✅ SQL para Criar Tabelas

**Arquivo:** `sql/tracking_tables.sql`

**Tabelas criadas:**
1. ✅ `tracking_lmx_sessions` - Sessões com chave de ligação
2. ✅ `tracking_lmx_events` - Eventos com `event_id` para dedup
3. ✅ `tracking_lmx_purchases` - Compras vinculadas

**Índices:** Todos criados automaticamente

**Como aplicar:** Veja `INSTRUCOES_APLICAR_SQL.md`

---

### B) ✅ Implementação Astro (equivalente a Next.js)

#### 1. `src/pages/api/track/route.ts` → `src/pages/api/track.ts`

**Funcionalidades:**
- ✅ Recebe `{ event_name, event_id, session_id, page, step_index?, step_id?, answer_id?, meta? }`
- ✅ Enriquece no server com `ip` e `user_agent` (via headers)
- ✅ Salva no Supabase usando `SERVICE_ROLE_KEY` (somente server-side)
- ✅ Retorna `{ ok: true }`
- ✅ CORS com allowlist por env (`ALLOWED_ORIGINS`)

**Código:** Implementado em `src/pages/api/track.ts`

#### 2. `src/pages/api/webhooks/perfectpay/route.ts` → `src/pages/api/webhooks/perfectpay.ts`

**Funcionalidades:**
- ✅ Recebe payload do webhook PerfectPay
- ✅ Valida usando `x-webhook-secret` header = `PERFECTPAY_WEBHOOK_SECRET`
- ✅ Salva em `tracking_lmx_purchases`:
  - `order_id`, `status`, `total_value`, `currency`, `created_at`, `raw_payload`(json)
- ✅ Se status for "approved", marca `purchase_aprovada=true`
- ✅ Meta CAPI deixado como TODO comentado (pronto para descomentar)

**Código:** Implementado em `src/pages/api/webhooks/perfectpay.ts`

---

### C) ✅ Implementação no Client

#### 1. `src/lib/tracking.ts`

**Funcionalidades:**
- ✅ Gera `session_id` e guarda em localStorage
- ✅ Função `track(eventName, props)`
- ✅ Cria `event_id` único (UUID) para cada evento
- ✅ Coleta:
  - `page_url`, `referrer`, `language`
  - UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`)
  - `fbclid`
  - Cookies `_fbp` e `_fbc` quando existirem
- ✅ Envia via fetch POST para `/api/track`
- ✅ Resiliente (try/catch, não quebra UI)

**Código:** Implementado em `src/lib/tracking.ts`

#### 2. Instrumentação nos Componentes

**Home (`src/components/home/HomePage.tsx`):**
```typescript
useEffect(() => {
  tracking.homeView(); // track("home_view")
}, []);

// No CTA:
tracking.startQuizClick(); // track("start_quiz_click")
```

**Quiz (`src/components/Quiz.tsx` e `QuestionScreen.tsx`):**
```typescript
// A cada step mostrado:
tracking.quizStepView(stepIndex, stepId); 
// track("quiz_step_view", {step_index, step_id})

// Quando marcar resposta:
tracking.quizAnswerSelect(stepIndex, answerId);
// track("quiz_answer_select", {step_index, answer_id})

// Upload:
tracking.photoUploadStart();
tracking.photoUploadSuccess();
tracking.photoUploadError(error);

// Final:
tracking.quizComplete();
```

**VSL (`src/components/pre-checkout/PreCheckoutPage.tsx`):**
```typescript
useEffect(() => {
  tracking.vslView(); // track("vsl_view")
}, []);

// Botão checkout:
tracking.checkoutClick(); // track("checkout_click")
```

---

### D) ✅ Variáveis de Ambiente

**Arquivo:** `.env.example` (criar `.env.local` a partir dele)

```env
# Site
PUBLIC_SITE_URL=https://seu-dominio.com

# Supabase (server-side)
SUPABASE_URL=https://<SUPABASE_PROJECT_REF>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<SUPABASE_SERVICE_ROLE_KEY>

# CORS
ALLOWED_ORIGINS=https://maxxing-quiz.vercel.app

# PerfectPay
PERFECTPAY_WEBHOOK_SECRET=trocar_depois

# Meta (futuro)
PUBLIC_FB_PIXEL_ID=trocar_depois
FB_PIXEL_ID=trocar_depois
META_CAPI_ACCESS_TOKEN=trocar_depois
FB_ACCESS_TOKEN=trocar_depois
```

**No Vercel:** Adicione todas essas variáveis em Settings → Environment Variables

---

### E) ✅ Notas Implementadas

- ✅ Route Handlers (Astro API Routes equivalentes)
- ✅ `@supabase/supabase-js` no server (SERVICE_ROLE_KEY)
- ✅ Não usa Prisma (usa Supabase diretamente)
- ✅ Código limpo com comentários
- ✅ TODOs indicando onde plugar Meta Pixel/CAPI

---

## 🔄 Diferenças: Astro vs Next.js

O projeto usa **Astro**, não Next.js. As diferenças:

| Next.js | Astro |
|---------|-------|
| `app/api/track/route.ts` | `src/pages/api/track.ts` |
| `NextRequest/NextResponse` | `APIRoute` |
| `process.env` | `import.meta.env` |
| `request.json()` | `request.json()` (igual) |

**Funcionalidade:** Idêntica ✅

---

## 📚 Arquivos Criados

1. ✅ `sql/tracking_tables.sql` - SQL para criar tabelas
2. ✅ `src/lib/supabase-server.ts` - Cliente Supabase (SERVICE_ROLE_KEY)
3. ✅ `src/pages/api/track.ts` - Endpoint de tracking (atualizado)
4. ✅ `src/pages/api/webhooks/perfectpay.ts` - Webhook (atualizado)
5. ✅ `src/lib/tracking.ts` - Cliente de tracking (atualizado)
6. ✅ `REFERENCIA_NEXTJS.md` - Versão Next.js como referência
7. ✅ `INSTRUCOES_APLICAR_SQL.md` - Como aplicar SQL

---

## 🚀 Próximos Passos

### 1. ⚠️ Aplicar SQL no Supabase (IMPORTANTE)

```bash
# Acesse: https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/sql/new
# Cole o conteúdo de sql/tracking_tables.sql
# Execute
```

### 2. Configurar Variáveis no Vercel

Adicione todas as variáveis listadas acima.

### 3. Testar

- Acesse o site
- Complete o quiz
- Verifique eventos no Supabase

---

## ✅ Checklist Final

- [x] SQL criado
- [x] Endpoint `/api/track` implementado
- [x] Webhook `/api/webhooks/perfectpay` implementado
- [x] Cliente tracking implementado
- [x] Instrumentação nos componentes
- [x] CORS configurado
- [x] Validação de webhook secret
- [x] Build testado
- [ ] **Aplicar SQL no Supabase** ⚠️ FAZER AGORA
- [ ] **Configurar variáveis no Vercel** ⚠️ FAZER AGORA

---

**Status:** ✅ Implementado - Próximo: Aplicar SQL e configurar variáveis

