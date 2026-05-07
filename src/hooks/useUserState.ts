import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface UserState {
  user_id: string
  first_colloquio_done: boolean
  first_colloquio_date: string | null
  percorso_active: boolean
  percorso_start_date: string | null
  percorso_level: 'basso' | 'medio' | 'alto' | null
  percorso_type: string | null
  percorso_duration: '6m' | '12m' | null
  preventivo_unlocked: boolean
  clean_date: string | null
  notes: string | null
}

const DEFAULT: Omit<UserState, 'user_id'> = {
  first_colloquio_done: false,
  first_colloquio_date: null,
  percorso_active: false,
  percorso_start_date: null,
  percorso_level: null,
  percorso_type: null,
  percorso_duration: null,
  preventivo_unlocked: false,
  clean_date: null,
  notes: null,
}

export function useUserState() {
  const userId = localStorage.getItem('sw_user_id')
  const [state, setState] = useState<UserState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const localFirstColloquio = localStorage.getItem('sw_first_colloquio_done') === 'true'

    if (!userId) {
      if (localFirstColloquio) {
        setState({ user_id: 'local', ...DEFAULT, first_colloquio_done: true })
      }
      setLoading(false)
      return
    }

    supabase
      .from('user_state')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        const base = data ?? { user_id: userId, ...DEFAULT }
        // Merge localStorage flag: se thankyou è stata visitata, first_colloquio_done è sempre true
        if (localFirstColloquio) base.first_colloquio_done = true
        setState(base)
        setLoading(false)
      })
  }, [userId])

  return { userState: state, loading }
}
