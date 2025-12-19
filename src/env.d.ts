/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FB_PIXEL_ID: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_SITE_NAME: string;
  readonly PUBLIC_GA_ID: string;
  
  // Database
  readonly DATABASE_URL: string;
  
  // Meta/Facebook Conversions API (server-only, never exposed to client)
  readonly META_CAPI_ACCESS_TOKEN: string;
  
  // Webhooks
  readonly PERFECTPAY_WEBHOOK_SECRET: string; // Secret para validação do webhook PerfectPay (server-only)
  
  // Admin
  readonly ADMIN_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export {};

