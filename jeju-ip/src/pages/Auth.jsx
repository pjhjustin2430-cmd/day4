import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { koreanAuthError } from '../lib/authErrors'
import { isSupabaseConfigured } from '../lib/supabase'

// 로그인 / 회원가입 겸용 페이지 (mode: 'login' | 'signup')
export default function Auth({ mode }) {
  const isSignup = mode === 'signup'
  const { user, signIn, signUp, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState(location.state?.message || '')

  if (user) return <Navigate to={from} replace />

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setInfo('')
    if (!isSupabaseConfigured) { setError('Supabase 환경변수가 설정되지 않았어요. 화면 위 안내를 확인해 주세요.'); return }
    if (password.length < 8) { setError('비밀번호는 8자 이상이어야 해요.'); return }
    if (isSignup && nickname.trim().length < 2) { setError('닉네임은 2자 이상 입력해 주세요.'); return }
    setBusy(true)
    try {
      if (isSignup) {
        const { needsConfirmation } = await signUp({ email: email.trim(), password, nickname: nickname.trim() })
        if (needsConfirmation) setInfo('가입 완료! 📧 입력한 이메일로 인증 메일을 보냈어요. 메일의 링크를 누른 뒤 로그인해 주세요.')
        else navigate(from, { replace: true })
      } else {
        await signIn({ email: email.trim(), password })
        navigate(from, { replace: true })
      }
    } catch (err) {
      // 원인 파악을 위해 Supabase 가 돌려준 원본 메시지를 함께 보여 줍니다.
      console.error('[auth]', err)
      const raw = err?.message ? ` [${err.status ? err.status + ' · ' : ''}${err.message}]` : ''
      setError(koreanAuthError(err) + raw)
    } finally {
      setBusy(false)
    }
  }

  const forgot = async () => {
    setError(''); setInfo('')
    if (!email.trim()) { setError('위 칸에 이메일을 먼저 입력해 주세요.'); return }
    try { await resetPassword(email.trim()); setInfo('비밀번호 재설정 메일을 보냈어요. 메일함을 확인해 주세요.') } catch (err) { setError(koreanAuthError(err)) }
  }

  return (
    <section className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-emoji">{isSignup ? '🍊' : '🗿'}</div>
        <h1>{isSignup ? '회원가입' : '로그인'}</h1>
        <p className="muted">{isSignup ? '가입하면 마음에 든 제주 이미지를 즐겨찾기로 저장할 수 있어요.' : '다시 만나서 반가워요!'}</p>

        {info && <div className="notice notice-ok">{info}</div>}
        {error && <div className="notice notice-err">{error}</div>}

        {isSignup && (
          <label>닉네임
            <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="예) 감귤러버" maxLength={20} autoComplete="nickname" />
          </label>
        )}
        <label>이메일
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required autoComplete="email" />
        </label>
        <label>비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="8자 이상" required autoComplete={isSignup ? 'new-password' : 'current-password'} />
        </label>

        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? '처리 중…' : isSignup ? '가입하기' : '로그인'}</button>

        {!isSignup && <button type="button" className="link-btn" onClick={forgot}>비밀번호를 잊으셨나요?</button>}
        <p className="auth-switch">
          {isSignup ? <>이미 계정이 있나요? <Link to="/login" state={location.state}>로그인</Link></> : <>아직 계정이 없나요? <Link to="/signup" state={location.state}>회원가입</Link></>}
        </p>
      </form>
    </section>
  )
}
