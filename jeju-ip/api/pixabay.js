// Vercel 서버리스 함수: Pixabay API 프록시
// - API 키(PIXABAY_API_KEY)를 서버에만 두어 브라우저에 노출하지 않습니다.
// - Pixabay 약관(24시간 캐싱)에 맞춰 CDN 캐시(s-maxage)를 걸어 호출 수도 줄입니다.
export default async function handler(req, res) {
  const key = process.env.PIXABAY_API_KEY
  if (!key) {
    return res.status(500).json({ error: 'PIXABAY_API_KEY 환경변수가 설정되지 않았어요.' })
  }

  const q = String(req.query.q || 'jeju island').slice(0, 100)
  const perPage = Math.min(Math.max(Number(req.query.per_page) || 12, 3), 30)
  const url =
    'https://pixabay.com/api/?' +
    new URLSearchParams({
      key,
      q,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      lang: 'ko',
      per_page: String(perPage),
    })

  try {
    const r = await fetch(url)
    if (!r.ok) {
      const text = await r.text()
      return res.status(r.status).json({ error: `Pixabay 오류 (${r.status}): ${text.slice(0, 120)}` })
    }
    const data = await r.json()
    const hits = (data.hits || []).map((h) => ({
      id: String(h.id),
      tags: h.tags,
      user: h.user,
      pageURL: h.pageURL,
      previewURL: h.previewURL,
      webformatURL: h.webformatURL,
      largeImageURL: h.largeImageURL,
      width: h.imageWidth,
      height: h.imageHeight,
    }))
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600')
    return res.status(200).json({ total: data.totalHits || 0, hits })
  } catch (e) {
    return res.status(502).json({ error: 'Pixabay에 연결하지 못했어요: ' + String(e) })
  }
}
