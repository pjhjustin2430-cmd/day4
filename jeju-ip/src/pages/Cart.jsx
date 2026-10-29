import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { FREE_SHIPPING_FROM, SHIPPING_FEE, won } from '../data/products'
import ProductThumb from '../components/ProductThumb.jsx'

export default function Cart() {
  const { items, loading, count, subtotal, setQty, remove, clear } = useCart()
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">🛒 장바구니</h1>
        <p className="section-sub">{count ? `${count}개 상품이 담겨 있어요.` : '장바구니가 비어 있어요.'}</p>

        {loading && !items.length && <div className="center-note">불러오는 중…</div>}

        {!loading && !items.length && (
          <div className="empty">
            <p>마음에 드는 굿즈를 담아 보세요.</p>
            <Link to="/shop" className="btn btn-primary">상점 가기</Link>
          </div>
        )}

        {!!items.length && (
          <div className="cart-layout">
            <ul className="cart-list">
              {items.map((it) => (
                <li key={it.id} className="cart-row">
                  <ProductThumb product={it.product} className="thumb-sm" />
                  <div className="cart-info">
                    <h3>{it.product.name}</h3>
                    <p className="muted">{won(it.product.price)}</p>
                  </div>
                  <div className="qty">
                    <button aria-label="수량 줄이기" onClick={() => setQty(it, it.quantity - 1)} disabled={it.quantity <= 1}>−</button>
                    <span>{it.quantity}</span>
                    <button aria-label="수량 늘리기" onClick={() => setQty(it, it.quantity + 1)} disabled={it.quantity >= 99}>＋</button>
                  </div>
                  <strong className="line-total">{won(it.product.price * it.quantity)}</strong>
                  <button className="icon-btn" aria-label="삭제" onClick={() => remove(it)}>🗑</button>
                </li>
              ))}
              <li className="cart-clear"><button className="link-btn" onClick={() => window.confirm('장바구니를 모두 비울까요?') && clear()}>전체 비우기</button></li>
            </ul>

            <aside className="summary">
              <h3>주문 요약</h3>
              <dl>
                <dt>상품 금액</dt><dd>{won(subtotal)}</dd>
                <dt>배송비</dt><dd>{shipping ? won(shipping) : '무료'}</dd>
              </dl>
              {subtotal > 0 && subtotal < FREE_SHIPPING_FROM && <p className="muted small">{won(FREE_SHIPPING_FROM - subtotal)} 더 담으면 배송비 무료!</p>}
              <div className="summary-total"><span>결제 예정 금액</span><strong>{won(total)}</strong></div>
              <button className="btn btn-primary btn-block" onClick={() => alert('결제 기능은 다음 단계에서 연결할 수 있어요. (예: 토스페이먼츠, Stripe)')}>주문하기</button>
              <Link to="/shop" className="btn btn-ghost btn-block" style={{ marginTop: 8 }}>쇼핑 계속하기</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
