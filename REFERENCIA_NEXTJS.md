# 📘 Referência: Implementação Next.js (App Router)

## ⚠️ Nota

Este projeto usa **Astro**, mas aqui está a implementação equivalente para **Next.js (App Router)** caso você queira migrar ou usar como referência.

---

## 📁 Estrutura de Arquivos Next.js

```
app/
  api/
    track/
      route.ts          # POST /api/track
    webhooks/
      perfectpay/
        route.ts        # POST /api/webhooks/perfectpay
lib/
  tracking.ts           # Cliente de tracking
  supabase-server.ts    # Cliente Supabase (SERVICE_ROLE_KEY)
```

---

## A) SQL para Criar Tabelas

Veja: `sql/tracking_tables.sql`

Execute no Supabase SQL Editor.

---

## B) Implementação Next.js

### 1. `app/api/track/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Validar CORS
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  const allowed = (process.env.ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || '').split(',');
  return allowed.some(o => origin.startsWith(o.trim()));
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  
  // CORS
  if (!isOriginAllowed(origin)) {
    return NextResponse.json({ ok: false, error: 'Origin not allowed' }, { status: 403 });
  }

  try {
    const data = await request.json();
    
    // Validação
    if (!data.event_name || !data.event_id || !data.session_id) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Enriquecer no server
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const ip = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0] || '';

    // 1. Criar/atualizar sessão
    const { data: existingSession } = await supabase
      .from('tracking_lmx_sessions')
      .select('*')
      .eq('session_id', data.session_id)
      .single();

    if (existingSession) {
      await supabase
        .from('tracking_lmx_sessions')
        .update({
          last_seen_at: new Date().toISOString(),
          ...(data.fbp && !existingSession.fbp && { fbp: data.fbp }),
          ...(data.fbc && !existingSession.fbc && { fbc: data.fbc }),
        })
        .eq('session_id', data.session_id);
    } else {
      await supabase
        .from('tracking_lmx_sessions')
        .insert({
          session_id: data.session_id,
          fbp: data.fbp,
          fbc: data.fbc,
          fbclid: data.fbclid,
          utm_source: data.utm_source,
          utm_medium: data.utm_medium,
          utm_campaign: data.utm_campaign,
          utm_content: data.utm_content,
          utm_term: data.utm_term,
          user_agent: userAgent,
          referrer: referer,
          landing_url: data.page,
        });
    }

    // 2. Salvar evento
    await supabase
      .from('tracking_lmx_events')
      .insert({
        session_id: data.session_id,
        event_name: data.event_name,
        event_id: data.event_id,
        step_index: data.step_index,
        step_id: data.step_id,
        answer_id: data.answer_id,
        metadata: data.meta || {},
        page_url: data.page,
        referrer: referer,
      });

    // 3. TODO: Meta CAPI (quando tiver META_CAPI_ACCESS_TOKEN)
    /*
    const fbPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
    const fbAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
    
    if (fbPixelId && fbAccessToken) {
      // Enviar para Facebook CAPI com event_id para dedup
    }
    */

    return NextResponse.json({ ok: true }, {
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('[API/track] Erro:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
```

### 2. `app/api/webhooks/perfectpay/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function validateWebhookSecret(headers: Headers): boolean {
  const secret = process.env.PERFECTPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  return headers.get('x-webhook-secret') === secret;
}

export async function POST(request: NextRequest) {
  // Validar secret
  if (!validateWebhookSecret(request.headers)) {
    return NextResponse.json({ ok: false, error: 'Invalid webhook secret' }, { status: 401 });
  }

  try {
    const payload = await request.json();
    
    const orderId = payload.order_id || payload.sale_id || payload.transaction_id;
    const status = payload.status || payload.sale_status || 'unknown';
    const amount = payload.total_value || payload.sale_amount || payload.amount || 0;
    const currency = payload.currency || 'BRL';
    const purchaseAprovada = status === 'approved' || status === 'paid';
    const eventId = crypto.randomUUID();

    // Salvar no Supabase
    const { data: existing } = await supabase
      .from('tracking_lmx_purchases')
      .select('*')
      .eq('order_id', orderId)
      .single();

    if (existing) {
      await supabase
        .from('tracking_lmx_purchases')
        .update({
          status,
          purchase_aprovada: purchaseAprovada,
          total_value: amount,
          currency,
          raw_payload: payload,
        })
        .eq('order_id', orderId);
    } else {
      await supabase
        .from('tracking_lmx_purchases')
        .insert({
          order_id: orderId,
          status,
          total_value: amount,
          currency,
          purchase_aprovada: purchaseAprovada,
          event_id: eventId,
          raw_payload: payload,
        });
    }

    // TODO: Meta CAPI Purchase (quando tiver META_CAPI_ACCESS_TOKEN)
    /*
    if (purchaseAprovada) {
      const fbPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      const fbAccessToken = process.env.META_CAPI_ACCESS_TOKEN;
      
      if (fbPixelId && fbAccessToken) {
        // Enviar Purchase para Facebook CAPI
      }
    }
    */

    return NextResponse.json({ ok: true, order_id: orderId, status });
  } catch (error) {
    console.error('[Webhook PerfectPay] Erro:', error);
    return NextResponse.json({ ok: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

### 3. `lib/tracking.ts`

```typescript
// Gerar session_id
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('session_id');
  if (stored) return stored;
  const newId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  localStorage.setItem('session_id', newId);
  return newId;
}

// Gerar event_id (UUID)
function generateEventId(): string {
  return crypto.randomUUID();
}

// Capturar UTMs
function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(key => {
    const value = params.get(key);
    if (value) utms[key] = value;
  });
  const fbclid = params.get('fbclid');
  if (fbclid) utms.fbclid = fbclid;
  return utms;
}

// Capturar cookies Facebook
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop()?.split(';').shift() || null : null;
}

// Função principal
export async function track(
  eventName: string,
  props?: {
    step_index?: number;
    step_id?: string;
    answer_id?: number;
    meta?: Record<string, any>;
  }
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const sessionId = getOrCreateSessionId();
    const eventId = generateEventId();
    const utms = getUTMParams();
    const fbp = getCookie('_fbp');
    const fbc = getCookie('_fbc');

    const payload = {
      event_name: eventName,
      event_id: eventId,
      session_id: sessionId,
      page: window.location.href,
      step_index: props?.step_index,
      step_id: props?.step_id,
      answer_id: props?.answer_id,
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      fbclid: utms.fbclid,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
      meta: props?.meta || {},
    };

    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('[Tracking] Erro:', error);
    // Não quebrar UI
  }
}
```

---

## C) Instrumentação nos Componentes

### Home (`app/page.tsx`)

```typescript
'use client';

import { useEffect } from 'react';
import { track } from '@/lib/tracking';

export default function HomePage() {
  useEffect(() => {
    track('home_view');
  }, []);

  const handleStartQuiz = () => {
    track('start_quiz_click');
    router.push('/quiz');
  };

  return (
    <div>
      <button onClick={handleStartQuiz}>Iniciar Quiz</button>
    </div>
  );
}
```

### Quiz (`app/quiz/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { track } from '@/lib/tracking';

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Track step view
    track('quiz_step_view', {
      step_index: currentStep,
      step_id: `step_${currentStep}`,
    });
  }, [currentStep]);

  const handleAnswer = (answerId: number) => {
    track('quiz_answer_select', {
      step_index: currentStep,
      answer_id: answerId,
    });
    setCurrentStep(currentStep + 1);
  };

  const handlePhotoUploadStart = () => {
    track('photo_upload_start');
  };

  const handlePhotoUploadSuccess = () => {
    track('photo_upload_success');
  };

  const handleQuizComplete = () => {
    track('quiz_complete');
  };

  // ... resto do componente
}
```

### VSL (`app/vsl/page.tsx`)

```typescript
'use client';

import { useEffect } from 'react';
import { track } from '@/lib/tracking';

export default function VSLPage() {
  useEffect(() => {
    track('vsl_view');
  }, []);

  const handleCheckout = () => {
    track('checkout_click');
    window.location.href = 'https://checkout.perfectpay.com.br/pay/SEU_CODIGO';
  };

  return (
    <div>
      <button onClick={handleCheckout}>Comprar Agora</button>
    </div>
  );
}
```

---

## D) Variáveis de Ambiente (.env.local)

```env
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
SUPABASE_URL=https://lwtjeqvnyytxlecxnkpw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
ALLOWED_ORIGINS=https://seu-dominio.com
PERFECTPAY_WEBHOOK_SECRET=trocar_depois
NEXT_PUBLIC_META_PIXEL_ID=trocar_depois
META_CAPI_ACCESS_TOKEN=trocar_depois
```

---

## E) Instalação

```bash
npm install @supabase/supabase-js
```

---

**Nota:** Esta é uma referência para Next.js. O projeto atual usa Astro e já está implementado conforme suas especificações.

