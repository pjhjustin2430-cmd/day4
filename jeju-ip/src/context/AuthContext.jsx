import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [profile, setProfile] = useState(null)
  const [recovery, setRecovery] = useState(false)

  // 세션 복원 + 로그인/로그아웃 상태 변화 구독
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      if (event === 'PASSWORD_RECOVERY') setRecovery(true)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const user = session?.user ?? null

  // 로그인한 사용자의 프로필(닉네임) 로드
  useEffect(() => {
    if (!supabase || !user) { setProfile(null); return }
    let off = false
    supabase.from('profiles').select('nickname').eq('id', user.id).maybeSingle()
      .then(({ data }) => { if (!off) setProfile(data) })
    return () => { off = true }
  }, [user?.id])

  const signUp = useCallback(async ({ email, password, nickname }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nickname }, emailRedirectTo: window.location.origin },
    })
    if (error) throw error
    // 이메일 인증을 켜 둔 경우 session 은 null 입니다.
    return { needsConfirmation: !data.session }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }, [])

  const resetPassword = useCallback(async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    if (error) throw error
  }, [])

  const updatePassword = useCallback(async (password) => {
    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    setRecovery(false)
  }, [])

  const updateNickname = useCallback(async (nickname) => {
    const { error } = await supabase.from('profiles').update({ nickname }).eq('id', user.id)
    if (error) throw error
    setProfile({ nickname })
  }, [user?.id])

  const nickname = profile?.nickname || user?.user_metadata?.nickname || user?.email?.split('@')[0] || ''

  const value = useMemo(
    () => ({ user, session, loading, nickname, recovery, signUp, signIn, signOut, resetPassword, updatePassword, updateNickname }),
    [user, session, loading, nickname, recovery, signUp, signIn, signOut, resetPassword, updatePassword, updateNickname],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
