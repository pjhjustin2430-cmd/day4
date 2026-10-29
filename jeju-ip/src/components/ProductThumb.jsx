import { findIp } from '../data/ips'
import { usePixabay } from '../hooks/usePixabay'

// 상품 이미지: 연결된 제주 IP 의 Pixabay 사진을 보여 주고, 없으면 이모지로 대체
export default function ProductThumb({ product, className = '' }) {
  const ip = findIp(product.ip_slug)
  const { hits, loading } = usePixabay(ip ? ip.queries : ['jeju'], 3, 1, ip?.filter)
  const src = hits[0]?.webformatURL
  return (
    <div className={`thumb ${className}`} style={{ '--accent': ip?.color || '#0e7c86' }}>
      {src ? <img src={src} alt={product.name} loading="lazy" /> : <div className={loading ? 'skeleton fill' : 'fill fallback'} />}
      <span className="thumb-emoji">{product.emoji}</span>
    </div>
  )
}
