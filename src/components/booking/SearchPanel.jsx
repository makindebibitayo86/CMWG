import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './SearchPanel.css'

/* ─── RapidAPI Hotels autocomplete ───────────────────────────
   Replace RAPIDAPI_KEY with your actual key from
   https://rapidapi.com/apidojo/api/hotels4  (Hotels.com / Booking data)
   Endpoint: /locations/v3/search
────────────────────────────────────────────────────────────── */
const RAPIDAPI_KEY = 'YOUR_RAPIDAPI_KEY_HERE'

async function fetchDestinations(query) {
  const url = `https://hotels4.p.rapidapi.com/locations/v3/search?q=${encodeURIComponent(query)}&locale=en_US&langid=1033&siteid=300000001`
  const res = await fetch(url, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'hotels4.p.rapidapi.com',
    },
  })
  if (!res.ok) throw new Error('Autocomplete failed')
  const data = await res.json()
  // sr = search results array
  return (data.sr || [])
    .filter((item) => ['CITY', 'HOTEL', 'NEIGHBORHOOD', 'AIRPORT'].includes(item.type))
    .slice(0, 7)
    .map((item) => ({
      id: item.gaiaId || item.regionId || Math.random(),
      name: item.regionNames?.fullName || item.regionNames?.displayName || item.name,
      type: item.type,
      coordinates: item.coordinates,
    }))
}

/* ─── Icon helpers ────────────────────────────────────────── */
const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const IconUser = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconHotel = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const IconAirport = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>
  </svg>
)

function typeIcon(type) {
  if (type === 'HOTEL') return <IconHotel />
  if (type === 'AIRPORT') return <IconAirport />
  return <IconPin />
}

/* ─── Today's date helpers ────────────────────────────────── */
function toDateStr(date) {
  return date.toISOString().split('T')[0]
}
function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}
const today = new Date()
const defaultCheckIn = toDateStr(addDays(today, 1))
const defaultCheckOut = toDateStr(addDays(today, 4))

/* ─── Counter sub-component ───────────────────────────────── */
function Counter({ label, sublabel, value, min = 0, max = 20, onChange }) {
  return (
    <div className="sp-popover__row">
      <div className="sp-popover__row-label">
        <span>{label}</span>
        {sublabel && <small>{sublabel}</small>}
      </div>
      <div className="sp-counter">
        <button
          className="sp-counter__btn"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          type="button"
          aria-label={`Decrease ${label}`}
        >−</button>
        <span className="sp-counter__val">{value}</span>
        <button
          className="sp-counter__btn"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          type="button"
          aria-label={`Increase ${label}`}
        >+</button>
      </div>
    </div>
  )
}

