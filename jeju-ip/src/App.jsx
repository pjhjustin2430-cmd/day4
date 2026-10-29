import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ConfigNotice from './components/ConfigNotice.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
import IPList from './pages/IPList.jsx'
import IPDetail from './pages/IPDetail.jsx'
import Auth from './pages/Auth.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Favorites from './pages/Favorites.jsx'
import Shop from './pages/Shop.jsx'
import Stats from './pages/Stats.jsx'
import Cart from './pages/Cart.jsx'
import Toast from './components/Toast.jsx'
import Account from './pages/Account.jsx'
import NotFound from './pages/NotFound.jsx'

// 로그인한 사용자만 볼 수 있는 페이지
function Protected({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <div className="center-note">불러오는 중…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <ConfigNotice />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ip" element={<IPList />} />
          <Route path="/ip/:slug" element={<IPDetail />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/signup" element={<Auth mode="signup" />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="/favorites" element={<Protected><Favorites /></Protected>} />
          <Route path="/account" element={<Protected><Account /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toast />
    </>
  )
}
