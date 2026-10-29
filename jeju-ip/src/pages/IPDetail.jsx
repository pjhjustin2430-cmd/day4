import { Link, useParams } from 'react-router-dom'
import { IPS, findIp } from '../data/ips'
import { usePixabay } from '../hooks/usePixabay'
import ImageGrid from '../components/ImageGrid.jsx'
import NotFound from './NotFound.jsx'

export default function IPDetail() {
  const { slug } = useParams()
  const ip = findIp(slug)
  // 훅은 조건문 밖에서 호출해야 하므로 ip 가 없을 때를 위해 빈 검색어 배열을 넘깁니다.
  const { hits, loading, error } = usePixabay(ip ? ip.queries : ['jeju'], 12, ip?.filter ? 6 : 8, ip?.filter)
  if (!ip) return <NotFound />

  return (
    <section className="section" style={{ '--accent': ip.color }}>
      <div className="container">
        <Link to="/ip" className="back">← IP 갤러리</Link>
        <div className="detail-head">
          <div className="detail-emoji">{ip.emoji}</div>
          <div>
            <h1>{ip.name}</h1>
            <p className="tagline">{ip.tagline}</p>
          </div>
        </div>
        <p className="detail-desc">{ip.description}</p>
        <ul className="facts">{ip.facts.map((f) => <li key={f}>{f}</li>)}</ul>

        <h2 className="section-title small">이미지</h2>
        <ImageGrid hits={hits} loading={loading} error={error} slug={ip.slug} />

        <h2 className="section-title small">다른 IP도 구경해 보세요</h2>
        <div className="chips">
          {IPS.filter((i) => i.slug !== ip.slug).map((i) => <Link key={i.slug} to={`/ip/${i.slug}`} className="chip">{i.emoji} {i.name}</Link>)}
        </div>
      </div>
    </section>
  )
}
