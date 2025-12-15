# 🏗️ Arquitetura Serverless Implementada

## 📋 Visão Geral

Arquitetura ideal para front-end only com serverless mínimo, implementada em **Astro + Vercel**.

---

## 🎯 Endpoints Serverless

### 1. **POST `/api/track`**

**Função:** Recebe eventos do browser (home/quiz/vsl), salva no Supabase e dispara CAPI/Pixel.

**Fluxo:**
1. ✅ Recebe evento do frontend
2. ✅ Salva no Supabase (tabela `events` via Prisma)
3. ✅ Dispara Facebook CAPI (quando configurado)
4. ✅ Retorna sucesso

**Uso no Frontend:**
```typescript
// Exemplo de uso
await fetch('/api/track', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'ViewContent',
    source: 'home',
    user_id: 'user_123',
    content_name: 'Homepage',
    fbp: getCookie('_fbp'), // Facebook Pixel Browser ID
    fbc: getCookie('_fbc'), // Facebook Click ID
  }),
});
```

**Eventos suportados:**
- `ViewContent` - Visualização de conteúdo
- `Lead` - Captura de lead
- `InitiateCheckout` - Início do checkout
- `Purchase` - Compra realizada
- `CompleteRegistration` - Registro completo
- `QuizStep` - Etapa do quiz
- `QuizCompleted` - Quiz completo

**Variáveis de ambiente necessárias:**
- `FB_PIXEL_ID` ou `PUBLIC_FB_PIXEL_ID` (opcional)
- `FB_ACCESS_TOKEN` (opcional)

---

### 2. **POST `/api/webhooks/perfectpay`**

**Função:** Recebe status de pagamento da PerfectPay, salva no Supabase e dispara Purchase server-side.

**Fluxo:**
1. ✅ Valida token do webhook
2. ✅ Processa payload da PerfectPay
3. ✅ Salva/atualiza compra no Supabase (tabela `purchases` via Prisma)
4. ✅ Cria evento de tracking
5. ✅ **Dispara Purchase no Facebook CAPI** (quando compra aprovada)
6. ✅ Retorna sucesso

**Configuração na PerfectPay:**
- URL: `https://seu-dominio.vercel.app/api/webhooks/perfectpay`
- Método: POST
- Token: Configure `PERFECTPAY_WEBHOOK_TOKEN` no Vercel

**Variáveis de ambiente necessárias:**
- `PERFECTPAY_WEBHOOK_TOKEN` (obrigatório)
- `FB_PIXEL_ID` ou `PUBLIC_FB_PIXEL_ID` (opcional, para CAPI)
- `FB_ACCESS_TOKEN` (opcional, para CAPI)

---

## 🗄️ Estrutura de Dados

### Tabela `events` (Supabase/Prisma)

Armazena todos os eventos de tracking:

```typescript
{
  id: string;
  userId: string | null;
  eventName: string; // 'ViewContent', 'Lead', 'Purchase', etc.
  eventData: JSON; // Dados customizados do evento
  source: string; // 'home', 'quiz', 'vsl', 'webhook_perfectpay'
  createdAt: DateTime;
}
```

### Tabela `purchases` (Supabase/Prisma)

Armazena compras recebidas via webhook:

```typescript
{
  id: string;
  externalId: string; // ID da transação no gateway
  gateway: string; // 'perfectpay'
  status: string; // 'approved', 'refused', 'refunded', etc.
  customerEmail: string;
  amount: number;
  currency: string; // 'BRL'
  productName: string | null;
  leadId: string | null; // Associação com lead
  rawPayload: JSON; // Payload completo do webhook
  paidAt: DateTime | null;
  createdAt: DateTime;
}
```

---

## 🔄 Fluxo Completo

### Fluxo de Tracking (Home/Quiz/VSL)

```
Frontend (Browser)
    ↓
POST /api/track
    ↓
┌─────────────────────────┐
│ 1. Salvar no Supabase   │ → events table
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 2. Disparar Facebook CAPI│ → Facebook Graph API
└─────────────────────────┘
    ↓
Resposta de sucesso
```

### Fluxo de Webhook (PerfectPay)

```
PerfectPay Gateway
    ↓
POST /api/webhooks/perfectpay
    ↓
┌─────────────────────────┐
│ 1. Validar token        │
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 2. Salvar no Supabase   │ → purchases table
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 3. Criar evento         │ → events table
└─────────────────────────┘
    ↓
┌─────────────────────────┐
│ 4. Disparar Purchase CAPI│ → Facebook Graph API (se aprovado)
└─────────────────────────┘
    ↓
Resposta de sucesso
```

