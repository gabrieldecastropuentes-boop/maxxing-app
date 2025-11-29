/**
 * ═══════════════════════════════════════════════════════════════
 * API UTILITIES - Lead Tracking, Facebook CAPI, Results
 * Integração completa sem alterar layout existente
 * ═══════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════
// TIPOS E INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface LeadData {
  name?: string;
  email: string;
  phone?: string;
  quiz_id?: string;
  user_id: string;
  source: 'quiz' | 'paywall' | 'landing' | 'popup';
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

export interface QuizResultData {
  user_id: string;
  quiz_id: string;
  answers: Array<{ questionId: number; answerId: number; score: number }>;
  score: number;
  image_reference?: string;
  gender: 'male' | 'female';
  timestamp: string;
}

export interface FacebookEventData {
  event_name: 'Lead' | 'ViewContent' | 'Subscribe' | 'Purchase' | 'InitiateCheckout' | 'CompleteRegistration';
  event_time: number;
  event_source_url: string;
  user_data: {
    em?: string; // hashed email
    ph?: string; // hashed phone
    client_ip_address?: string;
    client_user_agent?: string;
    fbc?: string;
    fbp?: string;
  };
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    quiz_score?: number;
  };
}

export interface ProductRecommendation {
  id: string;
  title: string;
  price: number;
  link: string;
  affiliates?: string[];
  fit_score: number;
  category: 'skincare' | 'haircare' | 'supplement' | 'grooming';
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÕES DE HASH (para Facebook CAPI)
// ═══════════════════════════════════════════════════════════════

async function sha256(message: string): Promise<string> {
  if (typeof window === 'undefined') return message;
  const msgBuffer = new TextEncoder().encode(message.toLowerCase().trim());
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ═══════════════════════════════════════════════════════════════
// API DE LEADS
// ═══════════════════════════════════════════════════════════════

export async function captureLead(data: LeadData): Promise<{ lead_id: string; status: string }> {
  console.log('[API] POST /api/leads:', data);
  
  // Simular resposta enquanto backend não está pronto
  // Substituir por fetch real quando endpoint estiver disponível
  /*
  const response = await fetch('/api/leads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
  */
  
  // Salvar localmente para debug
  if (typeof localStorage !== 'undefined') {
    const leads = JSON.parse(localStorage.getItem('captured_leads') || '[]');
    leads.push({ ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('captured_leads', JSON.stringify(leads));
  }
  
  return {
    lead_id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'captured'
  };
}

// ═══════════════════════════════════════════════════════════════
// API DE RESULTADOS DO QUIZ
// ═══════════════════════════════════════════════════════════════

export async function saveQuizResult(data: QuizResultData): Promise<{ result_id: string; recommended_plan: string }> {
  console.log('[API] POST /api/quiz/result:', data);
  
  // Simular resposta
  /*
  const response = await fetch('/api/quiz/result', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
  */
  
  // Salvar localmente
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('quiz_result', JSON.stringify(data));
  }
  
  return {
    result_id: `result_${data.quiz_id}_${Date.now()}`,
    recommended_plan: data.score > 70 ? 'premium' : data.score > 50 ? 'standard' : 'basic'
  };
}

// ═══════════════════════════════════════════════════════════════
// FACEBOOK CONVERSION API (CAPI)
// ═══════════════════════════════════════════════════════════════

export async function sendFacebookEvent(eventData: Partial<FacebookEventData>): Promise<void> {
  const event: FacebookEventData = {
    event_name: eventData.event_name || 'ViewContent',
    event_time: eventData.event_time || Math.floor(Date.now() / 1000),
    event_source_url: typeof window !== 'undefined' ? window.location.href : '',
    user_data: {
      client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
      ...eventData.user_data
    },
    custom_data: eventData.custom_data
  };

  console.log('[CAPI] Facebook Event:', event);

  // Enviar para backend que fará a chamada real ao Facebook
  /*
  await fetch('/api/facebook/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
  });
  */
  
  // Também enviar via Pixel do lado do cliente se disponível
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', event.event_name, event.custom_data);
  }
}

// ═══════════════════════════════════════════════════════════════
// API DE RECOMENDAÇÕES DE PRODUTOS
// ═══════════════════════════════════════════════════════════════

export async function getProductRecommendations(userId: string): Promise<ProductRecommendation[]> {
  console.log('[API] GET /api/product-recommendations?user_id=' + userId);
  
  // Simulação de produtos recomendados
  // Substituir por fetch real
  /*
  const response = await fetch(`/api/product-recommendations?user_id=${userId}`);
  return response.json();
  */
  
  return [
    { id: 'p1', title: 'Gel Esfoliante BHA 2%', price: 49.90, link: '#', fit_score: 95, category: 'skincare' },
    { id: 'p2', title: 'Niacinamida The Ordinary', price: 89.90, link: '#', fit_score: 100, category: 'skincare' },
    { id: 'p3', title: 'CeraVe Hidratante', price: 79.90, link: '#', fit_score: 92, category: 'skincare' },
  ];
}

// ═══════════════════════════════════════════════════════════════
// API DE REAVALIAÇÃO MENSAL
// ═══════════════════════════════════════════════════════════════

export async function scheduleReevaluation(userId: string, resultId: string): Promise<{ scheduled: boolean }> {
  console.log('[API] POST /api/reval:', { user_id: userId, result_id: resultId, reval_type: 'monthly' });
  
  /*
  const response = await fetch('/api/reval', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, result_id: resultId, reval_type: 'monthly' }),
  });
  return response.json();
  */
  
  return { scheduled: true };
}

// ═══════════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════════

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export function generateUserId(): string {
  if (typeof localStorage !== 'undefined') {
    let userId = localStorage.getItem('maxxing_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem('maxxing_user_id', userId);
    }
    return userId;
  }
  return `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
  };
}

// ═══════════════════════════════════════════════════════════════
// TRACKING DE EVENTOS SIMPLIFICADO
// ═══════════════════════════════════════════════════════════════

export function trackEvent(eventName: string, data?: Record<string, any>): void {
  console.log(`[Track] ${eventName}:`, data);
  
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, data);
  }
  
  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', eventName, data);
  }
}

