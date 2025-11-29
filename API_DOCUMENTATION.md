# 📚 Documentação de APIs - Maxxing App

## Visão Geral

Este documento descreve todas as APIs disponíveis no sistema, suas integrações e como utilizá-las.

---

## 🔗 Endpoints Disponíveis

### 1. POST `/api/leads` - Captura de Leads

**Descrição:** Captura leads do quiz e paywall para funil de vendas.

**Payload:**
```json
{
  "name": "string (opcional)",
  "email": "string (obrigatório)",
  "phone": "string (opcional)",
  "quiz_id": "string (opcional)",
  "user_id": "string (obrigatório)",
  "source": "quiz | paywall | landing | popup",
  "utm_source": "string (opcional)",
  "utm_medium": "string (opcional)",
  "utm_campaign": "string (opcional)",
  "utm_content": "string (opcional)"
}
```

**Resposta:**
```json
{
  "lead_id": "lead_1234567890_abc123",
  "status": "captured | duplicate | error"
}
```

---

### 2. POST `/api/quiz/result` - Salvar Resultado do Quiz

**Descrição:** Salva os resultados do quiz e determina plano recomendado.

**Payload:**
```json
{
  "user_id": "string",
  "quiz_id": "string",
  "answers": [
    {
      "questionId": 1,
      "answerId": 2,
      "score": 3
    }
  ],
  "score": 75,
  "image_reference": "string (opcional)",
  "gender": "male | female"
}
```

**Resposta:**
```json
{
  "result_id": "result_quiz123_1234567890",
  "recommended_plan": "basic | standard | premium",
  "score": 75
}
```

---

### 3. POST `/api/facebook/capi` - Facebook Conversion API

**Descrição:** Envia eventos de conversão para o Facebook via server-side.

**Eventos Suportados:**
- `Lead` - Captura de lead
- `ViewContent` - Visualização de conteúdo
- `Subscribe` - Assinatura
- `Purchase` - Compra
- `InitiateCheckout` - Início de checkout
- `CompleteRegistration` - Registro completo

**Payload:**
```json
{
  "event_name": "Lead",
  "event_time": 1234567890,
  "event_source_url": "https://...",
  "user_data": {
    "em": "hashed_email",
    "ph": "hashed_phone",
    "client_ip_address": "string",
    "client_user_agent": "string",
    "fbc": "fb_click_id",
    "fbp": "fb_browser_id"
  },
  "custom_data": {
    "value": 99.90,
    "currency": "BRL",
    "content_name": "Quiz Looksmaxing",
    "quiz_score": 75
  }
}
```

**Configuração necessária:**
```env
FB_PIXEL_ID=your_pixel_id
FB_ACCESS_TOKEN=your_access_token
```

---

### 4. GET `/api/products` - Recomendações de Produtos

**Descrição:** Retorna produtos personalizados baseados no perfil do usuário.

**Parâmetros Query:**
- `user_id` - ID do usuário
- `category` - Filtrar por: `skincare | haircare | supplement | grooming`
- `tier` - Filtrar por: `budget | standard | premium`

**Resposta:**
```json
{
  "products": [
    {
      "id": "p1",
      "title": "Gel Esfoliante BHA 2%",
      "description": "Remove células mortas e desobstrui poros",
      "price": 49.90,
      "original_price": 79.90,
      "link": "https://...",
      "affiliate_link": "https://...",
      "image": "/media/product1.jpg",
      "fit_score": 95,
      "category": "skincare",
      "tier": "budget"
    }
  ],
  "recommended_routine": [
    "1. Lavar o rosto com água morna",
    "2. Aplicar BHA/Esfoliante (noite)",
    "3. Aplicar Niacinamida",
    "4. Hidratar com CeraVe",
    "5. Protetor Solar (manhã)"
  ]
}
```

---

### 5. POST `/api/reval` - Reavaliação Mensal

**Descrição:** Agenda reavaliação periódica do usuário.

**Payload:**
```json
{
  "user_id": "string",
  "result_id": "string",
  "reval_type": "monthly | weekly | custom",
  "scheduled_date": "ISO date string (opcional)"
}
```

**Resposta:**
```json
{
  "scheduled": true,
  "next_reval_date": "2025-12-27T00:00:00.000Z",
  "message": "Reavaliação monthly agendada com sucesso"
}
```

