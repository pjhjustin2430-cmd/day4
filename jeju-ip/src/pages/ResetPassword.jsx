import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { koreanAuthError } from '../lib/authErrors'

// 비밀번호 재설정 메일의 링크로 들어오면(PASSWORD_RECOVERY) 새 비밀번호를 입력하는 페이지
export default function ResetPassword() {
  const { recovery, user, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 해요.'); return }
    setBusy(true)
    try { await updatePassword(password); setDone(true); setTimeout(() => navigate('/'), 1500) }
    catch (err) { setError(koreanAuthError(err)) }
    finally { setBusy(false) }
  }

  if (!recovery && !user) {
    return (
      <section className="auth-wrap"><div className="auth-card">
        <div className="auth-emoji">🔑</div>
        <h1>비밀번호 재설정</h1>
        <p className="muted">재설정 메일의 링크를 통해 들어와야 해요. 로그인 화면에서 "비밀번호를 잊으셨나요?"를 눌러 메일을 받아 보세요.</p>
        <Link to="/login" className="btn btn-primary btn-block">로그인으로 가기</Link>
      </div></section>
    )
  }

  return (
    <section className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-emoji">🔑</div>
        <h1>새 비밀번호</h1>
        {done && <div className="notice notice-ok">변경 완료! 잠시 후 홈으로 이동해요.</div>}
        {error && <div className="notice notice-err">{error}</div>}
        <label>새 비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자 이상" required autoComplete="new-password" />
        </label>
        <button className="btn btn-primary btn-block" disabled={busy || done}>{busy ? '처리 중…' : '비밀번호 변경'}</button>
      </form>
    </section>
  )
}
