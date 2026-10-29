import { useCart } from '../context/CartContext.jsx'

// 담기/삭제 결과를 아래쪽에 잠깐 띄워 주는 알림
export default function Toast() {
  const { toast } = useCart()
  if (!toast) return null
  return <div className="toast" role="status">{toast}</div>
}
