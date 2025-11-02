'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { getTagIcon } from '@/lib/iconUtils'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image_url?: string
  tags?: string[]
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category', { ascending: true })

        if (error) throw error 

        setMenuItems(data || [])

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set((data || []).map((item) => item.category))
        ) as string[]
        setCategories(uniqueCategories)
      } catch (err) {
        console.error('Failed to fetch menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])


  return (
    <div className="menu-page">
      {/* Page Header */}
      <div className="section-container">
        <section className="menu-header">
          <h1>Menu</h1>
        </section>
      </div>

      {/* Menu Content */}
      <section className="menu-content">
        {loading ? (
          <div className="loading">Loading menu...</div>
        ) : categories.length > 0 ? (
          <>
            {/* Category Sections */}
            {categories.map((category) => {
              const categoryItems = menuItems.filter(
                (item) => item.category === category
              )
              return (
                <div key={category} className="menu-category-section">
                  <div className="section-container">
                    {/* Category Title with Divider */}
                    <div className="category-header">
                      <h2>{category}</h2>
                    </div>

                    {/* Menu Items Grid */}
                    {categoryItems.length > 0 ? (
                      <div className="menu-grid">
                        {categoryItems.map((item) => (
                          <div key={item.id} className="menu-card">
                            {item.image_url && (
                              <div className="menu-card-image">
                                <img src={item.image_url} alt={item.name} />
                              </div>
                            )}
                            <div className="menu-card-content">
                              <div className="menu-card-header">
                                <h3 className="menu-card-title">{item.name}</h3>
                                <p className="menu-card-price">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <p className="menu-card-description">
                                {item.description}
                              </p>
                              {item.tags && item.tags.length > 0 && (
                                <div className="menu-card-tags">
                                  {item.tags.map((tag) => {
                                    const Icon = getTagIcon(tag)
                                    return (
                                      <div key={tag} className="tag-badge">
                                        {Icon && <Icon className="tag-icon" />}
                                        <span className="tag-label">{tag}</span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-items">
                        No items in this category.
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        ) : (
          <div className="no-items">No menu items available.</div>
        )}
      </section>

      {/* Info Section */}
      <section className="menu-info">
        <div className="section-container">
          <h2>Ready to Order?</h2>
          <p>Visit us or order online for pickup or delivery</p>
          <div className="info-buttons">
            <a href="/order-online" className="btn btn-primary">
              Order Online
            </a>
            <a href="/contact" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
