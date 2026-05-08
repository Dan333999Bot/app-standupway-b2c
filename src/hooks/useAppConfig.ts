import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type Config = Record<string, string>

export function useAppConfig() {
  const [config, setConfig] = useState<Config>({})
  const { user, loading } = useAuth()

  useEffect(() => {
    // Aspetta che l'auth sia risolta prima di fare la query (evita RLS block)
    if (loading) return

    supabase
      .from('app_config')
      .select('key,value')
      .then(({ data, error }) => {
        if (error) {
          console.error('[useAppConfig] errore query:', error.message)
          return
        }
        if (data) {
          const map: Config = {}
          data.forEach(({ key, value }) => { if (value) map[key] = value })
          setConfig(map)
        }
      })
  }, [loading, user?.id])

  return config
}
