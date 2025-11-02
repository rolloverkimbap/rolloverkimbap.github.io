'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function ProfileModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true)
    window.addEventListener('openProfileModal', handleOpenModal)
    return () => window.removeEventListener('openProfileModal', handleOpenModal)
  }, [])

  // Prevent body scroll when modal is open
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

  const handleLogout = async () => {
    setLoading(true)
    setError('')

    try {
      await signOut()
      setIsOpen(false)
      router.push('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !user) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
    }
  }

  // Extract user metadata
  const firstName = user.user_metadata?.firstName || user.user_metadata?.first_name || ''
  const lastName = user.user_metadata?.lastName || user.user_metadata?.last_name || ''
  const email = user.email || ''
  const phoneNumber = user.user_metadata?.phoneNumber || user.user_metadata?.phone_number || ''
  const zipCode = user.user_metadata?.zipCode || user.user_metadata?.zip_code || ''

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={handleBackdropClick}></div>

      {/* Modal */}
      <div className="modal-overlay" onClick={handleBackdropClick}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>My Profile</h2>
            <button
              className="modal-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="profile-content">
            {/* Personal Information Section */}
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-field">
                <label>Name</label>
                <p>{firstName && lastName ? `${firstName} ${lastName}` : 'Not provided'}</p>
              </div>
              <div className="profile-field">
                <label>Email</label>
                <p>{email}</p>
              </div>
              {phoneNumber && (
                <div className="profile-field">
                  <label>Phone Number</label>
                  <p>{phoneNumber}</p>
                </div>
              )}
            </div>

            {/* Address Section */}
            {zipCode && (
              <div className="profile-section">
                <h3>Address</h3>
                <div className="profile-field">
                  <label>Zip Code</label>
                  <p>{zipCode}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loading}
              className="logout-button"
            >
              {loading ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
