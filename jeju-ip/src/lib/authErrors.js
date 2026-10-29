// Supabase Auth 의 영어 오류 메시지를 알기 쉬운 한국어로 바꿉니다.
export function koreanAuthError(error) {
  const msg = (error?.message || String(error || '')).toLowerCase()
  if (msg.includes('database error saving new user')) return '가입 처리 중 DB 오류예요. Supabase SQL Editor에서 supabase/schema.sql 을 실행했는지 확인해 주세요.'
  if (msg.includes('signups not allowed') || msg.includes('signup is disabled')) return 'Supabase에서 회원가입이 꺼져 있어요. (Authentication → Sign In / Providers → "Allow new users to sign up" 켜기)'
  if (msg.includes('email rate limit')) return '인증 메일 발송 한도를 넘었어요. 잠시(약 1시간) 뒤 다시 시도하거나, Supabase에서 Confirm email 을 끄거나 Custom SMTP 를 설정해 주세요.'
  if (msg.includes('invalid api key') || msg.includes('apikey')) return 'Supabase 키가 올바르지 않아요. Vercel 환경변수 VITE_SUPABASE_ANON_KEY 를 확인하고 Redeploy 해 주세요.'
  if (msg.includes('invalid login credentials')) return '이메일 또는 비밀번호가 올바르지 않아요.'
  if (msg.includes('email not confirmed')) return '이메일 인증이 아직이에요. 받은 편지함의 인증 메일을 눌러 주세요.'
  if (msg.includes('user already registered') || msg.includes('already been registered')) return '이미 가입된 이메일이에요. 로그인해 주세요.'
  if (msg.includes('password should be at least')) return '비밀번호가 너무 짧아요. 8자 이상으로 만들어 주세요.'
  if (msg.includes('weak') || msg.includes('pwned')) return '너무 쉬운 비밀번호예요. 더 복잡하게 만들어 주세요.'
  if (msg.includes('rate limit') || msg.includes('too many')) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.'
  if (msg.includes('invalid email') || msg.includes('unable to validate email')) return '이메일 형식이 올바르지 않아요.'
  if (msg.includes('same password')) return '이전과 같은 비밀번호예요. 다른 비밀번호를 입력해 주세요.'
  if (msg.includes('failed to fetch') || msg.includes('network')) return '네트워크 연결을 확인해 주세요.'
  return error?.message || '알 수 없는 오류가 발생했어요.'
}
