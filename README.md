# GlowMax - Análise Facial com IA

## 📋 Visão Geral

Plataforma de quiz de análise facial com tecnologia de IA para looksmaxing. O sistema oferece:
- Quiz personalizado por gênero (masculino/feminino)
- Upload de fotos com validação
- Análise facial simulada
- Paywall com checkout integrado

---

## 🚀 Setup Rápido

```bash
# 1. Instalar dependências
npm install

# 2. Verificar imagens obrigatórias
npm run check-images

# 3. Executar em modo desenvolvimento
npm run dev

# 4. Build para produção
npm run build
```

---

## ⚙️ Configuração de Credenciais

### Vercel Environment Variables

Configure as seguintes variáveis de ambiente no Vercel Dashboard (Settings → Environment Variables):

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| **PUBLIC_FB_PIXEL_ID** | Meta Pixel ID (client-side) | Meta Business → Events Manager → Pixel ID |
| **META_CAPI_ACCESS_TOKEN** | Meta Conversions API Access Token (server-only) | Meta Business → Events Manager → Settings → Conversions API → Access Token |

⚠️ **IMPORTANTE:**
- `PUBLIC_FB_PIXEL_ID` pode ser usado no client (já é público por padrão)
- `META_CAPI_ACCESS_TOKEN` é **server-only** e nunca será exposto no client bundle
- Se `PUBLIC_FB_PIXEL_ID` estiver vazio, o Pixel não será inicializado (apenas log em dev)
- Se `META_CAPI_ACCESS_TOKEN` faltar, o server não tentará chamar CAPI (mas continuará gravando no Supabase)

### 1. Meta Pixel / CAPI

O Pixel é inicializado automaticamente no `Layout.astro` quando `PUBLIC_FB_PIXEL_ID` está configurado. O CAPI é chamado automaticamente no endpoint `/api/track` quando `META_CAPI_ACCESS_TOKEN` está configurado.

**Não é necessário editar código manualmente** - apenas configure as variáveis de ambiente no Vercel.

### 2. Google Analytics 4

Edite `src/layouts/Layout.astro`:

```javascript
const GA_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Seu ID do GA4
```

### 3. Tawk.to Chat

Edite `src/layouts/Layout.astro`:

```javascript
const TAWK_PROPERTY_ID = "seu_property_id";
const TAWK_WIDGET_ID = "default";
```

### 4. Checkout URL

Edite `src/components/quiz/PaywallScreen.tsx`:

```javascript
const CHECKOUT_URL = 'https://checkout.perfectpay.com.br/pay/SEU_CODIGO';
```

### 5. PerfectPay Webhook

O webhook está configurado e pronto para receber eventos de compra da PerfectPay.

#### Configuração no Vercel

Adicione a seguinte variável de ambiente no Vercel Dashboard (Settings → Environment Variables):

| Variável | Descrição | Onde obter |
|----------|-----------|------------|
| **PERFECTPAY_WEBHOOK_SECRET** | Secret para validação do webhook (server-only) | Painel PerfectPay → Webhooks → Secret/Token |

⚠️ **IMPORTANTE:**
- `PERFECTPAY_WEBHOOK_SECRET` é **server-only** e nunca será exposto no client bundle
- Se o secret faltar, o webhook retornará 500 com `{ok:false,error:"missing webhook secret"}`
- Se o token/secret for inválido, retornará 401 com `{ok:false,error:"unauthorized"}`

#### Configuração no Painel PerfectPay

1. Acesse o painel da PerfectPay
2. Vá em **Webhooks** → **Configurar Webhook**
3. Configure:
   - **URL:** `https://seu-dominio.com/api/webhooks/perfectpay`
   - **Método:** `POST`
   - **Headers:** Adicione um dos seguintes headers com o secret:
     - `x-webhook-secret: <seu-secret>`
     - `x-perfectpay-secret: <seu-secret>`
     - `Authorization: Bearer <seu-secret>`

#### Mapeamento de Produtos

O sistema mapeia automaticamente os seguintes produtos:

