import { Link } from 'react-router-dom'
import { usePixabay } from '../hooks/usePixabay'

export default function IPCard({ ip }) {
  const { hits, loading } = usePixabay(ip.queries, 3, 1, ip.filter)
  const cover = hits[0]?.webformatURL
  return (
    <Link to={`/ip/${ip.slug}`} className="ip-card" style={{ '--accent': ip.color }}>
      <div className="ip-cover">
        {cover ? <img src={cover} alt={ip.name} loading="lazy" /> : <div className={loading ? 'skeleton fill' : 'fill fallback'}>{!loading && ip.emoji}</div>}
        <span className="ip-badge">{ip.emoji}</span>
      </div>
      <div className="ip-info">
        <h3>{ip.name}</h3>
        <p>{ip.tagline}</p>
      </div>
    </Link>
  )
}
