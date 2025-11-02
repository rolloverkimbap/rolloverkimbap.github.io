// /app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        const code =
          new URLSearchParams(window.location.search).get('code') || ''

        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('Auth callback error:', error)
          router.push('/auth/login?error=auth_failed')
          return
        }

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
        <p>Signing you in...</p>
      </div>
    </div>
  )
}