| Tipo | Product Code | Affiliate Code |
|------|--------------|----------------|
| MAIN | `PPPBDPJI` | `PPA23VRV` |
| BUMP_1 | `PPPBDPJF` | `PPA23VRR` |
| BUMP_2 | `PPPBDPJH` | `PPA23VRU` |
| BUMP_3 | `PPPBDPJK` | `PPA23VRX` |
| BUMP_4 | `PPPBDPJO` | `PPA23VS1` |
| BUMP_5 | `PPPBDPJL` | `PPA23VRY` |

Produtos não mapeados serão registrados como `UNKNOWN`.

#### Funcionalidades

- ✅ **Idempotência:** Eventos duplicados retornam `{ok:true,duplicate:true}` sem criar duplicatas
- ✅ **Parsing Robusto:** Extrai `product_code` de múltiplas fontes (direto, items, line_items, etc.)
- ✅ **Mapeamento Automático:** Identifica MAIN vs BUMPs automaticamente
- ✅ **Session Tracking:** Vincula compras a `session_id` quando disponível no payload
- ✅ **Modo de Teste:** Disponível apenas em dev via `?test=1`

#### Estrutura do Payload

O webhook aceita qualquer estrutura de payload da PerfectPay e extrai:

- `order_id` (de: `code`, `sale_id`, `transaction_id`, `id`, etc.)
- `status` (normalizado para: `approved`, `pending`, `refused`, `canceled`, `refunded`, `chargeback`)
- `amount` e `currency`
- `product_code` (busca recursiva em todo o payload)
- `affiliate_code`
- `session_id` (de: `session_id`, `metadata.session_id`, `external_reference`, etc.)

---

## 📁 Estrutura de Arquivos

```
├── public/
│   ├── media/                    # Assets de mídia
│   │   ├── manifest.json         # Lista de assets
│   │   ├── face-scan.mp4         # Animação intro
│   │   ├── muscular.jpg          # Body type
│   │   ├── skinny.jpg            # Body type
│   │   ├── average.jpg           # Body type
│   │   ├── overweight.jpg        # Body type
│   │   └── ...                   # Outros assets
│   ├── favicon.svg
│   └── og-image.png              # Open Graph image
├── src/
│   ├── components/
│   │   ├── quiz/                 # Componentes do quiz
│   │   │   ├── Quiz.tsx          # Componente principal
│   │   │   ├── IntroScreen.tsx
│   │   │   ├── PaywallScreen.tsx # Página de vendas
│   │   │   └── ...
│   │   └── home/                 # Componentes da home
│   ├── data/
│   │   ├── quizData.ts           # Perguntas masculinas
│   │   └── quizDataFemale.ts     # Perguntas femininas
│   ├── layouts/
│   │   └── Layout.astro          # Layout principal
│   ├── lib/
│   │   ├── api.ts                # Utilitários de API
│   │   ├── conversion.tsx        # Componentes de conversão
│   │   └── utils.ts              # Helpers
│   ├── pages/
│   │   ├── api/                  # Endpoints
│   │   │   ├── leads.ts
│   │   │   ├── quiz/result.ts
│   │   │   ├── facebook/capi.ts
│   │   │   └── track/event.ts
│   │   ├── index.astro           # Página inicial
│   │   └── quiz.astro            # Página do quiz
│   └── styles/
│       └── globals.css           # Estilos globais
├── scripts/
│   └── check-images.js           # Validação de assets
└── package.json
```

---

## 🔌 API Endpoints

### POST `/api/leads`
Captura leads do quiz.

```json
{
  "name": "string",
  "email": "string",
  "user_id": "string",
  "quiz_id": "string",
  "source": "string",
  "utm": {}
}
```

### POST `/api/quiz/result`
Salva resultados do quiz.

```json
{
  "user_id": "string",
  "quiz_id": "string",
  "answers": [],
  "score": "number",
  "image_refs": []
}
```

### POST `/api/facebook/capi`
Envia eventos para Facebook CAPI.

```json
{
  "event_name": "Lead|ViewContent|Purchase",
  "event_time": "timestamp",
  "user_data": {},
  "custom_data": {}
}
```

