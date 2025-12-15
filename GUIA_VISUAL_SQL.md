    # 📸 Guia Visual - Aplicar SQL no Supabase

    ## 🎯 Passo a Passo Visual

    ### 1️⃣ Acesse o SQL Editor

    👉 **Link direto:** https://supabase.com/dashboard/project/lwtjeqvnyytxlecxnkpw/sql/new

    Ou navegue:
    - Dashboard → Seu Projeto → **SQL Editor** (menu lateral) → **"New query"**

    ---

### 2️⃣ Cole o SQL Completo

⚠️ **IMPORTANTE:** Use o arquivo `sql/tracking_tables_PURO.sql` que contém **APENAS SQL puro**, sem markdown ou comentários.

**Ou copie o SQL abaixo (sem os comentários markdown):**

```sql
CREATE TABLE IF NOT EXISTS tracking_lmx_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  fbp TEXT,
  fbc TEXT,
  fbclid TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  user_agent TEXT,
  referrer TEXT,
  landing_url TEXT,
  first_seen_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_sessions_session_id ON tracking_lmx_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_fbp ON tracking_lmx_sessions(fbp) WHERE fbp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_fbc ON tracking_lmx_sessions(fbc) WHERE fbc IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_sessions_first_seen ON tracking_lmx_sessions(first_seen_at);

CREATE TABLE IF NOT EXISTS tracking_lmx_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL REFERENCES tracking_lmx_sessions(session_id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_id TEXT UNIQUE,
  step_index INTEGER,
  step_id TEXT,
  answer_id INTEGER,
  metadata JSONB,
  page_url TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_events_session_id ON tracking_lmx_events(session_id);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_name ON tracking_lmx_events(event_name);
CREATE INDEX IF NOT EXISTS idx_tracking_events_event_id ON tracking_lmx_events(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_events_created_at ON tracking_lmx_events(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_events_step_index ON tracking_lmx_events(step_index) WHERE step_index IS NOT NULL;

CREATE TABLE IF NOT EXISTS tracking_lmx_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT REFERENCES tracking_lmx_sessions(session_id) ON DELETE SET NULL,
  order_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  purchase_aprovada BOOLEAN DEFAULT FALSE,
  event_id TEXT UNIQUE,
  raw_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tracking_purchases_session_id ON tracking_lmx_purchases(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_order_id ON tracking_lmx_purchases(order_id);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_status ON tracking_lmx_purchases(status);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_event_id ON tracking_lmx_purchases(event_id) WHERE event_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_created_at ON tracking_lmx_purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_tracking_purchases_aprovada ON tracking_lmx_purchases(purchase_aprovada) WHERE purchase_aprovada = TRUE;

CREATE OR REPLACE FUNCTION update_tracking_session_last_seen()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tracking_lmx_sessions
  SET last_seen_at = NOW()
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_last_seen
AFTER INSERT ON tracking_lmx_events
FOR EACH ROW
EXECUTE FUNCTION update_tracking_session_last_seen();
```

    ---

    ### 3️⃣ Execute o SQL

    Clique no botão **"Run"** (ou pressione `Cmd/Ctrl + Enter`)

    ---

    ### 4️⃣ Verificar Resultado

    Execute esta query para confirmar:

    ```sql
    -- Verificar tabelas criadas
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name LIKE 'tracking_lmx%';
    ```

    **Resultado esperado:**
    ```
    tracking_lmx_sessions
    tracking_lmx_events
    tracking_lmx_purchases
    ```

    ---

    ## ✅ Pronto!

    As 3 tabelas foram criadas com todos os índices e triggers necessários.

    ---

    **Arquivo original:** `sql/tracking_tables.sql`

