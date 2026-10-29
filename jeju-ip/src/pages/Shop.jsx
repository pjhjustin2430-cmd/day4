import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { DEMO_PRODUCTS, won } from '../data/products'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import ProductThumb from '../components/ProductThumb.jsx'

export default function Shop() {
  const { user } = useAuth()
  const { add } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [products, setProducts] = useState([])
  const [demo, setDemo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    let off = false
    ;(async () => {
      if (!isSupabaseConfigured) { setProducts(DEMO_PRODUCTS); setDemo(true); setLoading(false); return }
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('id')
      if (off) return
      if (error || !data?.length) { setProducts(DEMO_PRODUCTS); setDemo(true) } else { setProducts(data); setDemo(false) }
      setLoading(false)
    })()
    return () => { off = true }
  }, [])

  const onAdd = async (p) => {
    if (!user) { navigate('/login', { state: { from: location.pathname, message: '장바구니는 로그인 후에 쓸 수 있어요.' } }); return }
    if (demo) { alert('데모 상품이에요. Supabase 에서 supabase/cart.sql 을 실행하면 실제 장바구니에 담을 수 있어요.'); return }
    setBusyId(p.id)
    await add(p, 1)
    setBusyId(null)
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">🛍️ 제주 굿즈 상점</h1>
        <p className="section-sub">제주 IP를 담은 굿즈를 장바구니에 담아 보세요. (샘플 상품입니다)</p>

        {demo && !loading && (
          <div className="notice notice-warn" style={{ width: 'auto', margin: '0 0 18px' }}>
            <strong>데모 모드</strong> — 상품 테이블이 아직 없어요. Supabase SQL Editor 에서 <code>supabase/cart.sql</code> 을 실행하면 실제 데이터로 바뀌어요.
          </div>
        )}

        {loading ? (
          <div className="grid">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton card-img" />)}</div>
        ) : (
          <div className="product-grid">
            {products.map((p) => (
              <article key={p.id} className="product">
                <ProductThumb product={p} />
                <div className="product-body">
                  <h3>{p.name}</h3>
                  <p className="product-desc">{p.description}</p>
                  <div className="product-foot">
                    <strong className="price">{won(p.price)}</strong>
                    <button className="btn btn-primary btn-sm" disabled={busyId === p.id || p.stock === 0} onClick={() => onAdd(p)}>
                      {p.stock === 0 ? '품절' : busyId === p.id ? '담는 중…' : '🛒 담기'}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        <div className="center"><Link to="/cart" className="btn btn-ghost">장바구니 보기 →</Link></div>
      </div>
    </section>
  )
}
