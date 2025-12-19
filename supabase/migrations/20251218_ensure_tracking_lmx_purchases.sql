-- ═══════════════════════════════════════════════════════════════
-- Migration: Garantir estrutura completa de tracking_lmx_purchases
-- Esta migration é idempotente e pode ser executada múltiplas vezes
-- Garante todas as colunas necessárias para o webhook PerfectPay
-- ═══════════════════════════════════════════════════════════════

-- Criar tabela se não existir
CREATE TABLE IF NOT EXISTS public.tracking_lmx_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar colunas básicas (se não existirem)
DO $$
BEGIN
  -- session_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'session_id'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN session_id TEXT;
  END IF;

  -- order_id (obrigatório, único)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'order_id'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN order_id TEXT NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS idx_tracking_purchases_order_id ON public.tracking_lmx_purchases(order_id);
  END IF;

  -- status (obrigatório)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN status TEXT NOT NULL DEFAULT 'unknown';
  END IF;

  -- total_value (NOT NULL, DEFAULT 0) - CRÍTICO
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'total_value'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN total_value NUMERIC(10, 2) NOT NULL DEFAULT 0;
  ELSE
    -- Se existe mas permite NULL, ajustar
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = 'tracking_lmx_purchases' 
      AND column_name = 'total_value'
      AND is_nullable = 'YES'
    ) THEN
      -- Atualizar NULLs para 0
      UPDATE public.tracking_lmx_purchases SET total_value = 0 WHERE total_value IS NULL;
      -- Alterar para NOT NULL
      ALTER TABLE public.tracking_lmx_purchases ALTER COLUMN total_value SET NOT NULL;
      ALTER TABLE public.tracking_lmx_purchases ALTER COLUMN total_value SET DEFAULT 0;
    END IF;
  END IF;

  -- amount (opcional, pode ser NULL)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'amount'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN amount NUMERIC(10, 2);
  END IF;

  -- currency
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN currency TEXT DEFAULT 'BRL';
  END IF;
END $$;

-- Adicionar colunas do provider
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'provider'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN provider TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'provider_event_id'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN provider_event_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'event_type'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN event_type TEXT;
  END IF;
END $$;

-- Adicionar colunas de produto/offer
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'product_code'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN product_code TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'offer_type'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN offer_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'offer_key'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN offer_key TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'is_bump'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN is_bump BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'bump_index'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN bump_index INTEGER;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'affiliate_code'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN affiliate_code TEXT;
  END IF;
END $$;

-- Adicionar raw_payload
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'raw_payload'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN raw_payload JSONB;
  END IF;
END $$;

-- Garantir UNIQUE constraint em provider_event_id para idempotência
DO $$
BEGIN
  -- Remover índice único existente se houver duplicatas (antes de recriar)
  IF EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE schemaname = 'public' 
    AND tablename = 'tracking_lmx_purchases' 
    AND indexname = 'idx_tracking_purchases_provider_event_unique'
  ) THEN
    -- Index já existe, não fazer nada
    NULL;
  ELSE
    -- Criar índice único parcial (permite múltiplos NULLs)
    CREATE UNIQUE INDEX idx_tracking_purchases_provider_event_unique
      ON public.tracking_lmx_purchases(provider_event_id)
      WHERE provider_event_id IS NOT NULL;
  END IF;
END $$;

-- Criar índices para performance (se não existirem)
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_session_id 
  ON public.tracking_lmx_purchases(session_id) 
  WHERE session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_status 
  ON public.tracking_lmx_purchases(status);

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_product_code 
  ON public.tracking_lmx_purchases(product_code) 
  WHERE product_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_offer_type 
  ON public.tracking_lmx_purchases(offer_type) 
  WHERE offer_type IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_affiliate_code 
  ON public.tracking_lmx_purchases(affiliate_code) 
  WHERE affiliate_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_created_at 
  ON public.tracking_lmx_purchases(created_at);

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_provider 
  ON public.tracking_lmx_purchases(provider) 
  WHERE provider IS NOT NULL;

-- Comentários para documentação
COMMENT ON TABLE public.tracking_lmx_purchases IS 'Tabela de compras rastreadas via webhooks (PerfectPay e outros providers)';
COMMENT ON COLUMN public.tracking_lmx_purchases.provider IS 'Provider do pagamento (ex: perfectpay)';
COMMENT ON COLUMN public.tracking_lmx_purchases.provider_event_id IS 'ID único do evento no provider (para idempotência)';
COMMENT ON COLUMN public.tracking_lmx_purchases.total_value IS 'Valor total da compra (NOT NULL, DEFAULT 0)';
COMMENT ON COLUMN public.tracking_lmx_purchases.amount IS 'Valor da compra (opcional, pode ser NULL)';
COMMENT ON COLUMN public.tracking_lmx_purchases.currency IS 'Moeda da compra (padrão: BRL)';
COMMENT ON COLUMN public.tracking_lmx_purchases.product_code IS 'Código do produto no provider (ex: PPPBDPJI)';
COMMENT ON COLUMN public.tracking_lmx_purchases.offer_type IS 'Tipo de oferta: MAIN, BUMP_1, BUMP_2, BUMP_3, BUMP_4, BUMP_5, ou UNKNOWN';
COMMENT ON COLUMN public.tracking_lmx_purchases.offer_key IS 'Chave da oferta (alias para offer_type)';
COMMENT ON COLUMN public.tracking_lmx_purchases.is_bump IS 'Se é um bump (oferta adicional)';
COMMENT ON COLUMN public.tracking_lmx_purchases.bump_index IS 'Índice do bump (1-5) ou NULL se não for bump';
COMMENT ON COLUMN public.tracking_lmx_purchases.affiliate_code IS 'Código de afiliado usado na oferta';
