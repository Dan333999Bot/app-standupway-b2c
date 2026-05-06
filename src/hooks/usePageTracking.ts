import { useEffect, useRef } from 'react'
import { trackPage, trackScroll, trackAbandonment } from '@/lib/analytics'

export function usePageTracking(screen: string, extra: Record<string, unknown> = {}) {
  const scrolledRef = useRef<Set<number>>(new Set())
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    trackPage(screen, extra)

    const handleScroll = () => {
      const el = document.documentElement
      const pct = Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight || 1)) * 100)
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !scrolledRef.current.has(milestone)) {
          scrolledRef.current.add(milestone)
          trackScroll(screen, milestone)
        }
      }
    }

    const handleLeave = () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      trackAbandonment(screen, { time_on_page_s: timeOnPage })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleLeave)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleLeave)
    }
  }, [screen])
}
