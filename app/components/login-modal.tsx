'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener('openLoginModal', handleOpenModal)
    return () => window.removeEventListener('openLoginModal', handleOpenModal)
  }, [])

  // 모달이 열렸을 때 body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await signIn(email, password)
      setIsOpen(false)
      setEmail('')
      setPassword('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // backdrop 자체를 클릭했을 때만 닫기 (모달 카드 내부 클릭은 무시)
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>

      {/* Modal */}
      <div className="modal-overlay" onClick={handleBackdropClick}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Log In</h2>
            <button
              className="modal-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="modal-footer">
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="modal-link-btn"
                onClick={() => {
                  setIsOpen(false)
                  setTimeout(() => {
                    const event = new CustomEvent('openSignupModal')
                    window.dispatchEvent(event)
                  }, 300)
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
