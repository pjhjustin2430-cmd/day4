import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 환경변수가 없어도 앱이 죽지 않고 "설정 안내" 화면을 보여 주기 위한 플래그
export const isSupabaseConfigured = Boolean(url && anonKey)

// anon(public) 키는 브라우저에 노출되는 것이 정상입니다. 데이터 보호는 RLS(행 수준 보안) 정책이 담당합니다.
export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null
