/**
 * ═══════════════════════════════════════════════════════════════
 * API ENDPOINT: POST /api/track/event
 * Unified event tracking for GA4, Facebook CAPI, and internal analytics
 * ═══════════════════════════════════════════════════════════════
 */

import type { APIRoute } from 'astro';

// Disable prerendering for this route (server-side only)
export const prerender = false;

export interface TrackEventPayload {
  event: string;
  user_id?: string;
  quiz_step?: string;
  metadata?: Record<string, any>;
  timestamp?: number;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const data: TrackEventPayload = await request.json();

    const eventRecord = {
      ...data,
      timestamp: data.timestamp || Date.now(),
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer'),
    };

    console.log('[API/track/event]', eventRecord);

    // TODO: Send to Facebook CAPI
    // TODO: Send to Google Analytics Measurement Protocol
    // TODO: Store in database for internal analytics

    return new Response(JSON.stringify({ 
      success: true,
      event_id: `evt_${Date.now()}`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('[API/track/event] Error:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

