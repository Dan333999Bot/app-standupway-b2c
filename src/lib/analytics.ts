import { supabase } from './supabase'

/* ─── Session & identity ─────────────────────────────────────────── */

function getSessionId(): string {
  let sid = sessionStorage.getItem('sw_session_id')
  if (!sid) {
    sid = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    sessionStorage.setItem('sw_session_id', sid)
  }
  return sid
}

function getUserId(): string | null {
  return localStorage.getItem('sw_user_id')
}

/* ─── UTM capture ────────────────────────────────────────────────── */

export function captureUTM() {
  const params = new URLSearchParams(window.location.search)
  const utm: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const v = params.get(key)
    if (v) utm[key] = v
  }
  if (Object.keys(utm).length > 0) {
    localStorage.setItem('sw_utm', JSON.stringify(utm))
    localStorage.setItem('sw_referrer', document.referrer || 'direct')
  }
  return utm
}

function getUTM(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('sw_utm') || '{}')
  } catch {
    return {}
  }
}

function isFirstVisit(): boolean {
  const key = 'sw_first_visit_done'
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, '1')
    return true
  }
  return false
}

/* ─── Core insert ────────────────────────────────────────────────── */

async function insert(event_type: string, screen: string, metadata: Record<string, unknown> = {}) {
  try {
    await supabase.from('events').insert({
      user_id: getUserId(),
      event_type,
      screen,
      metadata: {
        ...metadata,
        session_id: getSessionId(),
        utm: getUTM(),
        referrer: localStorage.getItem('sw_referrer') || document.referrer || 'direct',
        path: window.location.pathname,
        ts: new Date().toISOString(),
      },
    })
  } catch {}
}

/* ─── Public API ─────────────────────────────────────────────────── */

export async function trackPage(screen: string, extra: Record<string, unknown> = {}) {
  captureUTM()
  await insert('screen_view', screen, {
    ...extra,
    first_visit: isFirstVisit(),
    user_agent: navigator.userAgent.slice(0, 120),
  })
}

export async function trackEvent(event_type: string, screen: string, metadata: Record<string, unknown> = {}) {
  await insert(event_type, screen, metadata)
}

export async function trackCta(label: string, screen: string, extra: Record<string, unknown> = {}) {
  await insert('cta_click', screen, { label, ...extra })
  try {
    await supabase.from('conversions').insert({
      user_id: getUserId(),
      conversion_type: label,
      source_cta: screen,
      source_screen: screen,
    })
  } catch {}
}

export async function trackFunnel(funnel: string, step: string, metadata: Record<string, unknown> = {}) {
  await insert('funnel_step', funnel, { step, ...metadata })
}

export async function trackScroll(screen: string, depth: number) {
  await insert('scroll_depth', screen, { depth_pct: depth })
}

export async function trackAbandonment(screen: string, metadata: Record<string, unknown> = {}) {
  await insert('page_abandon', screen, metadata)
}
