import { useState } from 'react'

const AMENITY_OPTIONS = ['WiFi', 'Pool', 'Breakfast', 'Spa', 'Gym', 'Pet Friendly']

export default function HotelFilters({ filters, onChange }) {
  const toggleAmenity = (a) => {
    const has = filters.amenities.includes(a)
    onChange({
      ...filters,
      amenities: has ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a],
    })
  }

  const pct = Math.round((filters.priceMax / 600) * 100)

  return (
    <div className="hotel-filters">
      <h3 className="hotel-filters__title">Filters</h3>

      {/* Price Range */}
      <div className="filter-section">
        <span className="filter-label">Price per Night</span>
        <div className="price-range-display">
          <span>$0</span>
          <strong>Up to ${filters.priceMax}</strong>
        </div>
        <input
          type="range"
          min={50}
          max={600}
          step={10}
          value={filters.priceMax}
          style={{ '--val': `${pct}%` }}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
        />
      </div>

      {/* Star Rating */}
      <div className="filter-section">
        <span className="filter-label">Minimum Rating</span>
        <div className="star-filter">
          {[0, 3, 4, 5].map((r) => (
            <label key={r} className={`star-filter__option${filters.rating === r ? ' active' : ''}`}>
              <input
                type="radio"
                name="rating"
                checked={filters.rating === r}
                onChange={() => onChange({ ...filters, rating: r })}
              />
              {r === 0 ? 'Any' : `${r}+ ★`}
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="filter-section">
        <span className="filter-label">Amenities</span>
        <div className="amenity-filters">
          {AMENITY_OPTIONS.map((a) => (
            <label key={a} className="amenity-filter">
              <input
                type="checkbox"
                checked={filters.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
