import { useEffect, useState } from 'react'

// 관람객 통계는 매월 갱신되는 자료라 6시간 동안 브라우저에 캐시해 둡니다.
const KEY = 'visitors:v1'
const TTL = 6 * 60 * 60 * 1000

export function useVisitors() {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let off = false
    ;(async () => {
      try {
        try {
          const c = JSON.parse(localStorage.getItem(KEY) || 'null')
          if (c && Date.now() - c.t < TTL) { if (!off) setState({ data: c.data, loading: false, error: null }); return }
        } catch { /* 캐시를 못 읽어도 무시 */ }

        const res = await fetch('/api/visitors')
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error || `서버 오류 (${res.status})`)
        try { localStorage.setItem(KEY, JSON.stringify({ t: Date.now(), data })) } catch { /* 무시 */ }
        if (!off) setState({ data, loading: false, error: null })
      } catch (e) {
        if (!off) setState({ data: null, loading: false, error: e.message })
      }
    })()
    return () => { off = true }
  }, [])

  return state
}
