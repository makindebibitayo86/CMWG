import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './BookingWizard.css'

/* ─── Fallback destination + hotel data — used only until the sheet data loads,
   or if the fetch fails ──────────────────────────────────────────────────── */
const FALLBACK_DESTINATIONS = [
  { key: 'Paris, France', name: 'Paris', sub: 'France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=700&q=80' },
  { key: 'Tokyo, Japan', name: 'Tokyo', sub: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=700&q=80' },
  { key: 'Santorini, Greece', name: 'Santorini', sub: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=80' },
  { key: 'New York, USA', name: 'New York', sub: 'USA', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=700&q=80' },
  { key: 'Dubai, UAE', name: 'Dubai', sub: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=80' },
  { key: 'Bali, Indonesia', name: 'Bali', sub: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=80' },
  { key: 'Lagos, Nigeria', name: 'Lagos', sub: 'Nigeria', img: 'https://images.unsplash.com/photo-1618828665347-7484933dadf0?w=700&q=80' },
  { key: 'Abuja, Nigeria', name: 'Abuja', sub: 'Nigeria', img: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=700&q=80' },
  { key: 'Cape Town, South Africa', name: 'Cape Town', sub: 'South Africa', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=700&q=80' },
  { key: 'Johannesburg, South Africa', name: 'Johannesburg', sub: 'South Africa', img: 'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=700&q=80' },
  { key: 'Nairobi, Kenya', name: 'Nairobi', sub: 'Kenya', img: 'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=700&q=80' },
  { key: 'Cairo, Egypt', name: 'Cairo', sub: 'Egypt', img: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=700&q=80' },
  { key: 'Marrakech, Morocco', name: 'Marrakech', sub: 'Morocco', img: 'https://images.unsplash.com/photo-1597212720158-3b1bc5b97c64?w=700&q=80' },
  { key: 'Accra, Ghana', name: 'Accra', sub: 'Ghana', img: 'https://images.unsplash.com/photo-1572697358620-7d0bd83cb15a?w=700&q=80' },
  { key: 'Zanzibar, Tanzania', name: 'Zanzibar', sub: 'Tanzania', img: 'https://images.unsplash.com/photo-1589197331516-4d84b72ebde3?w=700&q=80' },
]

/* Generic hotel exterior/interior photos, cycled per-city since we don't
   have real per-hotel photography for the new destinations */
const HOTEL_IMG_POOL = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=80',
]

const FALLBACK_HOTELS = {
  'Paris, France': [
    { name: 'Ritz Paris', price: 950 },
    { name: 'Four Seasons Hotel George V', price: 1100 },
    { name: 'Hilton Paris Opéra', price: 280 },
    { name: 'Le Meurice', price: 820 },
    { name: 'Hôtel Plaza Athénée', price: 990 },
    { name: 'Novotel Paris Centre Tour Eiffel', price: 210 },
    { name: 'Citadines Saint-Germain-des-Prés', price: 175 },
    { name: 'Shangri-La Hotel Paris', price: 870 },
  ],
  'Tokyo, Japan': [
    { name: 'Park Hyatt Tokyo', price: 480 },
    { name: 'Mandarin Oriental Tokyo', price: 620 },
    { name: 'Hilton Tokyo', price: 290 },
    { name: 'The Ritz-Carlton Tokyo', price: 690 },
    { name: 'Shinjuku Granbell Hotel', price: 150 },
    { name: 'Asakusa View Hotel', price: 170 },
    { name: 'Conrad Tokyo', price: 510 },
    { name: 'Tokyo Marriott Hotel', price: 340 },
  ],
  'Santorini, Greece': [
    { name: 'Katikies Hotel Santorini', price: 850 },
    { name: 'Canaves Oia Suites', price: 720 },
    { name: 'Grace Hotel Santorini, Auberge Resorts Collection', price: 780 },
    { name: 'Santo Pure Oia Suites', price: 540 },
    { name: 'Fira Boutique Hotel', price: 190 },
    { name: 'Kamari Beach Resort', price: 220 },
    { name: 'Mystique, a Luxury Collection Hotel', price: 690 },
  ],
  'New York, USA': [
    { name: 'The Plaza', price: 750 },
    { name: 'Waldorf Astoria New York', price: 680 },
    { name: 'New York Marriott Marquis', price: 360 },
    { name: 'Hilton Midtown', price: 320 },
    { name: 'The Ritz-Carlton New York, Central Park', price: 890 },
    { name: 'Sheraton New York Times Square', price: 290 },
    { name: 'Brooklyn Loft Hotel', price: 220 },
    { name: 'citizenM New York Times Square', price: 210 },
  ],
  'Dubai, UAE': [
    { name: 'Burj Al Arab Jumeirah', price: 1900 },
    { name: 'Atlantis, The Palm', price: 650 },
    { name: 'Armani Hotel Dubai', price: 720 },
    { name: 'Address Downtown', price: 480 },
    { name: 'JW Marriott Marquis Dubai', price: 340 },
    { name: 'Raffles Dubai', price: 510 },
    { name: 'Radisson Blu Dubai Deira Creek', price: 230 },
    { name: 'Four Seasons Resort Dubai at Jumeirah Beach', price: 780 },
    { name: 'Rove Downtown Dubai', price: 140 },
  ],
  'Bali, Indonesia': [
    { name: 'Four Seasons Resort Bali at Sayan', price: 920 },
    { name: 'The Mulia, Bali', price: 480 },
    { name: 'Ayana Resort and Spa Bali', price: 390 },
    { name: 'Hanging Gardens of Bali', price: 560 },
    { name: 'Seminyak Beach Club', price: 230 },
    { name: 'Canggu Surf Lodge', price: 140 },
    { name: 'Ubud Rice Field Villa', price: 160 },
  ],
  'Lagos, Nigeria': [
    { name: 'Eko Hotel & Suites', price: 260 },
    { name: 'Radisson Blu Hotel Lagos Ikeja', price: 230 },
    { name: 'Four Points by Sheraton Lagos', price: 210 },
    { name: 'Lagos Continental Hotel', price: 240 },
    { name: 'Wheatbaker Hotel', price: 280 },
    { name: 'Banana Island Residence', price: 340 },
    { name: 'Oniru Beachfront Suites', price: 240 },
  ],
  'Abuja, Nigeria': [
    { name: 'Transcorp Hilton Abuja', price: 280 },
    { name: 'Sheraton Abuja Hotel', price: 230 },
    { name: 'Nicon Luxury Hotel Abuja', price: 175 },
    { name: 'Fraser Suites Abuja', price: 210 },
    { name: 'Jabi Lake Residence', price: 165 },
  ],
  'Cape Town, South Africa': [
    { name: 'One&Only Cape Town', price: 580 },
    { name: 'The Table Bay Hotel', price: 420 },
    { name: 'Belmond Mount Nelson Hotel', price: 510 },
    { name: 'Radisson Blu Hotel Waterfront Cape Town', price: 230 },
    { name: 'Camps Bay Cliffside', price: 340 },
    { name: 'Bo-Kaap Boutique Stay', price: 175 },
  ],
  'Johannesburg, South Africa': [
    { name: 'Sandton Sun Hotel', price: 230 },
    { name: 'The Saxon Hotel, Villas and Spa', price: 480 },
    { name: 'Radisson Blu Sandton', price: 220 },
    { name: 'Melrose Arch Residences', price: 240 },
    { name: 'Maboneng Loft Hotel', price: 145 },
  ],
  'Nairobi, Kenya': [
    { name: 'Hilton Nairobi', price: 220 },
    { name: 'Radisson Blu Nairobi Upper Hill', price: 200 },
    { name: 'Villa Rosa Kempinski Nairobi', price: 290 },
    { name: 'Karen Acacia Lodge', price: 190 },
    { name: 'Nairobi National Park View', price: 280 },
  ],
  'Cairo, Egypt': [
    { name: 'Four Seasons Hotel Cairo at Nile Plaza', price: 480 },
    { name: 'Marriott Mena House, Cairo', price: 420 },
    { name: 'Cairo Marriott Hotel & Omar Khayyam Casino', price: 260 },
    { name: 'Nile Corniche Suites', price: 210 },
    { name: 'Khan el-Khalili Boutique', price: 140 },
  ],
  'Marrakech, Morocco': [
    { name: 'La Mamounia', price: 650 },
    { name: 'Royal Mansour Marrakech', price: 1100 },
    { name: 'Four Seasons Resort Marrakech', price: 580 },
    { name: 'Medina Riad Retreat', price: 180 },
    { name: 'Palmeraie Desert Resort', price: 290 },
  ],
  'Accra, Ghana': [
    { name: 'Kempinski Hotel Gold Coast City Accra', price: 280 },
    { name: 'Labadi Beach Hotel', price: 200 },
    { name: 'Movenpick Ambassador Hotel Accra', price: 250 },
    { name: 'East Legon Garden Lodge', price: 170 },
  ],
  'Zanzibar, Tanzania': [
    { name: 'Park Hyatt Zanzibar', price: 620 },
    { name: 'Royal Zanzibar Beach Resort', price: 280 },
    { name: 'Stone Town Heritage Hotel', price: 190 },
    { name: 'Nungwi Beach Resort', price: 260 },
    { name: 'Kendwa Sunset Villas', price: 210 },
  ],
}

const VIEWS = [
  { value: 'Ocean view', label: 'Ocean', img: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?w=700&q=80' },
  { value: 'City view', label: 'City', img: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=700&q=80' },
  { value: 'Garden view', label: 'Garden', img: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=700&q=80' },
  { value: 'Pool view', label: 'Pool', img: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?w=700&q=80' },
  { value: 'Mountain view', label: 'Mountain', img: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=700&q=80' },
  { value: 'No preference', label: 'No preference', img: null },
]

const STEP_LABELS = ['Location', 'Hotel', 'View', 'Dates', 'Payment', 'Review']

function toDateStr(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function addDays(d, n) {
  const c = new Date(d)
  c.setDate(c.getDate() + n)
  return c
}
const today = new Date()

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function monthMatrix(year, month) {
  const firstDay = new Date(year, month, 1)
  const startOffset = (firstDay.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function nightsCopy(n) {
  if (n <= 0) return 'Select your check-in and check-out dates.'
  if (n === 1) return 'A quick getaway.'
  if (n <= 4) return 'A perfect short break.'
  if (n <= 9) return 'A proper escape.'
  return 'An extended retreat.'
}

/* ─── Coverflow carousel: center card is biggest, neighbors shrink
   and fade based on distance from center. Smoothly re-scales as the
   user drags/swipes/scrolls or uses the arrow buttons. ── */
function Carousel({ children }) {
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  /* Read the real width on the very first render instead of defaulting to
     `false` — otherwise the component briefly mounts as "desktop", the
     coverflow effect below fires once and writes inline transform/opacity
     directly onto the card DOM nodes, and those nodes get reused (not
     recreated) once `isMobile` flips true a moment later. The leftover
     scale/opacity is exactly the "first card big, rest small and faded"
     bug — so mobile must never run updateScales() even once. */
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  const [activeDot, setActiveDot] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  const items = Array.isArray(children) ? children : [children]
  const dotCount = items.length

  /* Track viewport — mirrors the `< 768` mobile check used elsewhere
     so the JS branch and the CSS breakpoint never disagree. */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* ── Desktop-only coverflow scaling — untouched, and skipped entirely on mobile ── */
  function updateScales() {
    const el = trackRef.current
    if (!el) return
    const trackRect = el.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2
    const els = el.querySelectorAll('.carousel__item')
    els.forEach((item) => {
      const r = item.getBoundingClientRect()
      const itemCenter = r.left + r.width / 2
      const dist = Math.abs(itemCenter - center)
      const norm = Math.min(dist / (trackRect.width / 2 + r.width / 2), 1)
      const scale = 1 - norm * 0.32
      const opacity = 1 - norm * 0.55
      item.style.transform = `scale(${scale})`
      item.style.opacity = opacity
      item.style.zIndex = String(Math.round((1 - norm) * 100))
    })
  }

  function scheduleUpdate() {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      updateScales()
      rafRef.current = null
    })
  }

  useEffect(() => {
    if (isMobile) return
    updateScales()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      el.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [children, isMobile])

  /* Belt-and-suspenders: if the viewport ever crosses from desktop into
     mobile (resize, not just first load), wipe any inline transform/
     opacity/z-index the coverflow effect left on the card nodes — same
     DOM nodes get reused across the branch switch, so nothing else
     would otherwise clear them. */
  useEffect(() => {
    if (!isMobile) return
    const el = trackRef.current
    if (!el) return
    el.querySelectorAll('.carousel__item').forEach((item) => {
      item.style.transform = ''
      item.style.opacity = ''
      item.style.zIndex = ''
    })
  }, [isMobile])

  function scrollByAmount(dir) {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.55
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  /* ── Mobile-only: plain scroll-snap track + dot tracking + swipe hint ── */
  const baselineScrollRef = useRef(null)

  function onMobileScroll() {
    const el = trackRef.current
    if (!el) return

    // The first scroll callback can fire from layout settling (scroll-snap,
    // images loading in) rather than an actual user swipe. Record that as
    // the baseline instead of treating it as "the user scrolled" — only a
    // real move past a small threshold should dismiss the hint.
    if (baselineScrollRef.current === null) {
      baselineScrollRef.current = el.scrollLeft
    }
    if (showSwipeHint && Math.abs(el.scrollLeft - baselineScrollRef.current) > 4) {
      setShowSwipeHint(false)
    }

    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) { setActiveDot(0); return }
    const idx = Math.round((el.scrollLeft / max) * (dotCount - 1))
    setActiveDot(Math.min(idx, dotCount - 1))
  }

  function scrollByCardMobile(dir) {
    const el = trackRef.current
    if (!el) return
    const cardWidth = el.querySelector('.carousel__item--mobile')?.offsetWidth || 300
    el.scrollBy({ left: dir * (cardWidth + 12), behavior: 'smooth' })
  }

  if (isMobile) {
    return (
      <div className="carousel carousel--mobile">
        <div className="carousel__track carousel__track--mobile" ref={trackRef} onScroll={onMobileScroll}>
          {items.map((child, i) => (
            <div className="carousel__item carousel__item--mobile" key={child.key ?? i}>
              {child}
            </div>
          ))}
        </div>

        {dotCount > 1 && (
          <div className="carousel__dots">
            <button className="carousel__arrow-btn" type="button" onClick={() => scrollByCardMobile(-1)} disabled={activeDot === 0} aria-label="Previous">
              ‹
            </button>
            <div className="carousel__dot-track">
              {Array.from({ length: dotCount }).map((_, i) => (
                <div key={i} className={`carousel__dot ${activeDot === i ? 'active' : ''}`} />
              ))}
            </div>
            <button className="carousel__arrow-btn" type="button" onClick={() => scrollByCardMobile(1)} disabled={activeDot === dotCount - 1} aria-label="Next">
              ›
            </button>
          </div>
        )}

        {showSwipeHint && (
          <div className="carousel__swipe-hint visible">
            <span className="carousel__swipe-arrow">←</span>
            <span>Swipe to explore</span>
            <span className="carousel__swipe-arrow">→</span>
          </div>
        )}
      </div>
    )
  }

  /* ── Desktop render — exactly as before ── */
  return (
    <div className="carousel">
      <button className="carousel__arrow carousel__arrow--left" type="button" onClick={() => scrollByAmount(-1)} aria-label="Scroll left">
        ‹
      </button>
      <div className="carousel__track" ref={trackRef}>
        {items.map((child, i) => (
          <div className="carousel__item" key={child.key ?? i}>
            {child}
          </div>
        ))}
      </div>
      <button className="carousel__arrow carousel__arrow--right" type="button" onClick={() => scrollByAmount(1)} aria-label="Scroll right">
        ›
      </button>
    </div>
  )
}

/* ─── Visual dual-month range calendar for the Dates step ──── */
function RangeCalendar({ checkIn, checkOut, activeField, onPick }) {
  const todayD = startOfDay(today)
  const [cursor, setCursor] = useState(() => {
    const ci = checkIn ? startOfDay(new Date(checkIn)) : todayD
    return new Date(ci.getFullYear(), ci.getMonth(), 1)
  })
  const [hoverDate, setHoverDate] = useState(null)

  const ciDate = checkIn ? startOfDay(new Date(checkIn)) : null
  const coDate = checkOut ? startOfDay(new Date(checkOut)) : null

  // Smart focus: whenever the active field is toggled (via the check-in/
  // check-out pills), jump the calendar to the relevant month automatically.
  useEffect(() => {
    let anchor
    if (activeField === 'checkout') anchor = coDate || ciDate || todayD
    else anchor = ciDate || todayD
    setCursor(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeField])

  const monthsToShow = [
    { year: cursor.getFullYear(), month: cursor.getMonth() },
    {
      year: cursor.getMonth() === 11 ? cursor.getFullYear() + 1 : cursor.getFullYear(),
      month: (cursor.getMonth() + 1) % 12,
    },
  ]

  function isSameDay(a, b) {
    return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }

  function isDisabled(d) {
    if (d < todayD) return true
    if (activeField === 'checkout' && ciDate && d <= ciDate) return true
    return false
  }

  function inRange(d) {
    if (!ciDate) return false
    const end = coDate || (activeField === 'checkout' ? hoverDate : null)
    if (!end) return false
    const lo = ciDate < end ? ciDate : end
    const hi = ciDate < end ? end : ciDate
    return d > lo && d < hi
  }

  function handleClick(d) {
    if (!d || isDisabled(d)) return
    onPick(toDateStr(d))
  }

  function prevMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))
  }
  function nextMonth() {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))
  }

  const canGoPrev = !(cursor.getFullYear() === todayD.getFullYear() && cursor.getMonth() === todayD.getMonth())

  return (
    <div className="cal" onMouseLeave={() => setHoverDate(null)}>
      <button className="cal__nav cal__nav--prev" type="button" onClick={prevMonth} disabled={!canGoPrev} aria-label="Previous month">‹</button>
      <button className="cal__nav cal__nav--next" type="button" onClick={nextMonth} aria-label="Next month">›</button>
      <div className="cal__months">
        {monthsToShow.map(({ year, month }) => (
          <div className="cal__month" key={`${year}-${month}`}>
            <div className="cal__month-label">{MONTH_NAMES[month]} {year}</div>
            <div className="cal__weekdays">
              {DAY_LABELS.map((l) => <span key={l}>{l}</span>)}
            </div>
            <div className="cal__grid">
              {monthMatrix(year, month).map((d, i) => {
                if (!d) return <span className="cal__cell cal__cell--empty" key={i} />
                const disabled = isDisabled(d)
                const isStart = isSameDay(d, ciDate)
                const isEnd = isSameDay(d, coDate)
                const isToday = isSameDay(d, todayD)
                const within = inRange(d)
                return (
                  <button
                    type="button"
                    key={i}
                    className={[
                      'cal__cell',
                      disabled ? 'cal__cell--disabled' : '',
                      isStart ? 'cal__cell--start' : '',
                      isEnd ? 'cal__cell--end' : '',
                      within ? 'cal__cell--in-range' : '',
                      isToday ? 'cal__cell--today' : '',
                    ].filter(Boolean).join(' ')}
                    disabled={disabled}
                    onMouseEnter={() => !disabled && setHoverDate(d)}
                    onClick={() => handleClick(d)}
                  >
                    {d.getDate()}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Animated nights counter ──────────────────────────────── */
function AnimatedNights({ value }) {
  return (
    <AnimatePresence mode="wait">
      <motion.strong
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.18 }}
        style={{ display: 'inline-block' }}
      >
        {value > 0 ? value : '–'}
      </motion.strong>
    </AnimatePresence>
  )
}

export default function BookingWizard() {
  const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'
  const FORMSPREE_URL = 'https://formspree.io/f/xqeopbeb'

  const [step, setStep] = useState(0)
  const [furthestStep, setFurthestStep] = useState(0)
  const [location, setLocation] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [view, setView] = useState(null)
  const [checkIn, setCheckIn] = useState(null)
  const [checkOut, setCheckOut] = useState(null)
  const [activeField, setActiveField] = useState('checkin')
  const [payment, setPayment] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [refCode, setRefCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [locations, setLocations] = useState(FALLBACK_DESTINATIONS)
  const [hotelsByLocation, setHotelsByLocation] = useState(FALLBACK_HOTELS)
  const [dataLoading, setDataLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const wizardRef = useRef(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  /* Whenever the step changes — via Continue, auto-advance, or a dot tap —
     jump to the top of the wizard so the new step's heading is what's
     visible, instead of leaving the scroll position wherever the old
     step's footer happened to be. Skips the very first mount. */
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  useEffect(() => {
    async function loadData() {
      try {
        const [locRes, hotelRes] = await Promise.all([
          fetch(`${WEBAPP_URL}?type=wizard_locations`),
          fetch(`${WEBAPP_URL}?type=wizard_hotels`),
        ])
        const locJson = await locRes.json()
        const hotelJson = await hotelRes.json()

        if (Array.isArray(locJson.data) && locJson.data.length) {
          setLocations(locJson.data)
        }
        if (Array.isArray(hotelJson.data) && hotelJson.data.length) {
          const grouped = {}
          hotelJson.data.forEach((h) => {
            const k = h.locationKey
            if (!grouped[k]) grouped[k] = []
            grouped[k].push(h)
          })
          setHotelsByLocation(grouped)
        }
      } catch (err) {
        // Sheet fetch failed — silently keep the fallback data already in state.
      } finally {
        setDataLoading(false)
      }
    }
    loadData()
  }, [])

  const nights =
    checkIn && checkOut && checkOut > checkIn
      ? Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0

  const total = hotel ? hotel.price * nights : 0

  function handleCalendarPick(dateStr) {
    if (activeField === 'checkin') {
      setCheckIn(dateStr)
      setCheckOut(null)
      setActiveField('checkout')
    } else {
      setCheckOut(dateStr)
      autoAdvance()
    }
  }

  function resetWizard() {
    setStep(0)
    setFurthestStep(0)
    setLocation(null)
    setHotel(null)
    setView(null)
    setCheckIn(null)
    setCheckOut(null)
    setActiveField('checkin')
    setPayment(null)
    setGuestName('')
    setGuestEmail('')
    setGuestPhone('')
    setRefCode('')
    setSubmitError(null)
  }

  async function submitBooking() {
    setSubmitting(true)
    setSubmitError(null)
    const code = 'REF-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    const body = {
      type: 'wizard_booking',
      refCode: code,
      guestName,
      guestEmail,
      guestPhone,
      location,
      hotel: hotel?.name,
      price: hotel?.price,
      view,
      checkIn,
      checkOut,
      nights,
      payment,
      total,
    }
    try {
      await fetch(WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(body),
      })
      setRefCode(code)

      // Notify the site owner — fire-and-forget so a Formspree hiccup
      // never blocks the confirmation screen or counts as a failed booking.
      fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: `New Booking — ${code}`,
          ...body,
        }),
      }).catch(() => {})
    } catch (err) {
      setSubmitError("Couldn't reach the server — check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function goNext() {
    if (step === 5) {
      submitBooking()
      return
    }
    setStep((s) => {
      const next = s + 1
      setFurthestStep((f) => Math.max(f, next))
      return next
    })
  }

  /* After a single-tap/click selection (Location/Hotel/View/Dates/Payment),
     advance automatically — short delay so the selected highlight is
     visible before the step transitions out. Same behavior on every device. */
  function autoAdvance() {
    setTimeout(() => goNext(), 280)
  }
  function goBack() {
    setStep((s) => s - 1)
  }
  function goToStep(i) {
    if (refCode) return // booking already confirmed — lock navigation
    if (i <= furthestStep) setStep(i)
  }

  function nextDisabled() {
    if (step === 0) return !location
    if (step === 1) return !hotel
    if (step === 2) return !view
    if (step === 3) return nights <= 0
    if (step === 4) return !payment
    if (step === 5) return !guestName.trim() || !guestEmail.trim() || submitting
    return false
  }

  function fmtDate(d) {
    return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '–'
  }

  useEffect(() => {
    if (step === 5 && refCode) {
      const t = setTimeout(resetWizard, 5000)
      return () => clearTimeout(t)
    }
  }, [step, refCode])

  return (
    <div className="wizard-wrap" ref={wizardRef}>
      {/* ── Progress bar ── */}
      <div className="progress-bar">
        {STEP_LABELS.map((label, i) => {
          const unlocked = i <= furthestStep && !refCode
          return (
            <div className="step-dot" key={label}>
              <button
                type="button"
                className={`dot ${i < step ? 'done' : ''} ${i === step ? 'active' : ''} ${unlocked ? 'clickable' : ''}`}
                onClick={() => goToStep(i)}
                disabled={!unlocked}
              >
                {i < step ? '✓' : i + 1}
              </button>
              <div className={`step-label ${i === step ? 'active' : ''}`}>{label}</div>
            </div>
          )
        })}
      </div>

      <div className="step-frame">
        <AnimatePresence mode="wait">
          {/* ── Step 0: Location ── */}
          {step === 0 && (
            <motion.div key="step0" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="step-heading">Where are you headed?</p>
              <p className="step-sub">{dataLoading ? 'Loading destinations…' : 'Pick a destination to see available hotels.'}</p>
              <Carousel>
                {locations.map((d) => (
                  <div
                    key={d.key}
                    className={`photo-card photo-card--carousel ${location === d.key ? 'selected' : ''}`}
                    onClick={() => {
                      setLocation(d.key)
                      setHotel(null)
                      autoAdvance()
                    }}
                  >
                    <div className="photo-card__img" style={{ backgroundImage: `url(${d.img})` }} />
                    <div className="photo-card__body">
                      <div className="photo-card__name">{d.name}</div>
                      <div className="photo-card__sub">{d.sub}</div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}

          {/* ── Step 1: Hotel ── */}
          {step === 1 && (
            <motion.div key="step1" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="step-heading">Choose your hotel</p>
              <p className="step-sub">Top picks in {location}</p>
              <Carousel>
                {(hotelsByLocation[location] || []).map((h, i) => (
                  <div
                    key={h.name}
                    className={`photo-card photo-card--carousel ${hotel?.name === h.name ? 'selected' : ''}`}
                    onClick={() => {
                      setHotel(h)
                      autoAdvance()
                    }}
                  >
                    <div className="photo-card__img" style={{ backgroundImage: `url(${h.img || HOTEL_IMG_POOL[i % HOTEL_IMG_POOL.length]})` }} />
                    <div className="photo-card__body">
                      <div className="photo-card__name">{h.name}</div>
                      <div className="photo-card__sub">from ${h.price}/night</div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}

          {/* ── Step 2: View ── */}
          {step === 2 && (
            <motion.div key="step2" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="step-heading">Pick your view</p>
              <p className="step-sub">What do you want to wake up to?</p>
              <Carousel>
                {VIEWS.map((v) => (
                  <div
                    key={v.value}
                    className={`photo-card photo-card--carousel ${view === v.value ? 'selected' : ''} ${!v.img ? 'photo-card--noimg' : ''}`}
                    onClick={() => {
                      setView(v.value)
                      autoAdvance()
                    }}
                  >
                    {v.img && <div className="photo-card__img" style={{ backgroundImage: `url(${v.img})` }} />}
                    <div className="photo-card__body">
                      <div className="photo-card__name">{v.label}</div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </motion.div>
          )}

          {/* ── Step 3: Dates ── */}
          {step === 3 && (
            <motion.div key="step3" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="step-heading">How long are you staying?</p>
              <p className="step-sub">{nightsCopy(nights)}</p>

              <div className="dates-col">
                <div className="cal-selector">
                  <button
                    type="button"
                    className={`cal-selector__field ${activeField === 'checkin' ? 'cal-selector__field--active' : ''}`}
                    onClick={() => {
                      setActiveField('checkin')
                      setCheckIn(null)
                      setCheckOut(null)
                    }}
                  >
                    <span className="cal-selector__label">Check-in</span>
                    <span className="cal-selector__value">{checkIn ? fmtDate(checkIn) : 'Tap a date'}</span>
                  </button>
                  <span className="cal-selector__arrow">→</span>
                  <button
                    type="button"
                    className={`cal-selector__field ${activeField === 'checkout' ? 'cal-selector__field--active' : ''}`}
                    onClick={() => checkIn && setActiveField('checkout')}
                    disabled={!checkIn}
                  >
                    <span className="cal-selector__label">Check-out</span>
                    <span className="cal-selector__value">{checkOut ? fmtDate(checkOut) : 'Tap a date'}</span>
                  </button>
                </div>
                <p className="cal-hint">
                  {activeField === 'checkin' ? 'Tap a date below to set your arrival.' : 'Tap a date below to set your departure.'}
                </p>

                <RangeCalendar
                  checkIn={checkIn}
                  checkOut={checkOut}
                  activeField={activeField}
                  onPick={handleCalendarPick}
                />

                <div className="nights-badge">
                  <span className="nights-badge__icon">🌙</span> <AnimatedNights value={nights} /> nights
                  {checkIn && checkOut && (
                    <span className="nights-badge__range"> · {fmtDate(checkIn)} → {fmtDate(checkOut)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 4: Payment ── */}
          {step === 4 && (
            <motion.div key="step4" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <p className="step-heading">How would you like to pay?</p>
              <p className="step-sub">Choose what works best for you.</p>
              <Carousel>
                <div
                  className={`photo-card photo-card--carousel ${payment === 'Book now' ? 'selected' : ''}`}
                  onClick={() => {
                    setPayment('Book now')
                    autoAdvance()
                  }}
                >
                  <div className="photo-card__img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=700&q=80)' }} />
                  <div className="photo-card__body">
                    <div className="photo-card__name">Book now</div>
                    <div className="photo-card__sub">Pay securely today, room guaranteed</div>
                  </div>
                </div>
                <div
                  className={`photo-card photo-card--carousel ${payment === 'Pay on arrival' ? 'selected' : ''}`}
                  onClick={() => {
                    setPayment('Pay on arrival')
                    autoAdvance()
                  }}
                >
                  <div className="photo-card__img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1554672723-d42a16e6e604?w=700&q=80)' }} />
                  <div className="photo-card__body">
                    <div className="photo-card__name">Pay on arrival</div>
                    <div className="photo-card__sub">Reserve now, pay at check-in</div>
                  </div>
                </div>
              </Carousel>
            </motion.div>
          )}

          {/* ── Step 5: Review & Confirm ── */}
          {step === 5 && (
            <motion.div key="step5" className="step-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              {!refCode ? (
                <div className="review-col">
                  <p className="step-heading">Review &amp; confirm</p>
                  <p className="step-sub">Tell us who's booking, then confirm the details below.</p>

                  <div className="contact-row">
                    <div className="field-group">
                      <label className="field-label">Full name</label>
                      <input
                        type="text"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Email</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="jane@email.com"
                      />
                    </div>
                    <div className="field-group">
                      <label className="field-label">Phone (optional)</label>
                      <input
                        type="tel"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-row"><span>Destination</span><span>{location}</span></div>
                    <div className="summary-row"><span>Hotel</span><span>{hotel?.name}</span></div>
                    <div className="summary-row"><span>View</span><span>{view}</span></div>
                    <div className="summary-row"><span>Dates</span><span>{fmtDate(checkIn)} → {fmtDate(checkOut)} ({nights} nights)</span></div>
                    <div className="summary-row"><span>Payment</span><span>{payment}</span></div>
                    <div className="summary-row"><span>Estimated total</span><span className="total-price">${total.toLocaleString()}</span></div>
                  </div>

                  {submitError && (
                    <p className="submit-error">{submitError}</p>
                  )}

                  <div className="btn-row">
                    {!isMobile && <button className="btn-back" onClick={goBack} disabled={submitting}>Back</button>}
                    <button className="btn-next" disabled={nextDisabled()} onClick={goNext}>
                      {submitting ? 'Submitting…' : 'Confirm booking'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="confirmed-wrap">
                  <div className="confirmed-icon">✓</div>
                  <div className="confirmed-title">Booking confirmed!</div>
                  <div className="confirmed-sub">
                    {hotel?.name} · {view} · {new Date(checkIn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} to {new Date(checkOut).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}. {payment}.
                  </div>
                  <div className="ref-code">{refCode}</div>
                  <p className="confirmed-reset-note">This will reset in a few seconds…</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
