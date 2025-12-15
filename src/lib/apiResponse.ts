export function jsonResponse(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify({ ok: true, ...data }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonError(
  message: string,
  status = 400,
  extra?: Record<string, unknown>
) {
  return new Response(JSON.stringify({ ok: false, error: message, ...(extra || {}) }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

