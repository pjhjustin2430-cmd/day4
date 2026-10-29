import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { findIp } from '../data/ips'

export default function Favorites() {
  const { nickname } = useAuth()
  const { items, loading, toggle } = useFavorites()

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">♥ {nickname}님의 즐겨찾기</h1>
        <p className="section-sub">{items.length ? `${items.length}장을 저장했어요.` : '아직 저장한 이미지가 없어요.'}</p>

        {loading && <div className="center-note">불러오는 중…</div>}
        {!loading && !items.length && (
          <div className="empty">
            <p>IP 갤러리에서 마음에 드는 이미지의 ♡ 를 눌러 보세요.</p>
            <Link to="/ip" className="btn btn-primary">IP 갤러리 가기</Link>
          </div>
        )}

        <div className="grid">
          {items.map((f) => {
            const ip = findIp(f.ip_slug)
            return (
              <figure key={f.id} className="photo">
                <img src={f.image_url} alt={f.tags || ''} loading="lazy" />
                <button className="heart on" aria-label="즐겨찾기 해제" onClick={() => toggle({ id: f.image_id })}>♥</button>
                <figcaption>
                  {ip && <Link to={`/ip/${ip.slug}`}>{ip.emoji} {ip.name}</Link>}
                  {ip && ' · '}
                  <a href={f.page_url} target="_blank" rel="noreferrer">{f.author || 'Pixabay'}</a>
                </figcaption>
              </figure>
            )
          })}
        </div>
      </div>
    </section>
  )
}
