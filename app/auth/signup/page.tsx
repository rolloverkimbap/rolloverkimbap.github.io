'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

export default function SignUp() {
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [zipCode, setZipCode] = useState('') // optional
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill out all required fields.')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match.')
      }

      // build metadata (zip_code is optional)
      const metadata: Record<string, any> = {
        first_name: 'User',
        last_name: 'Account',
        email,
        email_subscribe: false,
        sms_subscribe: false,
        terms_agreement: true,
      }

      if (zipCode.trim() !== '') {
        metadata.zip_code = zipCode.trim()
      }

      await signUp(email, password, metadata)

      setSuccess(true)

      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed.'
      setError(errorMessage)
      console.error('SignUp error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google sign up failed.'
      setError(errorMessage)
      console.error('Google signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p>Join Roll Over to start using our services.</p>

        {error && <div className="error-message">{error}</div>}

        {success && (
          <div className="success-message">
            ✅ Your account has been created. Please check your email to confirm and then log in.
          </div>
        )}

        <form onSubmit={handleEmailSignUp} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password *</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {/* optional zip code */}
          <div className="form-group">
            <label htmlFor="zipCode">Zip / Postal code (optional)</label>
            <input
              id="zipCode"
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g. 10001"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <div className="divider">or</div>

        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="google-button"
        >
          Continue with Google
        </button>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link href="/auth/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
