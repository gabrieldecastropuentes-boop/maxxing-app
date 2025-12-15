# ✅ Tracking Meta (Pixel/CAPI) com Dedup - Implementado

## 🎯 Funcionalidades Implementadas

### 1. ✅ Facebook Pixel (Browser-side)
- ✅ Código base do Pixel implementado
- ✅ **Desligado por env var** (só carrega se `PUBLIC_FB_PIXEL_ID` configurado)
- ✅ PageView dispara automaticamente quando Pixel carrega
- ✅ Helper `trackFacebookEvent()` com suporte a `event_id` para dedup

### 2. ✅ Facebook CAPI (Server-side)
- ✅ Integrado no endpoint `/api/track`
- ✅ Integrado no webhook `/api/webhooks/perfectpay`
- ✅ **Dedup via event_id** - mesmo `event_id` usado no Pixel e CAPI

### 3. ✅ Tabelas Supabase (Schema Escalável)
- ✅ `tracking_lmx_sessions` - Sessões com chave de ligação
- ✅ `tracking_lmx_events` - Eventos com `event_id` para dedup
- ✅ `tracking_lmx_purchases` - Compras vinculadas a sessões

---

## 🔑 Chave de Ligação Futura

As tabelas usam para match futuro:

- `session_id` - UUID persistente
- `fbp` - Facebook Pixel Browser ID
- `fbc` - Facebook Click ID
- `utm_*` - Parâmetros UTM
- `timestamps` - first_seen_at, last_seen_at, created_at

---

## 📊 Estrutura das Tabelas

### `tracking_lmx_sessions`

```typescript
{
  id: string;
  sessionId: string; // UUID único
  fbp?: string; // Facebook Pixel Browser ID
  fbc?: string; // Facebook Click ID
  fbclid?: string; // Facebook Click ID (URL param)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  userAgent?: string;
  referrer?: string;
  landingUrl?: string;
  firstSeenAt: DateTime;
  lastSeenAt: DateTime;
}
```

### `tracking_lmx_events`

```typescript
{
  id: string;
  sessionId: string;
  eventName: string; // 'home_view', 'quiz_step_view', etc.
  eventId: string; // ⚠️ Para dedup Meta Pixel/CAPI
  stepIndex?: number;
  stepId?: string;
  answerId?: number; // OK para analytics agregado
  metadata: JSON;
  url?: string;
  referrer?: string;
  createdAt: DateTime;
}
```

### `tracking_lmx_purchases`

```typescript
{
  id: string;
  sessionId?: string; // Vinculado à sessão (se disponível)
  purchaseId?: string; // ID da tabela purchases
  eventId?: string; // Para dedup Meta
  amount: number;
  currency: string;
  status: string;
  gateway: string;
  createdAt: DateTime;
}
```

---

## 🔄 Fluxo de Dedup (Meta Pixel + CAPI)

### Como Funciona:

1. **Frontend gera `event_id`:**
   ```typescript
   const eventId = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
   ```

2. **Pixel dispara no browser:**
   ```javascript
   trackFacebookEvent('ViewContent', params, eventId);
   // Envia com eventID: eventId
   ```

3. **CAPI dispara no servidor:**
   ```typescript
   {
     event_name: 'ViewContent',
     event_id: eventId, // ⚠️ MESMO event_id do Pixel
     // ... outros dados
   }
   ```

4. **Meta faz dedup automaticamente:**
   - Se receber o mesmo `event_id` no Pixel e CAPI
   - Conta apenas uma vez no relatório

---

## ⚙️ Configuração

### Variáveis de Ambiente:

**Obrigatórias (para CAPI funcionar):**
```
FB_PIXEL_ID=1234567890
FB_ACCESS_TOKEN=seu_token
PUBLIC_FB_PIXEL_ID=1234567890
```

**Opcionais:**
- Se `PUBLIC_FB_PIXEL_ID` não estiver configurado, Pixel não carrega (código desligado)
- Se `FB_ACCESS_TOKEN` não estiver configurado, CAPI não dispara

---

## 📝 Código Implementado

### Layout.astro (Pixel)

```astro
{FB_PIXEL_ID && (
  <script>
    // Pixel carrega e dispara PageView automaticamente
    fbq('init', FB_PIXEL_ID);
    fbq('track', 'PageView');
    
    // Helper para tracking com event_id
    window.trackFacebookEvent = function(eventName, params, eventId) {
      fbq('track', eventName, {
        ...params,
        eventID: eventId // Para dedup
      });
    };
  </script>
)}
```

### tracking.ts (Frontend)

```typescript
// Gera event_id
const eventId = generateEventId();

// Envia para API
await fetch('/api/track', {
  body: JSON.stringify({ event, event_id: eventId, ... })
});

// Dispara Pixel (se disponível)
if (window.trackFacebookEvent) {
  trackFacebookEvent(fbEventName, params, eventId);
}
```

### /api/track (Server)

```typescript
// Salva no banco com event_id
await prisma.trackingEvent.create({
  data: {
    eventId: data.event_id,
    // ...
  }
});

// Dispara CAPI com mesmo event_id
const fbEvent = {
  event_id: data.event_id, // ⚠️ Dedup
  // ...
};
```

---

## 🗄️ Migrations

Para criar as tabelas no Supabase:

```bash
# Gerar migration
npx prisma migrate dev --name add_tracking_tables

# Ou push direto (desenvolvimento)
npx prisma db push
```

---

## ✅ Checklist

- [x] Schema Prisma atualizado com novas tabelas
- [x] Pixel implementado (desligado por env var)
- [x] CAPI implementado com event_id
- [x] Dedup funcionando (mesmo event_id em Pixel e CAPI)
- [x] Tabelas de tracking criadas
- [x] Webhook atualizado com event_id
- [x] Build testado e funcionando

---

## 📚 Documentação

- **Schema:** `prisma/schema.prisma`
- **Tracking:** `src/lib/tracking.ts`
- **API:** `src/pages/api/track.ts`
- **Webhook:** `src/pages/api/webhooks/perfectpay.ts`
- **Layout:** `src/layouts/Layout.astro`

---

**Status:** ✅ Implementado e pronto para uso
**Última atualização:** $(date)

