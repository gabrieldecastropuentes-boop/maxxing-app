// ═══════════════════════════════════════════════════════════════
// Tracking System - Métricas Práticas para o Quiz
// Pseudônimo: session_id + fbp/fbc + UTMs (sem email/telefone)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SESSION ID (UUID salvo no localStorage)
// ═══════════════════════════════════════════════════════════════

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  const stored = localStorage.getItem('session_id');
  if (stored) return stored;
  
  const newId = generateSessionId();
  localStorage.setItem('session_id', newId);
  return newId;
}

// ═══════════════════════════════════════════════════════════════
// CAPTURAR UTMs E PARÂMETROS
// ═══════════════════════════════════════════════════════════════

function getUTMParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utms: Record<string, string> = {};
  
  // UTMs
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) utms[key] = value;
  });
  
  // Facebook Click ID
  const fbclid = params.get('fbclid');
  if (fbclid) utms.fbclid = fbclid;
  
  // Salvar UTMs no sessionStorage para persistir durante a sessão
  if (Object.keys(utms).length > 0) {
    sessionStorage.setItem('utm_params', JSON.stringify(utms));
  } else {
    // Tentar recuperar do sessionStorage se não estiver na URL
    const stored = sessionStorage.getItem('utm_params');
    if (stored) {
      try {
        Object.assign(utms, JSON.parse(stored));
      } catch {}
    }
  }
  
  return utms;
}

// ═══════════════════════════════════════════════════════════════
// CAPTURAR COOKIES DO FACEBOOK
// ═══════════════════════════════════════════════════════════════

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function getFacebookCookies(): { fbp?: string; fbc?: string } {
  return {
    fbp: getCookie('_fbp') || undefined,
    fbc: getCookie('_fbc') || undefined,
  };
}

// ═══════════════════════════════════════════════════════════════
// TIPOS DE EVENTOS
// ═══════════════════════════════════════════════════════════════

export type TrackingEvent =
  | 'home_view'
  | 'start_quiz_click'
  | 'quiz_step_view'
  | 'quiz_answer_select'
  | 'photo_upload_start'
  | 'photo_upload_success'
  | 'photo_upload_skip'
  | 'photo_upload_error'
  | 'quiz_complete'
  | 'vsl_view'
  | 'checkout_click';

export interface TrackingData {
  // Evento específico
  event: TrackingEvent;
  
  // Dados do evento (opcionais)
  step_index?: number;
  step_id?: string;
  answer_id?: number;
  
  // Metadados adicionais
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Gerar Event ID (UUID para dedup Meta Pixel/CAPI)
// ═══════════════════════════════════════════════════════════════

function generateEventId(): string {
  // Gerar UUID v4 simples
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ═══════════════════════════════════════════════════════════════
// FUNÇÃO PRINCIPAL DE TRACKING
// ═══════════════════════════════════════════════════════════════

export async function trackEvent(event: TrackingEvent, data?: Partial<TrackingData>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionId = getOrCreateSessionId();
    const utms = getUTMParams();
    const fbCookies = getFacebookCookies();
    const eventId = generateEventId(); // Gerar event_id para dedup
    
    const payload = {
      event_name: event,
      event_id: eventId, // UUID para dedup Meta Pixel/CAPI
      session_id: sessionId,
      page: window.location.href,
      
      // Dados do evento
      ...(data?.step_index !== undefined && { step_index: data.step_index }),
      ...(data?.step_id && { step_id: data.step_id }),
      ...(data?.answer_id !== undefined && { answer_id: data.answer_id }),
      
      // UTMs e parâmetros
      utm_source: utms.utm_source,
      utm_medium: utms.utm_medium,
      utm_campaign: utms.utm_campaign,
      utm_content: utms.utm_content,
      utm_term: utms.utm_term,
      fbclid: utms.fbclid,
      
      // Cookies do Facebook
      fbp: fbCookies.fbp,
      fbc: fbCookies.fbc,
      
      // Metadados adicionais
      ...(data?.metadata && { meta: data.metadata }),
    };
    
    // Enviar para o endpoint
    const response = await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    // Se tiver Pixel configurado, também disparar no browser (com mesmo event_id)
    if (typeof window !== 'undefined' && (window as any).trackFacebookEvent) {
      const fbEventName = mapEventToFacebook(event);
      if (fbEventName) {
        (window as any).trackFacebookEvent(fbEventName, {
          content_name: event,
          ...data?.metadata,
        }, eventId);
      }
    }
    
    // Log no console (apenas em desenvolvimento)
    if (import.meta.env.DEV) {
      console.log('[Tracking]', event, { event_id: eventId });
    }
  } catch (error) {
    // Não bloquear a UI se tracking falhar
    console.error('[Tracking] Erro ao enviar evento:', error);
  }
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Mapear eventos para formato Facebook
// ═══════════════════════════════════════════════════════════════

function mapEventToFacebook(event: TrackingEvent): string | null {
  const eventMap: Record<string, string> = {
    home_view: 'PageView',
    start_quiz_click: 'ViewContent',
    quiz_step_view: 'ViewContent',
    quiz_answer_select: 'ViewContent',
    quiz_complete: 'CompleteRegistration',
    photo_upload_start: 'ViewContent',
    photo_upload_success: 'ViewContent',
    photo_upload_skip: 'ViewContent',
    photo_upload_error: 'ViewContent',
    vsl_view: 'ViewContent',
    checkout_click: 'InitiateCheckout',
  };
  
  return eventMap[event] || null;
}

// ═══════════════════════════════════════════════════════════════
// HELPERS ESPECÍFICOS PARA CADA EVENTO
// ═══════════════════════════════════════════════════════════════

export const tracking = {
  // Home
  homeView: () => trackEvent('home_view'),
  
  // Quiz
  startQuizClick: () => trackEvent('start_quiz_click'),
  quizStepView: (stepIndex: number, stepId?: string) =>
    trackEvent('quiz_step_view', { step_index: stepIndex, step_id: stepId }),
  quizAnswerSelect: (stepIndex: number, answerId: number) =>
    trackEvent('quiz_answer_select', { step_index: stepIndex, answer_id: answerId }),
  quizComplete: (metadata?: Record<string, any>) =>
    trackEvent('quiz_complete', { metadata }),
  
  // Photo Upload
  photoUploadStart: () => trackEvent('photo_upload_start'),
  photoUploadSuccess: () => trackEvent('photo_upload_success'),
  photoUploadSkip: () => trackEvent('photo_upload_skip'),
  photoUploadError: (error?: string) =>
    trackEvent('photo_upload_error', { metadata: { error } }),
  
  // VSL e Checkout
  vslView: () => trackEvent('vsl_view'),
  checkoutClick: () => trackEvent('checkout_click'),
};

// ═══════════════════════════════════════════════════════════════
// INICIALIZAÇÃO AUTOMÁTICA
// ═══════════════════════════════════════════════════════════════

// Capturar UTMs na primeira carga da página
if (typeof window !== 'undefined') {
  getUTMParams();
}

