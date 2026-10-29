import { Link } from 'react-router-dom'
import { IPS, HERO } from '../data/ips'
import IPCard from '../components/IPCard.jsx'
import { usePixabay } from '../hooks/usePixabay'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { hits } = usePixabay(HERO.queries, 6, 1, HERO.filter)
  const { user, nickname } = useAuth()
  const hero = hits[0]?.largeImageURL

  return (
    <>
      <section className="hero" style={hero ? { backgroundImage: `linear-gradient(180deg, rgba(8,40,50,.35), rgba(8,40,50,.7)), url(${hero})` } : undefined}>
        <div className="hero-inner">
          <p className="eyebrow">JEJU · IP · STUDIO</p>
          <h1>제주의 이야기가<br />캐릭터가 되는 곳</h1>
          <p className="lead">돌하르방, 해녀, 감귤, 한라산… 제주를 대표하는 IP 소재를 이미지와 함께 모아 보고, 마음에 드는 장면을 ♥ 즐겨찾기로 간직해 보세요.</p>
          <div className="hero-cta">
            <Link to="/ip" className="btn btn-primary">IP 갤러리 보기</Link>
            {user ? <Link to="/favorites" className="btn btn-light">{nickname}님의 즐겨찾기</Link> : <Link to="/signup" className="btn btn-light">무료로 가입하기</Link>}
          </div>
          {hits[0] && <p className="hero-credit">Photo by <a href={hits[0].pageURL} target="_blank" rel="noreferrer">{hits[0].user}</a> / Pixabay</p>}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">제주를 대표하는 IP</h2>
          <p className="section-sub">캐릭터·굿즈·콘텐츠로 풀어내기 좋은 제주의 이야기 소재들이에요.</p>
          <div className="ip-grid">
            {IPS.slice(0, 6).map((ip) => <IPCard key={ip.slug} ip={ip} />)}
          </div>
          <div className="center"><Link to="/ip" className="btn btn-ghost">전체 보기 →</Link></div>
        </div>
      </section>

      <section className="section alt">
        <div className="container features">
          <div className="feature"><span>🗿🌬️👩</span><h3>삼다(三多)의 섬</h3><p>돌·바람·여자가 많다고 해서 제주를 삼다도라 불러요. 이 세 가지는 제주 이야기의 뿌리가 돼요.</p></div>
          <div className="feature"><span>🖼️</span><h3>Pixabay 이미지</h3><p>자유롭게 쓸 수 있는 사진을 검색해서 보여 주고, 작가 크레딧도 함께 표시해요.</p></div>
          <div className="feature"><span>♥</span><h3>나만의 즐겨찾기</h3><p>회원가입 후 로그인하면 마음에 든 이미지를 저장하고 언제든 다시 볼 수 있어요.</p></div>
        </div>
      </section>
    </>
  )
}
