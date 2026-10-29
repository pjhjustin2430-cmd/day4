import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../context/FavoritesContext.jsx'
import { koreanAuthError } from '../lib/authErrors'

export default function Account() {
  const { user, nickname, updateNickname, signOut } = useAuth()
  const { items } = useFavorites()
  const navigate = useNavigate()
  const [value, setValue] = useState(nickname)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    setMsg(''); setError('')
    if (value.trim().length < 2) { setError('닉네임은 2자 이상 입력해 주세요.'); return }
    try { await updateNickname(value.trim()); setMsg('닉네임을 저장했어요.') } catch (err) { setError(koreanAuthError(err)) }
  }

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <div className="auth-emoji">👤</div>
        <h1>내 계정</h1>
        <dl className="kv">
          <dt>이메일</dt><dd>{user.email}</dd>
          <dt>가입일</dt><dd>{new Date(user.created_at).toLocaleDateString('ko-KR')}</dd>
          <dt>즐겨찾기</dt><dd>{items.length}장</dd>
        </dl>
        {msg && <div className="notice notice-ok">{msg}</div>}
        {error && <div className="notice notice-err">{error}</div>}
        <form onSubmit={save} className="inline-form">
          <label>닉네임
            <input value={value} onChange={(e) => setValue(e.target.value)} maxLength={20} />
          </label>
          <button className="btn btn-primary">저장</button>
        </form>
        <button className="btn btn-ghost btn-block" onClick={async () => { await signOut(); navigate('/') }}>로그아웃</button>
      </div>
    </section>
  )
}
