import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DESTINATIONS = [
  { icon: '🗼', name: 'Paris, France' },
  { icon: '🗽', name: 'New York, USA' },
  { icon: '🌸', name: 'Tokyo, Japan' },
  { icon: '🏛️', name: 'Rome, Italy' },
  { icon: '🌊', name: 'Santorini, Greece' },
  { icon: '🏙️', name: 'Dubai, UAE' },
  { icon: '🌴', name: 'Bali, Indonesia' },
  { icon: '🎭', name: 'Barcelona, Spain' },
]

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export default function BookingForm({ onSearch }) {
  const [destination, setDestination] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [checkin, setCheckin] = useState(today)
  const [checkout, setCheckout] = useState(tomorrow)
  const [showGuestPop, setShowGuestPop] = useState(false)
  const [showRoomPop, setShowRoomPop] = useState(false)
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0 })
  const [rooms, setRooms] = useState(1)

  const destRef = useRef(null)
  const guestRef = useRef(null)
  const roomRef = useRef(null)

  // Close popups on outside click
  useEffect(() => {
    const handler = (e) => {
      if (destRef.current && !destRef.current.contains(e.target)) setShowDropdown(false)
      if (guestRef.current && !guestRef.current.contains(e.target)) setShowGuestPop(false)
      if (roomRef.current && !roomRef.current.contains(e.target)) setShowRoomPop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = DESTINATIONS.filter((d) =>
    destination.trim() === '' || d.name.toLowerCase().includes(destination.toLowerCase())
  )

  const guestTotal = guests.adults + guests.children

  const handleCounter = (key, delta, min = 0, max = 10) => {
    setGuests((prev) => ({ ...prev, [key]: Math.min(max, Math.max(min, prev[key] + delta)) }))
  }

  const handleSearch = () => {
    onSearch({ destination: destination || 'Paris, France', checkin, checkout, guests, rooms })
  }

  return (
    <div className="booking-form">
      <div className="booking-form__grid">
        {/* Destination */}
        <div className="booking-form__field" ref={destRef} style={{ position: 'relative' }}>
          <div className="booking-form__label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            Destination
          </div>
          <input
            className="booking-form__input"
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => { setDestination(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
          />
          <AnimatePresence>
            {showDropdown && filtered.length > 0 && (
              <motion.div
                className="booking-form__dropdown"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
              >
                {filtered.map((d) => (
                  <div
                    key={d.name}
                    className="booking-form__dropdown-item"
                    onClick={() => { setDestination(d.name); setShowDropdown(false) }}
                  >
                    <span>{d.icon}</span>
                    <span>{d.name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Check-in */}
        <div className="booking-form__field">
          <div className="booking-form__label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Check-in
          </div>
          <input
            type="date"
            className="booking-form__date-input"
            value={checkin}
            min={today}
            onChange={(e) => setCheckin(e.target.value)}
          />
        </div>

        {/* Check-out */}
        <div className="booking-form__field">
          <div className="booking-form__label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Check-out
          </div>
          <input
            type="date"
            className="booking-form__date-input"
            value={checkout}
            min={checkin}
            onChange={(e) => setCheckout(e.target.value)}
          />
        </div>

        {/* Guests */}
        <div className="booking-form__field" ref={guestRef} style={{ position: 'relative' }}
          onClick={() => { setShowGuestPop(!showGuestPop); setShowRoomPop(false) }}>
          <div className="booking-form__label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            Guests
          </div>
          <div className="booking-form__value">
            {guestTotal} {guestTotal === 1 ? 'Guest' : 'Guests'}
            {guests.infants > 0 && `, ${guests.infants} Infant${guests.infants > 1 ? 's' : ''}`}
          </div>
          <AnimatePresence>
            {showGuestPop && (
              <motion.div
                className="booking-form__popover"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
              >
                {[
                  { key: 'adults', label: 'Adults', sub: 'Age 13+', min: 1 },
                  { key: 'children', label: 'Children', sub: 'Age 2–12', min: 0 },
                  { key: 'infants', label: 'Infants', sub: 'Under 2', min: 0 },
                ].map(({ key, label, sub, min }) => (
                  <div key={key} className="popover-row">
                    <div className="popover-row__label">
                      <h4>{label}</h4>
                      <p>{sub}</p>
                    </div>
                    <div className="popover-counter">
                      <button className="popover-counter__btn" disabled={guests[key] <= min}
                        onClick={() => handleCounter(key, -1, min)}>−</button>
                      <span className="popover-counter__val">{guests[key]}</span>
                      <button className="popover-counter__btn" onClick={() => handleCounter(key, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rooms */}
        <div className="booking-form__field" ref={roomRef} style={{ position: 'relative' }}
          onClick={() => { setShowRoomPop(!showRoomPop); setShowGuestPop(false) }}>
          <div className="booking-form__label">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
            </svg>
            Rooms
          </div>
          <div className="booking-form__value">{rooms} {rooms === 1 ? 'Room' : 'Rooms'}</div>
          <AnimatePresence>
            {showRoomPop && (
              <motion.div
                className="booking-form__popover"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="popover-row">
                  <div className="popover-row__label">
                    <h4>Rooms</h4>
                    <p>Number of rooms</p>
                  </div>
                  <div className="popover-counter">
                    <button className="popover-counter__btn" disabled={rooms <= 1}
                      onClick={() => setRooms((r) => Math.max(1, r - 1))}>−</button>
                    <span className="popover-counter__val">{rooms}</span>
                    <button className="popover-counter__btn" onClick={() => setRooms((r) => Math.min(10, r + 1))}>+</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search */}
        <button className="booking-form__search-btn" onClick={handleSearch}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <span>Search Hotels</span>
        </button>
      </div>
    </div>
  )
}
