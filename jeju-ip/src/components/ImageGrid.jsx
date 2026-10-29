import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'

// Pixabay 이미지 그리드: 하트(즐겨찾기) + 확대 보기 + 작가 크레딧
export default function ImageGrid({ hits, loading, error, slug, count = 12 }) {
  const { user } = useAuth()
  const { isFav, toggle } = useFavorites()
  const navigate = useNavigate()
  const location = useLocation()
  const [view, setView] = useState(null)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setView(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onHeart = (hit) => {
    if (!user) { navigate('/login', { state: { from: location.pathname, message: '즐겨찾기는 로그인 후에 쓸 수 있어요.' } }); return }
    toggle(hit, slug)
  }

  if (error) return <div className="notice notice-warn">이미지를 불러오지 못했어요: {error}</div>

  if (loading) {
    return <div className="grid">{Array.from({ length: count }).map((_, i) => <div key={i} className="skeleton card-img" />)}</div>
  }
  if (!hits.length) return <div className="center-note">표시할 이미지가 없어요.</div>

  return (
    <>
      <div className="grid">
        {hits.map((h) => (
          <figure key={h.id} className="photo">
            <img src={h.webformatURL} alt={h.tags} loading="lazy" onClick={() => setView(h)} />
            <button className={`heart ${isFav(h.id) ? 'on' : ''}`} aria-label="즐겨찾기" onClick={() => onHeart(h)}>
              {isFav(h.id) ? '♥' : '♡'}
            </button>
            <figcaption>
              <a href={h.pageURL} target="_blank" rel="noreferrer">{h.user}</a> · Pixabay
            </figcaption>
          </figure>
        ))}
      </div>

      {view && (
        <div className="lightbox" onClick={() => setView(null)}>
          <div className="lightbox-body" onClick={(e) => e.stopPropagation()}>
            <img src={view.largeImageURL} alt={view.tags} />
            <p>
              {view.tags} · <a href={view.pageURL} target="_blank" rel="noreferrer">{view.user} / Pixabay</a>
            </p>
            <button className="btn btn-ghost btn-sm" onClick={() => setView(null)}>닫기 (Esc)</button>
          </div>
        </div>
      )}
    </>
  )
}
