# 📊 Prisma Database Setup

Esta pasta contém a configuração do banco de dados usando Prisma ORM.

## 🗂️ Estrutura

```
prisma/
├── schema.prisma    # Schema do banco de dados
└── README.md        # Este arquivo
```

## 🛒 Webhook de Compras (PerfectPay)

### Configuração

1. **No painel da PerfectPay**, configure o webhook:
   - URL: `https://seu-dominio.vercel.app/api/webhooks/perfectpay`
   - Método: POST
   - Eventos: Todos (approved, refunded, chargeback, etc.)

2. **Adicione o token de segurança** nas variáveis de ambiente:
   ```env
   PERFECTPAY_WEBHOOK_TOKEN=seu_token_secreto_aqui
   ```

3. **Modelo de dados**: As compras são salvas no modelo `Purchase` com:
   - Status: approved, refused, refunded, chargeback, pending, canceled
   - Dados do cliente: email, nome, telefone, documento
   - Dados do produto: nome, plano
   - Valores e método de pagamento
   - UTM tracking
   - Payload completo do webhook

### Testando o Webhook

```bash
# Testar se o endpoint está ativo
curl https://seu-dominio.vercel.app/api/webhooks/perfectpay

# Simular uma compra aprovada
curl -X POST https://seu-dominio.vercel.app/api/webhooks/perfectpay \
  -H "Content-Type: application/json" \
  -H "x-webhook-token: seu_token" \
  -d '{
    "sale_id": "test_123",
    "sale_status": "approved",
    "customer": {
      "email": "teste@example.com",
      "name": "Cliente Teste"
    },
    "sale_amount": 97.00,
    "product_name": "Maxxing Blueprint"
  }'
```

## 🚀 Configuração Inicial

### 1. Configurar Variável de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
DATABASE_URL="postgresql://usuario:senha@host:porta/database?schema=public"
```

### 2. Para Vercel

Adicione a variável `DATABASE_URL` no painel da Vercel:
- Vá em **Settings** → **Environment Variables**
- Adicione `DATABASE_URL` com a string de conexão do seu banco PostgreSQL

### 3. Gerar Prisma Client

```bash
npm run prisma:generate
```

### 4. Criar Migrações

```bash
npm run prisma:migrate
```

Ou para desenvolvimento rápido (sem histórico de migrações):

```bash
npm run prisma:push
```

## 📋 Modelos Disponíveis

### `Lead`
Captura de leads do quiz, paywall e landing pages.

**Campos principais:**
- `email` (obrigatório)
- `userId` (obrigatório)
- `source` (quiz, paywall, landing, popup)
- `utm_*` (tracking de campanhas)

### `QuizResult`
Resultados e respostas do quiz.

**Campos principais:**
- `userId`, `quizId` (obrigatórios)
- `score` (pontuação final)
- `gender` (male/female)
- `recommendedPlan` (basic/standard/premium)
- `answers` (JSON com respostas)

### `PhotoScore`
Análise facial e scores de fotos.

**Campos principais:**
- `overallScore` (pontuação geral)
- `symmetry`, `skinQuality`, `facialStructure`, `eyeArea`, `jawline`
- `analysis` (texto de análise)

### `Event`
Eventos de tracking e analytics.

**Campos principais:**
- `eventName` (nome do evento)
- `eventData` (JSON com dados do evento)
- `userId` (opcional)

## 🛠️ Comandos Úteis

```bash
# Gerar Prisma Client
npm run prisma:generate

# Criar nova migração
npm run prisma:migrate

# Aplicar mudanças sem migração (dev)
npm run prisma:push

# Abrir Prisma Studio (GUI)
npm run prisma:studio

# Seed do banco (se configurado)
npm run prisma:seed
```

## 🔗 Integração com Vercel

O Prisma está configurado para funcionar com Vercel Serverless Functions:

1. O cliente Prisma é criado como singleton em `src/lib/db.ts`
2. O build inclui `prisma generate` automaticamente
3. Certifique-se de que `DATABASE_URL` está configurada nas variáveis de ambiente da Vercel

## 📝 Exemplo de Uso

```typescript
import { prisma } from '@/lib/db';

// Criar um lead
const lead = await prisma.lead.create({
  data: {
    email: 'usuario@example.com',
    userId: 'user_123',
    source: 'quiz',
  },
});

// Buscar resultados do quiz
const results = await prisma.quizResult.findMany({
  where: { userId: 'user_123' },
  orderBy: { createdAt: 'desc' },
});
```

## 🗄️ Banco de Dados Recomendados

Para Vercel, recomendamos:
- **Vercel Postgres** (integrado)
- **Neon** (serverless PostgreSQL)
- **Supabase** (PostgreSQL gerenciado)
- **Railway** (PostgreSQL simples)

Todos suportam Prisma e funcionam bem com serverless functions.