### POST `/api/track`
Tracking unificado de eventos.

```json
{
  "event": "string",
  "user_id": "string",
  "quiz_step": "string",
  "metadata": {}
}
```

### POST `/api/webhooks/perfectpay`
Webhook para receber eventos de compra da PerfectPay.

**Headers necessários (um dos seguintes):**
- `x-webhook-secret: <PERFECTPAY_WEBHOOK_SECRET>`
- `x-perfectpay-secret: <PERFECTPAY_WEBHOOK_SECRET>`
- `Authorization: Bearer <PERFECTPAY_WEBHOOK_SECRET>`

**Exemplo de payload:**
```json
{
  "code": "ORD123456",
  "sale_status": "approved",
  "sale_amount": 99.90,
  "currency": "BRL",
  "product_code": "PPPBDPJI",
  "affiliate_code": "PPA23VRV",
  "session_id": "sess_abc123",
  "event_type": "sale_approved"
}
```

**Respostas:**
- **200 OK (novo evento):** `{ok:true,id:"uuid",order_id:"ORD123",offer_type:"MAIN",is_bump:false}`
- **200 OK (duplicado):** `{ok:true,duplicate:true,id:"uuid",order_id:"ORD123"}`
- **400 Bad Request:** `{ok:false,error:"missing order_id",details:{...}}`
- **401 Unauthorized:** `{ok:false,error:"unauthorized"}`
- **500 Internal Server Error:** `{ok:false,error:"missing webhook secret"}` ou erro do banco

**Modo de teste (apenas em dev):**
```bash
curl -X POST "http://localhost:4321/api/webhooks/perfectpay?test=1" \
  -H "x-webhook-secret: seu-secret" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## 📊 Eventos de Tracking

### Google Analytics 4
- `QuizStep` - Usuário avançou no quiz
- `QuizBackClick` - Usuário voltou etapa
- `CheckoutClick` - Clique em botão de checkout
- `LeadSubmit` - Lead capturado
- `PurchaseSuccess` - Compra concluída

### Facebook Pixel
- `PageView` - Visualização de página
- `ViewContent` - Visualização de conteúdo
- `Lead` - Lead capturado
- `Purchase` - Compra concluída

---

## 🎨 Paleta de Cores

```css
:root {
  --primary: #FF4D4D;       /* Vermelho principal */
  --accent: #FF8A00;        /* Laranja accent */
  --background: #0A0A0A;    /* Fundo escuro */
  --surface: #111111;       /* Superfície */
  --text: #FFFFFF;          /* Texto */
  --muted: #888888;         /* Texto secundário */
}
```

---

## 📱 Breakpoints

```css
/* Mobile first */
sm: 640px   /* Smartphone grande */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
```

---

## ✅ Checklist de QA

### Mobile
- [ ] iPhone SE (375px)
- [ ] iPhone 8/12/14 (390px)
- [ ] Pixel 5 (393px)
- [ ] Galaxy S20 (412px)

### Funcionalidades
- [ ] Quiz navega corretamente
- [ ] Voltar não perde dados
- [ ] Upload de fotos funciona
- [ ] Botões de checkout redirecionam
- [ ] Chat carrega após 3s

### Performance
- [ ] Lighthouse >= 80 (mobile)
- [ ] Imagens otimizadas
- [ ] Sem overflow horizontal

---

## 🛠️ Scripts Disponíveis

```bash
npm run dev           # Desenvolvimento
npm run build         # Build produção (inclui check-images)
npm run preview       # Preview do build
npm run check-images  # Valida assets obrigatórios
npm run lighthouse    # Gera relatório Lighthouse
```

---

## 📞 Suporte

Para credenciais ou assets faltantes, envie:
- `media/<nome>.{png,webp,jpg}` para imagens
- `FB_ACCESS_TOKEN` + `PIXEL_ID` para Facebook CAPI
- `MEASUREMENT_ID` para GA4

---

## 📄 Licença

Propriedade privada. Todos os direitos reservados.
