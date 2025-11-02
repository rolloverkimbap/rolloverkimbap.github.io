'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL에서 코드 추출
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          new URLSearchParams(window.location.search).get('code') || ''
        )

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=auth_failed')
          return
        }

        // 성공 - Home으로 이동
        router.push('/')
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/auth/login')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="auth-container">
      <div className="auth-card">
        <p>로그인 중...</p>
      </div>
    </div>
  )
}
