import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'

function calcNights(checkin, checkout) {
  if (!checkin || !checkout) return 1
  const diff = new Date(checkout) - new Date(checkin)
  return Math.max(1, Math.round(diff / 86400000))
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

const REF_ID = () => 'BK-' + Math.random().toString(36).substring(2, 8).toUpperCase()

export default function BookingModal({ hotel, searchParams, onClose }) {
  const [confirmed, setConfirmed] = useState(false)
  const [ref] = useState(REF_ID)

  const nights = useMemo(
    () => calcNights(searchParams?.checkin, searchParams?.checkout),
    [searchParams]
  )

  const taxes = Math.round(hotel.price * nights * 0.12)
  const serviceFee = 25
  const total = hotel.price * nights + taxes + serviceFee

  const guestSummary = searchParams?.guests
    ? (() => {
        const g = searchParams.guests
        const parts = [`${g.adults} Adult${g.adults > 1 ? 's' : ''}`]
        if (g.children > 0) parts.push(`${g.children} Child${g.children > 1 ? 'ren' : ''}`)
        if (g.infants > 0) parts.push(`${g.infants} Infant${g.infants > 1 ? 's' : ''}`)
        return parts.join(', ')
      })()
    : '2 Adults'

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal"
        initial={{ scale: 0.93, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 24 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <div>
            <h2 className="modal__title">
              {confirmed ? 'Booking Confirmed' : 'Complete Your Booking'}
            </h2>
            <p className="modal__subtitle">
              {confirmed ? `Reference: ${ref}` : 'Review your stay details before confirming'}
            </p>
          </div>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="modal__body">
          {confirmed ? (
            <motion.div
              className="modal__confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="modal__confirmed-icon">✦</span>
              <h3>Your stay is booked!</h3>
              <p>
                You're all set at <strong>{hotel.name}</strong>.<br />
                A confirmation has been sent to your email.
              </p>
              <span className="modal__ref">{ref}</span>
              <br /><br />
              <button className="modal__confirm-btn" onClick={onClose}>Close</button>
            </motion.div>
          ) : (
            <>
              {/* Hotel preview */}
              <div className="modal__hotel-preview">
                <img className="modal__hotel-img" src={hotel.image} alt={hotel.name} />
                <div className="modal__hotel-info">
                  <h3>{hotel.name}</h3>
                  <p>{hotel.location}</p>
                  <p style={{ marginTop: '0.4rem' }}>
                    {'★'.repeat(hotel.rating)}
                    <span style={{ color: 'rgba(250,250,248,0.25)' }}>{'★'.repeat(5 - hotel.rating)}</span>
                  </p>
                </div>
              </div>

              {/* Summary grid */}
              <div className="modal__summary-grid">
                <div className="modal__summary-item">
                  <label>Check-in</label>
                  <span>{formatDate(searchParams?.checkin)}</span>
                </div>
                <div className="modal__summary-item">
                  <label>Check-out</label>
                  <span>{formatDate(searchParams?.checkout)}</span>
                </div>
                <div className="modal__summary-item">
                  <label>Guests</label>
                  <span>{guestSummary}</span>
                </div>
                <div className="modal__summary-item">
                  <label>Rooms</label>
                  <span>{searchParams?.rooms || 1} Room{(searchParams?.rooms || 1) > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="modal__price-breakdown">
                <div className="modal__price-row">
                  <span>${hotel.price} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <strong>${hotel.price * nights}</strong>
                </div>
                <div className="modal__price-row">
                  <span>Taxes & fees (12%)</span>
                  <strong>${taxes}</strong>
                </div>
                <div className="modal__price-row">
                  <span>Service fee</span>
                  <strong>${serviceFee}</strong>
                </div>
              </div>

              <div className="modal__total-row">
                <span className="modal__total-label">Total ({nights} night{nights > 1 ? 's' : ''})</span>
                <span className="modal__total-price">${total}</span>
              </div>

              <button className="modal__confirm-btn" onClick={() => setConfirmed(true)}>
                Confirm Booking — ${total}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
