-- ═══════════════════════════════════════════════════════════════
-- Migration: Adicionar colunas faltantes em tracking_lmx_purchases
-- Garante que todas as colunas usadas pelo webhook PerfectPay existam
-- ═══════════════════════════════════════════════════════════════

-- Adicionar colunas faltantes (usando IF NOT EXISTS para não quebrar)
ALTER TABLE public.tracking_lmx_purchases
  ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
  ADD COLUMN IF NOT EXISTS product_code TEXT,
  ADD COLUMN IF NOT EXISTS offer_key TEXT;

-- Também garantir outras colunas que podem estar faltando
ALTER TABLE public.tracking_lmx_purchases
  ADD COLUMN IF NOT EXISTS offer_type TEXT,
  ADD COLUMN IF NOT EXISTS is_bump BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bump_index INTEGER,
  ADD COLUMN IF NOT EXISTS provider_event_id TEXT,
  ADD COLUMN IF NOT EXISTS raw_payload JSONB;

-- Comentários para documentação
COMMENT ON COLUMN public.tracking_lmx_purchases.affiliate_code IS 'Código de afiliado usado na oferta';
COMMENT ON COLUMN public.tracking_lmx_purchases.product_code IS 'Código do produto no provider (ex: PPPBDPJI)';
COMMENT ON COLUMN public.tracking_lmx_purchases.offer_key IS 'Chave da oferta: MAIN, BUMP_1, BUMP_2, BUMP_3, BUMP_4, BUMP_5, ou UNKNOWN';
COMMENT ON COLUMN public.tracking_lmx_purchases.offer_type IS 'Tipo de oferta (alias para offer_key para compatibilidade)';
