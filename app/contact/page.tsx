'use client'

import { useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'

interface FormData {
  first_name: string
  last_name: string
  email: string
  message: string
}

const MAX_MESSAGE_LENGTH = 300

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    email: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [messageLength, setMessageLength] = useState(0)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    if (name === 'message') {
      if (value.length > MAX_MESSAGE_LENGTH) {
        return
      }
      setMessageLength(value.length)
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // 1) client 생성 (브라우저에서만)
      const supabase = getSupabaseBrowserClient()

      // 2) basic validation
      if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.message
      ) {
        throw new Error('All fields are required.')
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        throw new Error('Please enter a valid email address.')
      }

      // 3) insert
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([
          {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            message: formData.message,
          },
        ])

      if (dbError) {
        console.error('Supabase Error Details:', {
          message: dbError.message,
          code: dbError.code,
          details: dbError.details,
          hint: dbError.hint,
        })
        throw new Error(dbError.message)
      }

      // 4) success
      setSuccess(true)
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        message: '',
      })
      setMessageLength(0)

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred.'
      setError(errorMessage)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="contact-hero-section">
        <div className="contact-hero-content">
          <p>
            We love partnering on pop-ups and events.
            <br />
            Tell us about your idea, and we&apos;ll get back with availability, menu, and a quote.
          </p>
        </div>
      </div>

      <div className="contact-page">
        <div className="contact-left-image">
          <img src="/images/group-items/group_images_1.jpg" alt="Roll Over Kimbap" />
        </div>

        <div className="contact-right-form">
          <div className="contact-form-container">
            {success && (
              <div className="success-message">
                ✅ Thank you! Your message has been sent successfully. We&apos;ll be in touch soon!
              </div>
            )}

            {error && (
              <div className="error-message">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <div className="form-group">
                <div className="message-label-row">
                  <label htmlFor="message">Message *</label>
                  <span className="char-count">
                    {messageLength}/{MAX_MESSAGE_LENGTH}
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us how we can help..."
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="location-map-section">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8178.963432220211!2d-73.95772583804423!3d40.73524107916177!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2593be62b034f%3A0x4934b645b2ac3f99!2s394%20McGuinness%20Blvd%2C%20Brooklyn%2C%20NY%2011222%20%EB%AF%B8%EA%B5%AD!5e0!3m2!1sko!2sca!4v1762038341443!5m2!1sko!2sca"
          style={{ border: 0, width: '100%', height: '500px' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </>
  )
}
