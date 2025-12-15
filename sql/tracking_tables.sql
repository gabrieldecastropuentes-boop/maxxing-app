-- ═══════════════════════════════════════════════════════════════
-- TRACKING TABLES - Analytics Agregado (Pseudônimo)
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════
-- TABLE: tracking_lmx_sessions
-- Sessões de tracking (chave de ligação: session_id + fbp/fbc + utms)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tracking_lmx_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  
  -- Identificadores para match futuro
  fbp TEXT, -- Facebook Pixel Browser ID
  fbc TEXT, -- Facebook Click ID
  fbclid TEXT, -- Facebook Click ID (URL param)
  
  -- UTMs
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  
  -- Metadados da sessão
  user_agent TEXT,
  referrer TEXT,
  landing_url TEXT,
  
  -- Timestamps
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tracking_lmx_sessions
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_session_id ON tracking_lmx_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_fbp ON tracking_lmx_sessions(fbp) WHERE fbp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_fbc ON tracking_lmx_sessions(fbc) WHERE fbc IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_first_seen ON tracking_lmx_sessions(first_seen_at);

-- ═══════════════════════════════════════════════════════════════
-- TABLE: tracking_lmx_events
-- Eventos de tracking (analytics agregado)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tracking_lmx_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES tracking_lmx_sessions(session_id) ON DELETE CASCADE,
  
  -- Evento
  event_name TEXT NOT NULL, -- 'home_view', 'quiz_step_view', etc.
  event_id TEXT UNIQUE, -- Para dedup Meta Pixel/CAPI
  
  -- Dados do evento
  step_index INTEGER,
  step_id TEXT,
  answer_id INTEGER, -- OK para analytics agregado
  
  -- Metadados
  metadata JSONB, -- Dados adicionais do evento
  page_url TEXT,
  referrer TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tracking_lmx_events
CREATE INDEX IF NOT EXISTS idx_tracking_events_session_id ON tracking_lmx_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_name ON tracking_lmx_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_id ON tracking_lmx_events(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_lmx_events(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_events_step_index ON tracking_lmx_events(step_index) WHERE step_index IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════
-- TABLE: tracking_lmx_purchases
-- Compras vinculadas a sessões (para match futuro)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS tracking_lmx_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES tracking_lmx_sessions(session_id) ON DELETE SET NULL,
  
  -- Dados da compra
  order_id TEXT UNIQUE NOT NULL, -- ID da transação no gateway
  status TEXT NOT NULL, -- 'approved', 'refused', 'refunded', etc.
  total_value DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  purchase_aprovada BOOLEAN DEFAULT FALSE,
  
  -- Event ID para dedup Meta
  event_id TEXT UNIQUE,
  
  -- Payload completo do webhook
  raw_payload JSONB,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para tracking_lmx_purchases
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_session_id ON tracking_lmx_purchases(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_order_id ON tracking_lmx_purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_status ON tracking_lmx_purchases(status);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_event_id ON tracking_lmx_purchases(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_created_at ON tracking_lmx_purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_aprovada ON tracking_lmx_purchases(purchase_aprovada) WHERE purchase_aprovada = TRUE;

-- ═══════════════════════════════════════════════════════════════
-- FUNÇÃO: Atualizar last_seen_at automaticamente
-- ═══════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION update_tracking_session_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tracking_lmx_sessions
  SET last_seen_at = NOW()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar last_seen_at quando evento é criado
CREATE TRIGGER trigger_update_session_last_seen
AFTER INSERT ON tracking_lmx_events
FOR EACH ROW
EXECUTE FUNCTION update_tracking_session_last_seen();

-- ═══════════════════════════════════════════════════════════════
-- COMENTÁRIOS FINAIS
-- ═══════════════════════════════════════════════════════════════
-- Execute este script no Supabase SQL Editor
-- As tabelas serão criadas com todos os índices necessários
-- A função de trigger atualiza automaticamente last_seen_at

