import { isSupabaseConfigured } from '../lib/supabase'

// Supabase 환경변수가 없을 때 화면 위에 뜨는 안내 배너 (앱이 죽지 않게)
export default function ConfigNotice() {
  if (isSupabaseConfigured) return null
  return (
    <div className="notice notice-warn">
      <strong>Supabase 환경변수가 설정되지 않았어요.</strong> 로그인/회원가입/즐겨찾기를 쓰려면{' '}
      <code>.env.local</code> 에 <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code> 를 넣고 개발 서버를 다시 시작하세요.
      (Vercel 에서는 Settings → Environment Variables)
    </div>
  )
}
