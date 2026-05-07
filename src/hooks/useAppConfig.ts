import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Config = Record<string, string>

export function useAppConfig() {
  const [config, setConfig] = useState<Config>({})

  useEffect(() => {
    supabase
      .from('app_config')
      .select('key,value')
      .then(({ data }) => {
        if (data) {
          const map: Config = {}
          data.forEach(({ key, value }) => { if (value) map[key] = value })
          setConfig(map)
        }
      })
  }, [])

  return config
}
