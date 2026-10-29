import { useEffect, useState } from 'react'

// Pixabay 약관: API 결과는 24시간 캐싱해야 합니다. (서버 CDN 캐시 + 브라우저 localStorage 캐시)
const TTL = 24 * 60 * 60 * 1000

// 같은 검색어를 여러 컴포넌트가 동시에 요청해도 네트워크 호출은 한 번만 (실패도 1분간 재사용)
const inflight = new Map()

function fetchQuery(q, perPage) {
  const key = `pixabay:${q}:${perPage}`
  try {
    const cached = JSON.parse(localStorage.getItem(key) || 'null')
    if (cached && Date.now() - cached.t < TTL) return Promise.resolve(cached.hits)
  } catch { /* 캐시를 못 읽어도 무시 */ }

  if (inflight.has(key)) return inflight.get(key)
  const p = (async () => {
    const res = await fetch(`/api/pixabay?q=${encodeURIComponent(q)}&per_page=${perPage}`)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || `이미지 서버 오류 (${res.status})`)
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), hits: data.hits })) } catch { /* 용량 초과 등 무시 */ }
    return data.hits
  })()
  inflight.set(key, p)
  p.then(() => inflight.delete(key), () => setTimeout(() => inflight.delete(key), 60000))
  return p
}

// 태그에 단어가 하나라도 들어 있는지 (대소문자 무시)
// 태그는 "rape flowers, jeju island" 처럼 쉼표로 구분되므로, 쉼표를 공백으로 바꾼 문자열로도 비교해서
// "rape flower", "snow white" 같은 여러 단어 조건이 태그 경계에 걸려도 인식되게 합니다.
const hasAny = (hit, words) => {
  const tags = (hit.tags || '').toLowerCase()
  const flat = tags.replace(/,\s*/g, ' ')
  return words.some((w) => { const k = w.toLowerCase(); return tags.includes(k) || flat.includes(k) })
}

/**
 * Pixabay 검색은 단어를 쪼개서 찾기 때문에 엉뚱한 사진이 섞입니다.
 * (예: "dol hareubang" → 프랑스 Dol-de-Bretagne 사진)
 * 그래서 사진의 태그로 한 번 더 걸러 냅니다.
 *   filter.include : 태그에 이 단어 중 하나는 있어야 통과 (정확한 결과)
 *   filter.require : [[그룹1], [그룹2]...] 모든 그룹에서 단어가 하나씩은 있어야 통과 (AND 조건, 예: 제주 AND 말)
 *   filter.soft    : 위 조건 결과가 모자랄 때만 채워 넣는 느슨한 조건
 *   filter.exclude : 태그에 이 단어가 있으면 무조건 제외
 */
function split(hits, filter) {
  if (!filter) return { strict: hits, soft: [] }
  const ok = hits.filter((h) => !(filter.exclude && hasAny(h, filter.exclude)))
  const strict = ok.filter((h) =>
    (!filter.include || hasAny(h, filter.include)) &&
    (!filter.require || filter.require.every((group) => hasAny(h, group))))
  const soft = filter.soft ? ok.filter((h) => !strict.includes(h) && hasAny(h, filter.soft)) : []
  return { strict, soft }
}

/**
 * queries: 검색어 문자열 또는 [주 검색어, 대체 검색어...]
 * 필터를 통과한 결과가 min 장 미만이면 다음 검색어로 이어서 채웁니다.
 */
export function usePixabay(queries, perPage = 12, min = 3, filter = null) {
  const list = Array.isArray(queries) ? queries : [queries]
  const dep = list.join('|') + '#' + perPage + '#' + min + '#' + JSON.stringify(filter)
  const [state, setState] = useState({ hits: [], loading: true, error: null })

  useEffect(() => {
    let off = false
    ;(async () => {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        // 필터를 쓸 때는 걸러지는 양을 감안해 넉넉하게(30장) 받아 옵니다.
        const size = filter ? 30 : perPage
        let strictAll = [], softAll = []
        for (const q of list) {
          const { strict, soft } = split(await fetchQuery(q, size), filter)
          strictAll = [...strictAll, ...strict.filter((h) => !strictAll.some((a) => a.id === h.id))]
          softAll = [...softAll, ...soft.filter((h) => !softAll.some((a) => a.id === h.id))]
          if (strictAll.length >= min) break
        }
        const all = strictAll.length >= min ? strictAll : [...strictAll, ...softAll.filter((h) => !strictAll.some((a) => a.id === h.id))]
        if (!off) setState({ hits: all.slice(0, perPage), loading: false, error: null })
      } catch (e) {
        if (!off) setState({ hits: [], loading: false, error: e.message })
      }
    })()
    return () => { off = true }
  }, [dep])

  return state
}
