-- Enable RLS and revoke anon/authenticated for tracking tables

-- tracking_lmx_sessions
ALTER TABLE public.tracking_lmx_sessions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tracking_lmx_sessions FROM anon, authenticated;

-- tracking_lmx_events
ALTER TABLE public.tracking_lmx_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tracking_lmx_events FROM anon, authenticated;

-- tracking_lmx_purchases
ALTER TABLE public.tracking_lmx_purchases ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.tracking_lmx_purchases FROM anon, authenticated;

-- Note: service_role bypasses RLS; backend using service_role will continuar inserindo normalmente.

