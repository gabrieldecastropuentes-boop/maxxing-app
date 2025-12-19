-- ═══════════════════════════════════════════════════════════════
-- Migration: Ajustar tracking_lmx_purchases para webhook PerfectPay
-- Adiciona colunas: provider, provider_event_id, event_type
-- Ajusta: amount (renomeia total_value para amount ou adiciona amount)
-- ═══════════════════════════════════════════════════════════════

-- Adicionar colunas faltantes
ALTER TABLE public.tracking_lmx_purchases
  ADD COLUMN IF NOT EXISTS provider TEXT,
  ADD COLUMN IF NOT EXISTS provider_event_id TEXT,
  ADD COLUMN IF NOT EXISTS event_type TEXT;

-- Se total_value existe mas amount não, adicionar amount e migrar dados
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'total_value'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'tracking_lmx_purchases' 
    AND column_name = 'amount'
  ) THEN
    ALTER TABLE public.tracking_lmx_purchases ADD COLUMN amount DECIMAL(10, 2);
    UPDATE public.tracking_lmx_purchases SET amount = total_value WHERE amount IS NULL;
  END IF;
END $$;

-- Se amount não existe, criar
ALTER TABLE public.tracking_lmx_purchases
  ADD COLUMN IF NOT EXISTS amount DECIMAL(10, 2);

-- Índices para idempotência e queries
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_provider_event_id 
  ON public.tracking_lmx_purchases(provider_event_id) 
  WHERE provider_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_provider 
  ON public.tracking_lmx_purchases(provider) 
  WHERE provider IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_event_type 
  ON public.tracking_lmx_purchases(event_type) 
  WHERE event_type IS NOT NULL;

-- Constraint para idempotência: provider_event_id deve ser único por provider
-- (ou usar UNIQUE se não houver múltiplos providers)
-- Nota: Se você usar múltiplos providers, considere UNIQUE(provider, provider_event_id)
CREATE UNIQUE INDEX IF NOT EXISTS idx_tracking_purchases_provider_event_unique
  ON public.tracking_lmx_purchases(provider_event_id)
  WHERE provider_event_id IS NOT NULL;

-- Comentários para documentação
COMMENT ON COLUMN public.tracking_lmx_purchases.provider IS 'Provider do pagamento (ex: perfectpay)';
COMMENT ON COLUMN public.tracking_lmx_purchases.provider_event_id IS 'ID único do evento no provider (para idempotência)';
COMMENT ON COLUMN public.tracking_lmx_purchases.event_type IS 'Tipo do evento do provider (ex: approved, refused)';
COMMENT ON COLUMN public.tracking_lmx_purchases.amount IS 'Valor da compra (pode ser NULL se não informado)';

