import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function Header() {
  const { user, nickname, signOut } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const close = () => setOpen(false)

  const logout = async () => {
    close()
    try { await signOut() } finally { navigate('/') }
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={close}>
          <span className="logo-mark">🍊</span> 제주 IP 스튜디오
        </Link>
        <button className="menu-btn" aria-label="메뉴" onClick={() => setOpen((o) => !o)}>{open ? '✕' : '☰'}</button>
        <nav className={`nav ${open ? 'open' : ''}`}>
          <NavLink to="/ip" onClick={close}>IP 갤러리</NavLink>
          <NavLink to="/stats" onClick={close}>📊 관람객 통계</NavLink>
          <NavLink to="/shop" onClick={close}>🛍️ 상점</NavLink>
          {user && <NavLink to="/favorites" onClick={close}>♥ 내 즐겨찾기</NavLink>}
          <span className="nav-spacer" />
          <NavLink to="/cart" className="nav-cart" onClick={close} aria-label="장바구니">
            🛒{count > 0 && <span className="badge">{count > 99 ? '99+' : count}</span>}
          </NavLink>
          {user ? (
            <>
              <NavLink to="/account" className="nav-user" onClick={close}>👤 {nickname}</NavLink>
              <button className="btn btn-ghost btn-sm" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>로그인</NavLink>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={close}>회원가입</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
