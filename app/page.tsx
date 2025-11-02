'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .limit(3)

        if (error) throw error
        setFeaturedItems(data || [])
      } catch (err) {
        console.error('Failed to fetch menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedItems()
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: 'url(/images/group-items/group_images_4.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-subtitle">Eat Real Kimbap. Inside Matters.</p>
          <Link href="/menu" className="btn btn-primary hero-btn">
            Menu
          </Link>
        </div>
      </section>
        
      {/* Introduction Section */}
      <section className="introduction-section">
        <div className="section-container">
          <div className="introduction-content">
            <p className="body_large">
              Roll Over Kimbap began to serve busy, modern eaters who will not give up great taste or health.
              <br />
              <br />
              Kimbap is Korean comfort food. Each ingredient is prepared with care, and in one bite they come together in a harmony you never forget. It is portable, just the right size, and beautiful to look at.
            </p>
          </div>
        </div>
      </section>
      {/* Service Section */}
      <section className="service-section">
        <div className="section-container">
          <div className="service-content">
            <div className="service-text">
              <p className="body_medium">
                Pickup Order
              </p>
              <p>
                Send us a DM by the day before with your order and pickup spot.
                We'll be there with your favorite kimbap, freshly made that morning.
              </p>
            </div>
            <div className="service-text">
              <p className="body_medium">
                Group Order
              </p>
              <p>
                For order of 12 rolls or more, we take a limited number of delivery orders each day.
                DM us early to secure your spot!
              </p>
            </div>
            <div className="service-text">
              <p className="body_medium">
                Catering
              </p>
              <p>
                Hosting a special day or gathering with friends?
                We prepare kimbap and side dishes that pair perfectly together,
                making your event both delicious and memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Section */}
      <section className="event-section">
        <div className="section-container">
          <h2>Events</h2>
          <div className="events-list">
            <div className="event-item">2025.11.14 Kimbap X Wine Society: Diner Classic Kimbap</div>
            <div className="event-item">2025.11.07 Popup with Rockaway Brewing Company</div>
            <div className="event-item">2025.10.25 Popup with Kato Sake Works</div>
            <div className="event-item">2025.10.24 Popup with Rockaway Brewing Company</div>
            <div className="event-item">2025.10.19 Jersey City Chuseok Festival</div>
            <div className="event-item">2025.10.04 Popup with Rockaway Brewing Company</div>
            <div className="event-item">2025.10.02-03 Popup with Hana Makgeolli</div>
            <div className="event-item">2025.09.26 Kimbap X Wine Society: Reimaged Kimbap</div>
            <div className="event-item">2025.09.19 Popup with Rockaway Brewing Company</div>
            <div className="event-item">2025.09.14 Popup with King's Street Coffee</div>
            <div className="event-item">2025.09.06 - 2025.10.18 Smorgasburg</div>
            <div className="event-item">2025.08.22–23 Popup with Hana Makgeolli</div>
            <div className="event-item">2025.08.10 Asian Festival</div>
            <div className="event-item">2025.08.08 Popup with Rockaway Brewing Company</div>
            <div className="event-item">2025.07.31 Popup with Hana Makgeolli</div>
            <div className="event-item">2025.07.07 Kopino Festival</div>
            <div className="event-item">2025.06.27 Popup with Rockaway Brewing Company</div>
          </div>
        </div>
      </section>
    </div>
  )
}
