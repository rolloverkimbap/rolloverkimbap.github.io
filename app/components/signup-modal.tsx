'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'

// Password validation rules
const PASSWORD_RULES = {
  minLength: 6,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasDigit: /\d/,
  hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
}

const validatePassword = (password: string) => {
  const rules = {
    minLength: password.length >= PASSWORD_RULES.minLength,
    hasLowercase: PASSWORD_RULES.hasLowercase.test(password),
    hasUppercase: PASSWORD_RULES.hasUppercase.test(password),
    hasDigit: PASSWORD_RULES.hasDigit.test(password),
    hasSymbol: PASSWORD_RULES.hasSymbol.test(password),
  }
  return rules
}

const isPasswordValid = (password: string) => {
  const rules = validatePassword(password)
  return Object.values(rules).every(Boolean)
}

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [emailSubscribe, setEmailSubscribe] = useState(false)
  const [smsSubscribe, setSmsSubscribe] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordRules, setPasswordRules] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasDigit: false,
    hasSymbol: false,
  })
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const { signUp } = useAuth()

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener('openSignupModal', handleOpenModal)
    return () => window.removeEventListener('openSignupModal', handleOpenModal)
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    setPasswordRules(validatePassword(newPassword))
    // Check if confirm password matches
    if (confirmPassword) {
      setPasswordsMatch(newPassword === confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConfirmPassword = e.target.value
    setConfirmPassword(newConfirmPassword)
    // Check if passwords match in real-time
    setPasswordsMatch(password === newConfirmPassword)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    // Validation
    if (!firstName.trim()) {
      setError('First name is required')
      setLoading(false)
      return
    }

    if (!lastName.trim()) {
      setError('Last name is required')
      setLoading(false)
      return
    }

    if (!email.trim()) {
      setError('Email is required')
      setLoading(false)
      return
    }

    if (!password) {
      setError('Password is required')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password requirements
    const rules = validatePassword(password)
    if (!rules.minLength) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (!rules.hasLowercase) {
      setError('Password must contain lowercase letters')
      setLoading(false)
      return
    }

    if (!rules.hasUppercase) {
      setError('Password must contain uppercase letters')
      setLoading(false)
      return
    }

    if (!rules.hasDigit) {
      setError('Password must contain digits')
      setLoading(false)
      return
    }

    if (!rules.hasSymbol) {
      setError('Password must contain special symbols (!@#$%^&* etc.)')
      setLoading(false)
      return
    }

    if (!termsAgreed) {
      setError('You must agree to the terms and conditions')
      setLoading(false)
      return
    }

    try {
      const metadata: Record<string, any> = {
        firstName,
        lastName,
        email,
        emailSubscribe,
        smsSubscribe,
        termsAgreed,
      }

      // Only add optional fields if provided
      if (phoneNumber.trim()) {
        metadata.phoneNumber = phoneNumber
      }
      if (zipCode.trim()) {
        metadata.zipCode = zipCode
      }

      await signUp(email, password, metadata)
      setSuccess('Account created successfully! Please check your email to confirm your account.')
      setTimeout(() => {
        setIsOpen(false)
        // Reset form
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setPhoneNumber('')
        setZipCode('')
        setEmailSubscribe(false)
        setSmsSubscribe(false)
        setTermsAgreed(false)
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
        <div className="modal-card modal-card-large" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Create Account</h2>
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
            {success && <div className="success-message">{success}</div>}

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required-asterisk">*</span></label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required-asterisk">*</span></label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email <span className="required-asterisk">*</span></label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password <span className="required-asterisk">*</span></label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••"
                  required
                />
                {password && (
                  <div className="password-requirements">
                    <div className={`requirement ${passwordRules.minLength ? 'met' : ''}`}>
                      <span className="requirement-icon">{passwordRules.minLength ? '✓' : '○'}</span>
                      At least 6 characters
                    </div>
                    <div className={`requirement ${passwordRules.hasLowercase ? 'met' : ''}`}>
                      <span className="requirement-icon">{passwordRules.hasLowercase ? '✓' : '○'}</span>
                      Lowercase letters (a-z)
                    </div>
                    <div className={`requirement ${passwordRules.hasUppercase ? 'met' : ''}`}>
                      <span className="requirement-icon">{passwordRules.hasUppercase ? '✓' : '○'}</span>
                      Uppercase letters (A-Z)
                    </div>
                    <div className={`requirement ${passwordRules.hasDigit ? 'met' : ''}`}>
                      <span className="requirement-icon">{passwordRules.hasDigit ? '✓' : '○'}</span>
                      Digits (0-9)
                    </div>
                    <div className={`requirement ${passwordRules.hasSymbol ? 'met' : ''}`}>
                      <span className="requirement-icon">{passwordRules.hasSymbol ? '✓' : '○'}</span>
                      Special symbols (!@#$%^&* etc.)
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password <span className="required-asterisk">*</span></label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="••••••"
                  required
                  className={confirmPassword && !passwordsMatch ? 'input-error' : ''}
                />
                {confirmPassword && (
                  <div className={`password-match ${passwordsMatch ? 'matched' : 'not-matched'}`}>
                    <span className="match-icon">{passwordsMatch ? '✓' : '✗'}</span>
                    {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>
            </div>

            {/* Phone & Zip */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number <span className="text-muted">(Optional)</span></label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Zip Code <span className="text-muted">(Optional)</span></label>
                <input
                  id="zip"
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                />
              </div>
            </div>

            {/* Subscriptions */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={emailSubscribe}
                  onChange={(e) => setEmailSubscribe(e.target.checked)}
                />
                <span>Subscribe to email promotions</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={smsSubscribe}
                  onChange={(e) => setSmsSubscribe(e.target.checked)}
                />
                <span>Subscribe to SMS promotions</span>
              </label>
            </div>

            {/* Terms */}
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  required
                />
                <span>I agree to the Terms and Conditions</span>
              </label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="modal-footer">
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="modal-link-btn"
                onClick={() => {
                  setIsOpen(false)
                  setTimeout(() => {
                    const event = new CustomEvent('openLoginModal')
                    window.dispatchEvent(event)
                  }, 300)
                }}
              >
                Log in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
