# 📄 Primeiras ~40 Linhas de `src/pages/api/track.ts`

## Código (sem keys sensíveis)

```typescript
/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/track
 * Recebe eventos do browser, enriquece no server e salva no Supabase
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';
import { supabaseServer } from '../../lib/supabase-server';

export const prerender = false;

export interface TrackEventPayload {
  // Evento
  event_name: string; // 'home_view', 'quiz_step_view', etc.
  event_id: string; // UUID gerado no frontend (para dedup Meta)
  session_id: string; // UUID do localStorage
  
  // Dados do evento
  step_index?: number;
  step_id?: string;
  answer_id?: number;
  
  // Page/URL
  page?: string; // URL da página
  
  // UTMs e parâmetros
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  
  // Facebook Cookies
  fbp?: string; // Facebook Pixel Browser ID
  fbc?: string; // Facebook Click ID
  
  // Metadados
  meta?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════
// HELPER: Validar CORS
// ═══════════════════════════════════════════════════════════════
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  const allowedOrigins = (import.meta.env.ALLOWED_ORIGINS || import.meta.env.PUBLIC_SITE_URL || '').split(',').map(o => o.trim());
  
  if (allowedOrigins.length === 0) {
    // Se não configurado, aceitar qualquer origem em dev
    return import.meta.env.DEV;
  }
  
  return allowedOrigins.some(allowed => origin.startsWith(allowed));
}
```

---

## 📝 Resumo

- **Interface:** `TrackEventPayload` define o formato dos eventos
- **CORS:** Validação de origem permitida via `ALLOWED_ORIGINS`
- **Supabase:** Usa `supabaseServer` (SERVICE_ROLE_KEY) para salvar dados
- **Sem keys:** Nenhuma key sensível exposta no código

---

**Arquivo completo:** `src/pages/api/track.ts`

