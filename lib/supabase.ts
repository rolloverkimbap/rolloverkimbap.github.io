// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: SupabaseClient | null = null

if (url && anonKey) {
  supabase = createClient(url, anonKey)
} else {
  // 빌드/서버 환경에서 env가 없을 때 여기로 온다
  if (typeof window === 'undefined') {
    console.warn(
      'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel.'
    )
  }
}

export { supabase }
