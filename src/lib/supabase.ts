import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})

// ─── Event tracker ───────────────────────────────────────────────────
export async function track(
  event_type: string,
  screen: string,
  metadata: Record<string, unknown> = {}
) {
  const user_id = localStorage.getItem('sw_user_id')
  try {
    await supabase.from('events').insert({ user_id, event_type, screen, metadata })
  } catch {}
}

// ─── Lead capture ────────────────────────────────────────────────────
export async function captureConversion(
  conversion_type: string,
  source_cta: string,
  source_screen: string
) {
  const user_id = localStorage.getItem('sw_user_id')
  try {
    await supabase.from('conversions').insert({
      user_id, conversion_type, source_cta, source_screen,
    })
  } catch {}
}
