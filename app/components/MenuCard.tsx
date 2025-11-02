'use client'

interface MenuCardProps {
  image: string
  name: string
  description: string
  tags?: string[]
  price: number
}

export default function MenuCard({
  image,
  name,
  description,
  tags = [],
  price,
}: MenuCardProps) {
  return (
    <div className="menu-card-featured">
      {/* Image Section */}
      <div className="menu-card-featured-image">
        <img src={image} alt={name} />
      </div>

      {/* Content Section */}
      <div className="menu-card-featured-content">
        {/* Title */}
        <h3 className="menu-card-featured-title">{name}</h3>

        {/* Description */}
        <p className="menu-card-featured-description">{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="menu-card-featured-tags">
            {tags.map((tag) => (
              <span key={tag} className="menu-card-featured-tag">
                © {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price */}
        <p className="menu-card-featured-price">${price.toFixed(2)}</p>
      </div>
    </div>
  )
}
