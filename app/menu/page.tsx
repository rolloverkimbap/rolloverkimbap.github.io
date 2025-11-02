'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase'
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
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category', { ascending: true })

        if (error) throw error

        setMenuItems(data || [])

        const uniqueCategories = Array.from(
          new Set((data || []).map((item) => item.category))
        ) as string[]

        setCategories(uniqueCategories)
      } catch (err) {
        console.error('Failed to fetch menu items:', err)
        setFetchError('Failed to load menu items.')
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  return (
    <div className="menu-page">
      <div className="section-container">
        <section className="menu-header">
          <h1>Menu</h1>
        </section>
      </div>

      <section className="menu-content">
        {loading ? (
          <div className="loading">Loading menu...</div>
        ) : fetchError ? (
          <div className="error-message">{fetchError}</div>
        ) : categories.length > 0 ? (
          <>
            {categories.map((category) => {
              const categoryItems = menuItems.filter(
                (item) => item.category === category
              )
              return (
                <div key={category} className="menu-category-section">
                  <div className="section-container">
                    <div className="category-header">
                      <h2>{category}</h2>
                    </div>

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
    </div>
  )
}