---

## 🔧 Integração com Frontend

### Helper Function para Tracking

Crie um helper no frontend:

```typescript
// src/lib/tracking.ts
export async function trackEvent(
  event: string,
  data: {
    source?: 'home' | 'quiz' | 'vsl' | 'pre-checkout';
    user_id?: string;
    content_name?: string;
    value?: number;
    [key: string]: any;
  }
) {
  try {
    // Obter cookies do Facebook Pixel
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        ...data,
        fbp,
        fbc,
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('[Tracking] Erro:', error);
    // Não bloquear a UI se tracking falhar
  }
}
```

### Uso nos Componentes

```typescript
// Exemplo: Homepage
import { trackEvent } from '../lib/tracking';

// Ao carregar a página
useEffect(() => {
  trackEvent('ViewContent', {
    source: 'home',
    content_name: 'Homepage',
  });
}, []);

// Exemplo: Quiz
const handleQuizStep = (step: string) => {
  trackEvent('QuizStep', {
    source: 'quiz',
    quiz_step: step,
    user_id: userId,
  });
};

// Exemplo: Lead capturado
const handleLeadCapture = async (email: string) => {
  await trackEvent('Lead', {
    source: 'quiz',
    user_id: userId,
    email,
    content_name: 'Quiz Lead',
  });
};
```

---

## 🔐 Segurança

### Validação de Webhook

O endpoint `/api/webhooks/perfectpay` valida o token:

```typescript
// Verifica token no header ou payload
const token = headers.get('x-webhook-token') || payload.token;
if (token !== PERFECTPAY_WEBHOOK_TOKEN) {
  return 401 Unauthorized;
}
```

### Rate Limiting (Recomendado)

Adicione rate limiting no Vercel:

```json
// vercel.json
{
  "functions": {
    "src/pages/api/track.ts": {
      "maxDuration": 10
    },
    "src/pages/api/webhooks/perfectpay.ts": {
      "maxDuration": 10
    }
  }
}
```

---

## 📊 Monitoramento

### Logs

Todos os endpoints logam:
- ✅ Eventos recebidos
- ✅ Sucesso/falha no Supabase
- ✅ Sucesso/falha no Facebook CAPI
- ⚠️ Erros (sem expor dados sensíveis)

### Métricas Recomendadas

1. **Taxa de sucesso dos eventos**
   - Query: `SELECT COUNT(*) FROM events WHERE created_at > NOW() - INTERVAL '1 day'`

2. **Compras aprovadas**
   - Query: `SELECT COUNT(*) FROM purchases WHERE status = 'approved' AND created_at > NOW() - INTERVAL '1 day'`

3. **Taxa de conversão**
   - Leads / Visualizações
   - Compras / Leads

---

## 🚀 Deploy

### Variáveis de Ambiente no Vercel

Configure estas variáveis:

**Obrigatórias:**
```
DATABASE_URL=postgresql://...
PERFECTPAY_WEBHOOK_TOKEN=seu_token
```

**Opcionais (para Facebook CAPI):**
```
FB_PIXEL_ID=1234567890
FB_ACCESS_TOKEN=seu_token
PUBLIC_FB_PIXEL_ID=1234567890
```

**Supabase:**
```
SUPABASE_URL=https://...
PUBLIC_SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
PUBLIC_SUPABASE_ANON_KEY=...
```

---

## ✅ Checklist de Implementação

- [x] Endpoint `/api/track` criado
- [x] Endpoint `/api/webhooks/perfectpay` melhorado
- [x] Integração com Supabase (Prisma)
- [x] Integração com Facebook CAPI
- [x] Cliente Supabase configurado
- [x] Documentação criada
- [ ] Helper function no frontend
- [ ] Testes end-to-end
- [ ] Rate limiting configurado
- [ ] Monitoramento configurado

---

## 📚 Referências

- **Astro API Routes:** https://docs.astro.build/en/guides/api-routes/
- **Vercel Serverless:** https://vercel.com/docs/functions
- **Facebook CAPI:** https://developers.facebook.com/docs/marketing-api/conversions-api
- **Supabase:** https://supabase.com/docs

---

**Última atualização:** $(date)
**Status:** ✅ Implementado e pronto para uso

