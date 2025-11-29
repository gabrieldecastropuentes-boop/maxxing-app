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

### 1. Facebook Pixel / CAPI

Edite `src/layouts/Layout.astro`:

```javascript
const FB_PIXEL_ID = "SEU_PIXEL_ID"; // Ex: 1234567890
```

Para Facebook CAPI (server-side), crie `.env`:

```env
FB_ACCESS_TOKEN=seu_access_token
FB_PIXEL_ID=1234567890
FB_BUSINESS_ID=seu_business_id
```

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

### POST `/api/track/event`
Tracking unificado de eventos.

```json
{
  "event": "string",
  "user_id": "string",
  "quiz_step": "string",
  "metadata": {}
}
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
