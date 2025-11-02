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

export default function OrderOnline() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .order('category', { ascending: true })

        if (error) throw error

        setMenuItems(data || [])
      } catch (err) {
        console.error('Failed to fetch menu items:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = menuItems.find(m => m.id === itemId)
      return total + (item?.price || 0) * quantity
    }, 0)
  }

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <div className="order-online-page">
      {/* Header */}
      <section className="order-header">
        <h1>Order Online</h1>
      </section>

      {/* Main Content */}
      <section className="order-content">
        <div className="order-main">
          {/* Menu Section */}
          <div className="order-menu">
            {loading ? (
              <div className="loading">Loading menu...</div>
            ) : menuItems.length > 0 ? (
              <div className="menu-items-grid">
                {menuItems.map((item) => (
                  <div key={item.id} className="order-menu-card">
                    {item.image_url && (
                      <div className="order-menu-card-image">
                        <img src={item.image_url} alt={item.name} />
                      </div>
                    )}
                    <div className="order-menu-card-content">
                      <div className="order-menu-card-header">
                        <h3 className="order-menu-card-title">{item.name}</h3>
                        <p className="order-menu-card-price">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="order-menu-card-description">
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
                      <div className="order-button-group">
                        {cart[item.id] ? (
                          <div className="order-quantity-controls">
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="qty-btn"
                            >
                              −
                            </button>
                            <span className="qty-display">{cart[item.id]}</span>
                            <button
                              onClick={() => addToCart(item.id)}
                              className="qty-btn"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(item.id)}
                            className="order-add-btn"
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-items">No menu items available.</div>
            )}
          </div>

          {/* Cart Sidebar */}
          <aside className="order-cart-sidebar">
            <div className="cart-sticky">
              <h2 className="cart-title">Your Order</h2>

              {cartItemCount === 0 ? (
                <div className="cart-empty">
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {Object.entries(cart).map(([itemId, quantity]) => {
                      const item = menuItems.find(m => m.id === itemId)
                      return item ? (
                        <div key={itemId} className="cart-item">
                          <div className="cart-item-info">
                            <p className="cart-item-name">{item.name}</p>
                            <p className="cart-item-price">
                              ${(item.price * quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="cart-item-qty">
                            <button
                              onClick={() => removeFromCart(itemId)}
                              className="cart-qty-btn"
                            >
                              −
                            </button>
                            <span>{quantity}</span>
                            <button
                              onClick={() => addToCart(itemId)}
                              className="cart-qty-btn"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      ) : null
                    })}
                  </div>

                  <div className="cart-divider" />

                  <div className="cart-summary">
                    <div className="cart-total">
                      <span>Total:</span>
                      <span className="total-price">
                        ${getTotalPrice().toFixed(2)}
                      </span>
                    </div>
                    <button className="checkout-btn">
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