---

## 🛠️ Utilitários de Integração

### Uso no Frontend

```typescript
import { 
  captureLead, 
  saveQuizResult, 
  sendFacebookEvent,
  generateUserId,
  getUTMParams 
} from '@/lib/api';

// Capturar lead
const leadResult = await captureLead({
  email: 'user@email.com',
  user_id: generateUserId(),
  source: 'quiz',
  ...getUTMParams()
});

// Salvar resultado do quiz
const quizResult = await saveQuizResult({
  user_id: 'user_123',
  quiz_id: 'quiz_456',
  answers: [...],
  score: 75,
  gender: 'male'
});

// Enviar evento Facebook
await sendFacebookEvent({
  event_name: 'Lead',
  custom_data: {
    content_name: 'Quiz Looksmaxing',
    quiz_score: 75
  }
});
```

---

## 📱 Componentes de Conversão

### Badges Disponíveis

```tsx
import { AIBadge, PremiumBadge, VerifiedBadge } from '@/lib/conversion';

<AIBadge />           // "Recomendado por IA Avançada"
<PremiumBadge />      // "⭐ Análise Premium"
<VerifiedBadge />     // "✓ Verificado"
```

### Microcopy para CTAs

```tsx
import { CTAMicrocopy } from '@/lib/conversion';

<CTAMicrocopy variant="speed" />     // "Resultados em menos de 30s"
<CTAMicrocopy variant="guarantee" /> // "100% garantia de satisfação"
<CTAMicrocopy variant="security" />  // "🔒 Seus dados estão protegidos"
<CTAMicrocopy variant="social" />    // "+2.3M de análises realizadas"
```

### Prova Social

```tsx
import { SocialProofMini, LiveViewers } from '@/lib/conversion';

<SocialProofMini count={143} />  // "143 pessoas compraram na última hora"
<LiveViewers count={47} />       // "47 pessoas vendo agora"
```

### Variações de CTA (Testes A/B)

```tsx
import { getRandomCTA } from '@/lib/conversion';

const ctaText = getRandomCTA('results');  // Variação aleatória
// Possíveis: "Obter meus resultados finais", "Ver meus resultados agora", etc.
```

---

## 🎨 Classes CSS de Otimização

### Mobile-First

```css
.safe-container    /* Previne overflow horizontal */
.safe-top          /* Padding para notch */
.safe-bottom       /* Padding para home indicator */
.min-h-screen-safe /* Altura mínima considerando teclado virtual */
```

### Performance

```css
.gpu-accelerated   /* Força aceleração de GPU */
.lazy-render       /* Content-visibility: auto */
.skeleton          /* Loading skeleton animado */
```

### Animações de Conversão

```css
.animate-tap       /* Scale 0.98 no tap */
.animate-hover     /* Scale 1.02 no hover */
.cta-shine         /* Efeito de brilho em CTAs */
```

### Badges

```css
.badge-ai          /* Badge "Recomendado por IA" */
.badge-premium     /* Badge "Análise Premium" */
.badge-verified    /* Badge "Verificado" */
```

---

## 📊 Tracking de Eventos

### Eventos Padrão

| Evento | Quando Disparar | Dados |
|--------|-----------------|-------|
| `view_paywall` | Paywall exibida | `{ userId, score }` |
| `click_cta_*` | Clique em CTA | `{ userId, ctaType }` |
| `lead_captured` | Lead salvo | `{ leadId, source }` |
| `quiz_completed` | Quiz finalizado | `{ score, answers }` |
| `purchase_complete` | Pagamento confirmado | `{ value, plan }` |

---

## 🔧 Próximos Passos de Implementação

1. **Banco de Dados:** Conectar endpoints a PostgreSQL/Supabase
2. **Email Marketing:** Integrar ActiveCampaign/Mailchimp
3. **Pagamentos:** Implementar Stripe/Pagar.me
4. **Facebook:** Configurar credenciais CAPI reais
5. **Analytics:** Integrar Google Analytics 4
6. **CDN:** Configurar otimização de imagens via Cloudflare

---

## 📞 Suporte

Para dúvidas sobre implementação, consulte os arquivos:
- `src/lib/api.ts` - Funções de API
- `src/lib/conversion.tsx` - Componentes de conversão
- `src/styles/globals.css` - Classes de otimização

