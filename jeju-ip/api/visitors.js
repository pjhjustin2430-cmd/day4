// Vercel 서버리스 함수: 서귀포시 직영관광지 관람객수 추이 (공공데이터포털 odcloud API) 프록시
// - 인증키(DATA_GO_KR_API_KEY)는 서버에만 두어 브라우저에 노출하지 않습니다. (VITE_ 접두사 금지)
// - 두 개의 데이터셋을 하나의 "월별 시계열"로 합쳐서 돌려줍니다.
//     ① 20250831 기준 파일: 2018-06 ~ 2025-08 (87개월)
//     ② 20251002 기준 파일: 2025-01 ~ 2026-07 (19개월)  ← 겹치는 달은 이 최신 값을 사용
const BASE = 'https://api.odcloud.kr/api/15125100/v1/'
const HIST_ID = 'uddi:258f6b02-0967-4fed-b337-83e46cdbba73'
const RECENT_ID = 'uddi:32a1b877-af20-4505-a76a-fd389ebd30ca'

export const SPOTS = ['천지연폭포', '정방폭포', '천제연폭포', '중문대포 주상절리대', '산방산_용머리', '감귤박물관']

async function load(id, key) {
  const res = await fetch(`${BASE}${id}?page=1&perPage=1000&returnType=JSON`, {
    headers: { Authorization: `Infuser ${key}` }, // 키를 URL 에 노출하지 않고 헤더로 전달
  })
  if (!res.ok) throw new Error(`공공데이터포털 응답 오류 (${res.status})`)
  const json = await res.json()
  return json.data || []
}

const toNum = (v) => {
  if (v === null || v === undefined || String(v).trim() === '') return null
  const n = Number(String(v).replace(/,/g, ''))
  return Number.isFinite(n) ? n : null
}

// ① 파일의 '기준연월'은 원래 "18-06"(2018년 6월)인데 엑셀이 "2025-06-18"(날짜)로 잘못 읽어 저장된 값입니다.
//    → 일(day) 자리 숫자가 연도(20YY), 월은 그대로. 예) "2025-06-18" → 2018-06
function histYm(label) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(label || ''))
  return m ? `20${m[3]}-${m[2]}` : null
}

const recentYm = (row) => `${row['기준연도']}-${String(row['기준월']).padStart(2, '0')}`

export default async function handler(req, res) {
  const key = process.env.DATA_GO_KR_API_KEY
  if (!key) return res.status(500).json({ error: 'DATA_GO_KR_API_KEY 환경변수가 설정되지 않았어요.' })

  try {
    const [hist, recent] = await Promise.all([load(HIST_ID, key), load(RECENT_ID, key)])
    const map = new Map()
    const put = (ym, row) => {
      if (!ym) return
      const v = {}
      for (const s of SPOTS) v[s] = toNum(row[s])
      map.set(ym, { ym, v })
    }
    hist.forEach((r) => put(histYm(r['기준연월']), r))
    recent.forEach((r) => put(recentYm(r), r)) // 최신 파일이 같은 달을 덮어씀

    const rows = [...map.values()].sort((a, b) => a.ym.localeCompare(b.ym))
    const updated = recent[0]?.['데이터기준일자'] || hist[0]?.['데이터기준일자'] || null

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400') // 6시간 CDN 캐시
    return res.status(200).json({ spots: SPOTS, rows, updated })
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) })
  }
}
