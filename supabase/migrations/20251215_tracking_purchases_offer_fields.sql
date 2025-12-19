-- ═══════════════════════════════════════════════════════════════
-- Migration: Adicionar campos de produto/offer para tracking de compras
-- Adiciona: product_code, offer_type, is_bump, bump_index, affiliate_code
-- Garante: UNIQUE constraint em provider_event_id para idempotência
-- ═══════════════════════════════════════════════════════════════

-- Adicionar colunas de produto/offer
ALTER TABLE public.tracking_lmx_purchases
  ADD COLUMN IF NOT EXISTS product_code TEXT,
  ADD COLUMN IF NOT EXISTS offer_type TEXT, -- 'MAIN', 'BUMP_1', 'BUMP_2', ..., 'UNKNOWN'
  ADD COLUMN IF NOT EXISTS is_bump BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS bump_index INTEGER, -- 1-5 ou NULL
  ADD COLUMN IF NOT EXISTS affiliate_code TEXT;

-- Garantir que provider_event_id existe (se não existir, criar)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'provider_event_id'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases 
      ADD COLUMN provider_event_id TEXT;
  END IF;
END $$;

-- Garantir que raw_payload existe (se não existir, criar)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'raw_payload'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases 
      ADD COLUMN raw_payload JSONB;
  END IF;
END $$;

-- Remover constraint/index único existente se houver duplicatas (antes de recriar)
-- Primeiro, diagnosticar se há duplicatas
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Contar duplicatas de provider_event_id (apenas onde não é NULL)
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT provider_event_id, COUNT(*) as cnt
    FROM public.tracking_lmx_purchases
    WHERE provider_event_id IS NOT NULL
    GROUP BY provider_event_id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  -- Log para diagnóstico (se houver duplicatas, precisará limpar manualmente)
  IF duplicate_count > 0 THEN
    RAISE WARNING 'Found % duplicate provider_event_id values. You need to clean them manually before applying UNIQUE constraint.', duplicate_count;
    
    -- Gerar query de diagnóstico
    RAISE NOTICE 'Run this query to see duplicates:';
    RAISE NOTICE 'SELECT provider_event_id, COUNT(*) as cnt FROM public.tracking_lmx_purchases WHERE provider_event_id IS NOT NULL GROUP BY provider_event_id HAVING COUNT(*) > 1;';
  END IF;
END $$;

-- Remover índice único existente se houver (para recriar como constraint)
DROP INDEX IF EXISTS public.idx_tracking_purchases_provider_event_unique;

-- Criar UNIQUE constraint em provider_event_id (apenas onde não é NULL)
-- Usando constraint parcial (partial unique index) para permitir múltiplos NULLs
CREATE UNIQUE INDEX IF NOT EXISTS idx_tracking_purchases_provider_event_unique
  ON public.tracking_lmx_purchases(provider_event_id)
  WHERE provider_event_id IS NOT NULL;

-- Índices adicionais para queries de produto/offer
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_product_code 
  ON public.tracking_lmx_purchases(product_code) 
  WHERE product_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_offer_type 
  ON public.tracking_lmx_purchases(offer_type) 
  WHERE offer_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_is_bump 
  ON public.tracking_lmx_purchases(is_bump) 
  WHERE is_bump = TRUE;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_affiliate_code 
  ON public.tracking_lmx_purchases(affiliate_code) 
  WHERE affiliate_code IS NOT NULL;

-- Comentários para documentação
COMMENT ON COLUMN public.tracking_lmx_purchases.product_code IS 'Código do produto no provider (ex: PPPBDPJI)';
COMMENT ON COLUMN public.tracking_lmx_purchases.offer_type IS 'Tipo de oferta: MAIN, BUMP_1, BUMP_2, BUMP_3, BUMP_4, BUMP_5, ou UNKNOWN';
COMMENT ON COLUMN public.tracking_lmx_purchases.is_bump IS 'Se é um bump (oferta adicional)';
COMMENT ON COLUMN public.tracking_lmx_purchases.bump_index IS 'Índice do bump (1-5) ou NULL se não for bump';
COMMENT ON COLUMN public.tracking_lmx_purchases.affiliate_code IS 'Código de afiliado usado na oferta';
