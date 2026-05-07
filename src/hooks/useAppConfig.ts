import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Config = Record<string, string>

let cache: Config | null = null

export function useAppConfig() {
  const [config, setConfig] = useState<Config>(cache ?? {})

  useEffect(() => {
    if (cache) return
    supabase
      .from('app_config')
      .select('key,value')
      .then(({ data }) => {
        if (data) {
          const map: Config = {}
          data.forEach(({ key, value }) => { if (value) map[key] = value })
          cache = map
          setConfig(map)
        }
      })
  }, [])

  return config
}
