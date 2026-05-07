import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Corso {
  id: number
  title: string
  description: string
  duration: string
  lessons: number
  price: string
  free: boolean
  image_url: string
  stripe_url: string | null
  sort_order: number
  active: boolean
}

let cache: Corso[] | null = null

export function useCourses() {
  const [courses, setCourses] = useState<Corso[]>(cache ?? [])
  const [loading, setLoading] = useState(!cache)

  useEffect(() => {
    if (cache) return
    supabase
      .from('corsi')
      .select('*')
      .eq('active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) {
          cache = data as Corso[]
          setCourses(cache)
        }
        setLoading(false)
      })
  }, [])

  return { courses, loading }
}
