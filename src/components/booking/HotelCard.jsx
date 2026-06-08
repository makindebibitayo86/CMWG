export default function HotelCard({ hotel, searchParams, onBookNow }) {
  return (
    <div className="hotel-card">
      <div className="hotel-card__img-wrap">
        <img
          className="hotel-card__img"
          src={hotel.image}
          alt={hotel.name}
          loading="lazy"
        />
        <span className={`hotel-card__badge hotel-card__badge--${hotel.available ? 'available' : 'unavailable'}`}>
          {hotel.available ? 'Available' : 'Sold Out'}
        </span>
      </div>

      <div className="hotel-card__body">
        <div className="hotel-card__top">
          <h3 className="hotel-card__name">{hotel.name}</h3>
          <p className="hotel-card__location">
            <svg style={{ display: 'inline', marginRight: 4, verticalAlign: 'middle' }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {hotel.location}
          </p>

          <div className="hotel-card__stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`hotel-card__star${i >= hotel.rating ? ' hotel-card__star--empty' : ''}`}>★</span>
            ))}
          </div>

          <p className="hotel-card__desc">{hotel.description}</p>

          <div className="hotel-card__amenities">
            {hotel.amenities.map((a) => (
              <span key={a} className="hotel-card__amenity">{a}</span>
            ))}
          </div>
        </div>

        <div className="hotel-card__footer">
          <div className="hotel-card__price">
            <span className="hotel-card__price-amount">${hotel.price}</span>
            <span className="hotel-card__price-label">Per Night</span>
          </div>
          <div className="hotel-card__actions">
            <button className="btn-outline">View Details</button>
            <button
              className="btn-primary"
              disabled={!hotel.available}
              onClick={() => onBookNow(hotel)}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