/* ─── Main component ──────────────────────────────────────── */
export default function SearchPanel({ onSearch }) {
  // Destination
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [selectedDest, setSelectedDest] = useState(null)
  const [destLoading, setDestLoading] = useState(false)
  const [destOpen, setDestOpen] = useState(false)
  const destRef = useRef(null)

  // Dates
  const [checkIn, setCheckIn] = useState(defaultCheckIn)
  const [checkOut, setCheckOut] = useState(defaultCheckOut)

  // Guests popover
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const guestsRef = useRef(null)

  // Validation
  const [error, setError] = useState('')

  /* ── Autocomplete debounce ── */
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      setDestOpen(false)
      return
    }
    setDestLoading(true)
    const t = setTimeout(async () => {
      try {
        const results = await fetchDestinations(query)
        setSuggestions(results)
        setDestOpen(results.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setDestLoading(false)
      }
    }, 380)
    return () => clearTimeout(t)
  }, [query])

  /* ── Close popovers on outside click ── */
  useEffect(() => {
    function handler(e) {
      if (destRef.current && !destRef.current.contains(e.target)) setDestOpen(false)
      if (guestsRef.current && !guestsRef.current.contains(e.target)) setGuestsOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* ── Guest summary label ── */
  const guestSummary = `${adults} adult${adults !== 1 ? 's' : ''}${children > 0 ? `, ${children} child${children !== 1 ? 'ren' : ''}` : ''} · ${rooms} room${rooms !== 1 ? 's' : ''}`

  /* ── Check-out must be after check-in ── */
  function handleCheckInChange(val) {
    setCheckIn(val)
    if (val >= checkOut) setCheckOut(toDateStr(addDays(new Date(val), 1)))
  }

  /* ── Submit ── */
  function handleSearch() {
    if (!selectedDest) {
      setError('Please select a destination from the suggestions.')
      return
    }
    setError('')
    onSearch({
      destination: selectedDest.name,
      destinationId: selectedDest.id,
      coordinates: selectedDest.coordinates,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
    })
  }

  return (
    <div className="search-panel">
      <div className="sp-inner">

        {/* ── Destination ── */}
        <div className="sp-field sp-field--dest" ref={destRef}>
          <label className="sp-label">
            <IconPin /> Destination
          </label>
          <input
            className="sp-input"
            type="text"
            placeholder="City, hotel or landmark…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedDest(null)
            }}
            onFocus={() => suggestions.length > 0 && setDestOpen(true)}
            autoComplete="off"
          />
          {selectedDest && (
            <span className="sp-field__selected-badge">✓</span>
          )}

          <AnimatePresence>
            {destOpen && (
              <motion.ul
                className="sp-dropdown"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
              >
                {destLoading ? (
                  <li className="sp-dropdown__item sp-dropdown__item--loading">
                    <span className="sp-spinner" /> Searching…
                  </li>
                ) : (
                  suggestions.map((s) => (
                    <li
                      key={s.id}
                      className="sp-dropdown__item"
                      onMouseDown={() => {
                        setSelectedDest(s)
                        setQuery(s.name)
                        setDestOpen(false)
                      }}
                    >
                      <span className="sp-dropdown__icon">{typeIcon(s.type)}</span>
                      <span className="sp-dropdown__name">{s.name}</span>
                      <span className="sp-dropdown__type">{s.type.toLowerCase()}</span>
                    </li>
                  ))
                )}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        <div className="sp-divider" />

        {/* ── Check-in ── */}
        <div className="sp-field sp-field--date">
          <label className="sp-label">
            <IconCalendar /> Check-in
          </label>
          <input
            className="sp-input sp-input--date"
            type="date"
            value={checkIn}
            min={toDateStr(today)}
            onChange={(e) => handleCheckInChange(e.target.value)}
          />
        </div>

        <div className="sp-divider" />

        {/* ── Check-out ── */}
        <div className="sp-field sp-field--date">
          <label className="sp-label">
            <IconCalendar /> Check-out
          </label>
          <input
            className="sp-input sp-input--date"
            type="date"
            value={checkOut}
            min={toDateStr(addDays(new Date(checkIn), 1))}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>

        <div className="sp-divider" />

        {/* ── Guests ── */}
        <div className="sp-field sp-field--guests" ref={guestsRef}>
          <label className="sp-label">
            <IconUser /> Guests & Rooms
          </label>
          <button
            className="sp-input sp-input--guests-btn"
            type="button"
            onClick={() => setGuestsOpen((o) => !o)}
          >
            {guestSummary}
          </button>

          <AnimatePresence>
            {guestsOpen && (
              <motion.div
                className="sp-popover"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
              >
                <Counter label="Adults" sublabel="Age 18+" value={adults} min={1} max={16} onChange={setAdults} />
                <Counter label="Children" sublabel="Age 0–17" value={children} min={0} max={10} onChange={setChildren} />
                <Counter label="Rooms" value={rooms} min={1} max={8} onChange={setRooms} />
                <button
                  className="sp-popover__done"
                  type="button"
                  onClick={() => setGuestsOpen(false)}
                >
                  Done
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Search button ── */}
        <button className="sp-search-btn" type="button" onClick={handleSearch}>
          <IconSearch />
          <span>Search</span>
        </button>
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="sp-error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
