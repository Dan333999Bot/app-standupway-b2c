import { supabase } from './supabase'

/* ─── Session V2 ─────────────────────────────────────────────────── */

function getSessionId(): string {
  let sid = sessionStorage.getItem('sw_v2_session_id')
  if (!sid) {
    sid = `v2_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('sw_v2_session_id', sid)
  }
  return sid
}

/* ─── Core insert (writes to funnel_v2_events) ───────────────────── */

async function insert(event_type: string, screen: string, metadata: Record<string, unknown> = {}) {
  try {
    await supabase.from('funnel_v2_events').insert({
      session_id: getSessionId(),
      event_type,
      screen,
      metadata: {
        ...metadata,
        path: window.location.pathname,
        ts: new Date().toISOString(),
      },
    })
  } catch {}
}

/* ─── Public API (mirrors analytics.ts) ─────────────────────────── */

export async function trackPage(screen: string, extra: Record<string, unknown> = {}) {
  await insert('screen_view', screen, extra)
}

export async function trackEvent(event_type: string, screen: string, metadata: Record<string, unknown> = {}) {
  await insert(event_type, screen, metadata)
}

export async function trackFunnel(funnel: string, step: string, metadata: Record<string, unknown> = {}) {
  await insert('funnel_step', funnel, { step, ...metadata })
}
