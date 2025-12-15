-- Views para funil e sessões (adaptar se colunas UTM existirem)
-- Pressupõe:
-- tracking_lmx_events: event_name, created_at, step_id, metadata JSONB
-- UTMs podem estar em colunas próprias ou dentro de metadata->'utm'

CREATE OR REPLACE VIEW v_funnel_7d_by_campaign AS
SELECT
  COALESCE(
    metadata->'utm'->>'utm_campaign',
    metadata->>'utm_campaign',
    'unknown'
  ) AS utm_campaign,
  COUNT(*) FILTER (WHERE event_name = 'landing_view')        AS landing_view,
  COUNT(*) FILTER (WHERE event_name = 'quiz_complete')       AS quiz_complete,
  COUNT(*) FILTER (WHERE event_name = 'paywall_view')        AS paywall_view,
  COUNT(*) FILTER (WHERE event_name = 'checkout_click')      AS checkout_click
FROM public.tracking_lmx_events
WHERE created_at >= now() - interval '7 days'
GROUP BY 1
ORDER BY landing_view DESC NULLS LAST;

CREATE OR REPLACE VIEW v_dropoff_by_step_7d AS
SELECT
  step_id,
  COUNT(*) FILTER (WHERE event_name = 'quiz_step_view')   AS step_view,
  COUNT(*) FILTER (WHERE event_name = 'quiz_answer_select') AS step_answer
FROM public.tracking_lmx_events
WHERE created_at >= now() - interval '7 days'
GROUP BY step_id
ORDER BY step_view DESC NULLS LAST;

CREATE OR REPLACE VIEW v_sessions_7d AS
SELECT
  COALESCE(
    metadata->'utm'->>'utm_source',
    metadata->>'utm_source',
    'unknown'
  ) AS utm_source,
  COALESCE(
    metadata->'utm'->>'utm_campaign',
    metadata->>'utm_campaign',
    'unknown'
  ) AS utm_campaign,
  COUNT(DISTINCT session_id) AS sessions
FROM public.tracking_lmx_events
WHERE created_at >= now() - interval '7 days'
GROUP BY 1, 2
ORDER BY sessions DESC NULLS LAST;

