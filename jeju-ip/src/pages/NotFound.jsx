import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <div className="auth-emoji">🗿</div>
        <h1>페이지를 찾을 수 없어요</h1>
        <p className="muted">돌하르방도 이 길은 모른대요. 주소를 다시 확인해 주세요.</p>
        <Link to="/" className="btn btn-primary btn-block">홈으로</Link>
      </div>
    </section>
  )
}
