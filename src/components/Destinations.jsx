import { useRef, useState, useEffect, useCallback } from 'react'

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'
const FORMSPREE_URL = 'https://formspree.io/f/xqeopbeb'

const FALLBACK_PLACES = [
  {
    title: 'Lagos City Escape',
    desc: 'Urban energy, beaches, nightlife',
    img: 'https://res.cloudinary.com/dgjcl0te0/image/upload/q_auto/f_auto/v1780581204/lagos_bo1dux.png',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/lagos.mp4',
    category: 'City',
    highlights: ['Lekki Beach', 'Victoria Island', 'Afrobeats nightlife', 'Street food culture'],
    bestTime: 'Nov – Feb',
    duration: '3–5 days',
    tagline: 'Africa\'s most electric city — where hustle meets the ocean.',
  },
  {
    title: 'Ghana Heritage Journey',
    desc: 'Culture, history, and coastal rhythm',
    img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/ghana.mp4',
    category: 'Culture',
    highlights: ['Cape Coast Castle', 'Kakum Canopy Walk', 'Ashanti Kingdom', 'Accra Markets'],
    bestTime: 'Oct – Mar',
    duration: '5–7 days',
    tagline: 'Walk through centuries of history along the Gold Coast.',
  },
  {
    title: 'Benin Royal Experience',
    desc: 'Ancient kingdoms and rich traditions',
    img: 'https://res.cloudinary.com/dgjcl0te0/image/upload/v1780581557/benin_rihdlk.jpg',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/benin.mp4',
    category: 'Culture',
    highlights: ['Royal Palace Museum', 'Bronze artworks', 'Voodoo ceremonies', 'Ouidah Temple'],
    bestTime: 'Dec – Apr',
    duration: '4–6 days',
    tagline: 'The cradle of royal art, ceremony, and ancient power.',
  },
  {
    title: 'Tanzania Safari Expedition',
    desc: 'Wildlife, savannahs, and national parks',
    img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/tanzania.mp4',
    category: 'Safari',
    highlights: ['Serengeti Migration', 'Ngorongoro Crater', 'Mount Kilimanjaro', 'Maasai Villages'],
    bestTime: 'Jun – Oct',
    duration: '7–10 days',
    tagline: 'Witness the greatest wildlife spectacle on earth.',
  },
  {
    title: 'Cape Town Coastline',
    desc: 'Mountains meeting the ocean',
    img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/capetown.mp4',
    category: 'Beach',
    highlights: ['Table Mountain', 'Boulders Penguin Colony', 'Cape Winelands', 'Clifton Beaches'],
    bestTime: 'Oct – Apr',
    duration: '5–8 days',
    tagline: 'Where dramatic peaks dissolve into two oceans.',
  },
  {
    title: 'Zanzibar Escape',
    desc: 'Turquoise waters and island calm',
    img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/zanzibar.mp4',
    category: 'Beach',
    highlights: ['Stone Town UNESCO Site', 'Mnemba Atoll Diving', 'Spice Plantations', 'Nungwi Beach'],
    bestTime: 'Jun – Oct',
    duration: '4–7 days',
    tagline: 'Ivory sands, clove-scented breeze, and infinite blue.',
  },
  {
    title: 'Sahara Desert Ride',
    desc: 'Golden dunes and endless horizons',
    img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/sahara.mp4',
    category: 'Safari',
    highlights: ['Erg Chebbi Dunes', 'Camel Trekking', 'Berber Camps', 'Stargazing Nights'],
    bestTime: 'Oct – Apr',
    duration: '3–5 days',
    tagline: 'Lose yourself in the oldest silence on the planet.',
  },
  {
    title: 'Nairobi Safari Hub',
    desc: 'Wildlife parks and city nature blend',
    img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/nairobi.mp4',
    category: 'Safari',
    highlights: ['Nairobi National Park', 'Giraffe Centre', 'Karen Blixen Museum', 'David Sheldrick'],
    bestTime: 'Jul – Sep',
    duration: '3–5 days',
    tagline: 'The only city where lions roam beside the skyline.',
  },
  {
    title: 'Victoria Falls Wonder',
    desc: 'One of the world\'s greatest waterfalls',
    img: 'https://images.unsplash.com/photo-1587502537745-84b86da1204f?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/victoriafalls.mp4',
    category: 'Safari',
    highlights: ['Devil\'s Pool Swim', 'Bungee Jumping', 'Sunset Cruise', 'Rainforest Walk'],
    bestTime: 'Feb – May',
    duration: '3–4 days',
    tagline: 'Stand at the edge of the world\'s most thunderous curtain.',
  },
  {
    title: 'Dakar Atlantic Coast',
    desc: 'Surf culture and ocean winds',
    img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/dakar.mp4',
    category: 'Beach',
    highlights: ['Île de Gorée', 'Lac Rose', 'IFAN Museum', 'Yoff Beach Surfing'],
    bestTime: 'Nov – May',
    duration: '4–6 days',
    tagline: 'Where the Atlantic meets the soul of West Africa.',
  },
  {
    title: 'Morocco Imperial Cities',
    desc: 'Souks, riads, and desert gateways',
    img: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/q_auto/f_auto/v1780579385/morocco_dzgd1a.mp4',
    category: 'Culture',
    highlights: ['Marrakech Medina', 'Fes el-Bali', 'Sahara Desert Edge', 'Atlas Mountains'],
    bestTime: 'Mar – May',
    duration: '6–9 days',
    tagline: 'A labyrinth of colour, spice, and a thousand years of history.',
  },
  {
    title: 'Dubai City & Desert',
    desc: 'Skyline excess meets ancient sands',
    img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
    video: 'https://res.cloudinary.com/dgjcl0te0/video/upload/q_auto/f_auto/v1780579462/dubai_ce9kty.mp4',
    category: 'City',
    highlights: ['Burj Khalifa', 'Desert Safari', 'Gold & Spice Souks', 'Palm Jumeirah'],
    bestTime: 'Nov – Mar',
    duration: '4–6 days',
    tagline: 'Where the future was built overnight on top of ancient desert.',
  },
]

function BookingForm({ destination, onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', phone: '', email: '', date: '', travellers: '1', budget: '', message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const payload = {
      type: 'booking',
      destination: destination.title,
      ...form,
      timestamp: new Date().toISOString(),
    }
    try {
      fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          subject: `New Booking Enquiry — ${destination.title}`,
          ...payload,
        }),
      }).catch(() => {})
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-success">
        <div className="success-icon">✦</div>
        <h3>Interest Received</h3>
        <p>Thank you! We'll be in touch shortly to begin planning your journey to <strong>{destination.title}</strong>.</p>
        <button className="btn-close-success" onClick={onClose}>Close</button>
      </div>
    )
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <p className="form-heading">Express Interest</p>

      <div className="field-row">
        <div className="field">
          <label>Full Name *</label>
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="field">
          <label>Phone Number *</label>
          <input
            type="tel"
            placeholder="+234 800 000 0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="field">
        <label>Email <span style={{opacity:0.5, fontSize:'0.75em'}}>(optional)</span></label>
        <input
          type="email"
          placeholder="you@email.com"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label>Preferred Travel Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Travellers</label>
          <select value={form.travellers} onChange={e => setForm({ ...form, travellers: e.target.value })}>
            {['1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div className="field">
        <label>Budget Range</label>
        <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
          <option value="">Select a range</option>
          <option>Under $1,000</option>
          <option>$1,000 – $3,000</option>
          <option>$3,000 – $7,000</option>
          <option>$7,000+</option>
        </select>
      </div>

      <div className="field">
        <label>Special Requests</label>
        <textarea
          rows={3}
          placeholder="Anything specific you'd like us to know…"
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-book" disabled={loading}>
        {loading ? 'Sending…' : 'Book Now'}
      </button>
    </form>
  )
}

function Modal({ place, onClose }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdrop}>
      <div className="modal">

        {/* Video background */}
        <div className="modal-video-bg">
          <img src={place.img} alt={place.title} className="modal-fallback" />
          {place.video && (
            <video
              ref={videoRef}
              src={place.video}
              muted
              loop
              playsInline
              preload="auto"
              className="modal-video"
              onCanPlay={(e) => e.target.classList.add('ready')}
            />
          )}
          <div className="modal-vignette" />
        </div>

        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-body">

          {/* Left: Info */}
          <div className="modal-info">
            <span className="modal-category">{place.category}</span>
            <h2 className="modal-title">{place.title}</h2>
            <p className="modal-tagline">{place.tagline}</p>

            <div className="modal-meta">
              <div className="meta-item">
                <span className="meta-label">Best Time</span>
                <span className="meta-value">{place.bestTime}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Duration</span>
                <span className="meta-value">{place.duration}</span>
              </div>
            </div>

            <div className="modal-highlights">
              <p className="highlights-label">Highlights</p>
              <ul>
                {place.highlights.map(h => (
                  <li key={h}>
                    <span className="highlight-dot">◆</span> {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Form */}
          <div className="modal-form-col">
            <BookingForm destination={place} onClose={onClose} />
          </div>

        </div>
      </div>
    </div>
  )
}

export default function Destinations() {
  const scrollRef = useRef(null)
  const videoRefs = useRef({})
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeModal, setActiveModal] = useState(null)
  const [places, setPlaces] = useState(FALLBACK_PLACES)
  const [loadingPlaces, setLoadingPlaces] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])



  useEffect(() => {
    fetch(`${SCRIPT_URL}?action=getDestinations`)
      .then(res => res.json())
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          // Normalise highlights: Sheet may send a pipe-separated string
          const normalised = data.map(d => ({
            ...d,
            highlights: typeof d.highlights === 'string'
              ? d.highlights.split('|').map(s => s.trim()).filter(Boolean)
              : d.highlights || [],
          }))
          setPlaces(normalised)
        }
      })
      .catch(() => setFetchError('Could not load destinations from Sheet — showing defaults.'))
      .finally(() => setLoadingPlaces(false))
  }, [])

  // Derive categories dynamically from loaded places
  const categories = ['All', ...Array.from(new Set(places.map(p => p.category))).sort()]

  const filtered = activeCategory === 'All'
    ? places
    : places.filter(p => p.category === activeCategory)

  const [activeDot, setActiveDot] = useState(0)
  const dotCount = loadingPlaces ? 4 : filtered.length

  const onScroll = () => {
    if (showSwipeHint) setShowSwipeHint(false)
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) { setActiveDot(0); return }
    const idx = Math.round((el.scrollLeft / max) * (dotCount - 1))
    setActiveDot(Math.min(idx, dotCount - 1))
  }

  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0, velocity: 0, frame: null })

  const onDown = (e) => {
    const el = scrollRef.current
    drag.current = { ...drag.current, isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
  }
  const onUp = () => {
    drag.current.isDown = false
    const momentum = () => {
      scrollRef.current.scrollLeft += drag.current.velocity
      drag.current.velocity *= 0.92
      if (Math.abs(drag.current.velocity) > 0.5) drag.current.frame = requestAnimationFrame(momentum)
    }
    momentum()
  }
  const onMove = (e) => {
    if (!drag.current.isDown) return
    const el = scrollRef.current
    const walk = (e.pageX - el.offsetLeft) - drag.current.startX
    drag.current.velocity = walk * 0.15
    el.scrollLeft = drag.current.scrollLeft - walk
  }

  const preloadedLinks = useRef({})

  const preloadVideo = (place) => {
    if (place.video && !preloadedLinks.current[place.title]) {
      preloadedLinks.current[place.title] = true
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = place.video
      document.head.appendChild(link)
    }
  }

  const playVideo = (title) => { videoRefs.current[title]?.play().catch(() => {}) }
  const pauseVideo = (title) => {
    const v = videoRefs.current[title]
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <section className="destinations" id="destinations">

      <div className="destinations__header">
        <p className="section-eyebrow">Where to next</p>
        <h2>Popular Destinations</h2>
        <p className="section-sub">Drag to explore. Click to discover.</p>

        <div className="destinations__filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={activeCategory === cat ? 'active' : ''}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {fetchError && (
        <p style={{ color: '#c9a84c', fontSize: '0.8rem', marginBottom: '1rem', opacity: 0.7 }}>
          {fetchError}
        </p>
      )}

      <div
        className="destinations__scroll"
        ref={scrollRef}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onMouseMove={onMove}
        onScroll={onScroll}
      >
        {loadingPlaces
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card card--skeleton">
                <div className="media skeleton-media" />
                <div className="content">
                  <div className="skeleton-line" style={{ width: '40%', height: '0.6rem', marginBottom: '0.6rem' }} />
                  <div className="skeleton-line" style={{ width: '80%', height: '1.2rem', marginBottom: '0.4rem' }} />
                  <div className="skeleton-line" style={{ width: '60%', height: '0.8rem' }} />
                </div>
              </div>
            ))
          : filtered.map((place) => (
          <div
            key={place.title}
            className="card"
            onClick={() => setActiveModal(place)}
            onMouseEnter={() => { preloadVideo(place); playVideo(place.title) }}
            onMouseLeave={() => pauseVideo(place.title)}
          >
            <div className="media">
              <img src={place.img} alt={place.title} />
              {place.video && (
                <video
                  ref={(el) => (videoRefs.current[place.title] = el)}
                  src={place.video}
                  muted loop playsInline
                />
              )}
              <div className="card-overlay" />
            </div>
            <div className="content">
              <span className="card-cat">{place.category}</span>
              <h3>{place.title}</h3>
              <p>{place.desc}</p>
              <button className="card-cta">Explore →</button>
            </div>
          </div>
        ))
      }
      </div>

      {/* SWIPE HINT — mobile only */}
      {isMobile && (
        <div className={`dest__swipe-hint${showSwipeHint ? ' visible' : ''}`}>
          <span className="dest__swipe-arrow">←</span>
          <span>Swipe to explore</span>
          <span className="dest__swipe-arrow">→</span>
        </div>
      )}

      {/* SCROLL DOTS */}
      {dotCount > 1 && (
        <div className="dest__dots">
          {Array.from({ length: dotCount }).map((_, i) => (
            <div
              key={i}
              className={`dest__dot${activeDot === i ? ' active' : ''}`}
            />
          ))}
        </div>
      )}

      {activeModal && (
        <Modal place={activeModal} onClose={() => setActiveModal(null)} />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .destinations {
          padding: 120px 6vw;
          background: #080808;
          color: white;
          font-family: 'DM Sans', sans-serif;
        }

        .section-eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.5rem;
        }

        .destinations__header h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 300;
          letter-spacing: -0.01em;
          margin: 0 0 0.3rem;
        }

        .section-sub {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin-bottom: 1.8rem;
        }

        .destinations__filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 2.5rem;
        }

        .destinations__filters button {
          padding: 0.45rem 1.1rem;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
        }

        .destinations__filters button:hover {
          border-color: rgba(201,168,76,0.5);
          color: #c9a84c;
        }

        .destinations__filters .active {
          background: #c9a84c;
          border-color: #c9a84c;
          color: #080808;
        }

        .destinations__scroll {
          display: flex;
          gap: 1.2rem;
          overflow-x: auto;
          cursor: grab;
          scroll-snap-type: x mandatory;
          padding-bottom: 1rem;
          user-select: none;
        }

        .destinations__scroll:active { cursor: grabbing; }
        .destinations__scroll::-webkit-scrollbar { display: none; }

        .card {
          min-width: 380px;
          max-width: 380px;
          scroll-snap-align: start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          cursor: pointer;
          transition: border-color 0.3s, transform 0.3s;
          flex-shrink: 0;
        }


        /* Skeleton loading state */
        @keyframes shimmer {
          0% { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton-media,
        .skeleton-line {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: 2px;
        }
        .card--skeleton { pointer-events: none; }
        .skeleton-media { width: 100%; height: 100%; position: absolute; inset: 0; }

        .card:hover {
          border-color: rgba(201,168,76,0.4);
          transform: translateY(-4px);
        }

        .media {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .media img,
        .media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .media video { opacity: 0; }
        .card:hover .media video { opacity: 1; }
        .card:hover .media img { opacity: 0; }
        .card:hover .media img { transform: scale(1.04); }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%);
          pointer-events: none;
        }

        .content {
          padding: 1.1rem 1.2rem 1.3rem;
        }

        .card-cat {
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a84c;
          display: block;
          margin-bottom: 0.4rem;
        }

        .content h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 400;
          margin: 0 0 0.3rem;
          line-height: 1.2;
        }

        .content p {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          margin: 0 0 0.9rem;
        }

        .card-cta {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .card-cta:hover {
          background: #c9a84c;
          color: #080808;
        }

        /* ---- MODAL ---- */

        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.93);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          animation: fadeIn 0.25s ease;
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        .modal {
          position: relative;
          width: 100%;
          max-width: 1100px;
          height: min(600px, 88vh);
          overflow: hidden;
          border: 1px solid rgba(201,168,76,0.25);
          animation: slideUp 0.35s ease;
        }

        .modal-video-bg {
          position: absolute;
          inset: 0;
        }

        .modal-fallback,
        .modal-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .modal-video {
          opacity: 0;
          transition: opacity 1.2s ease;
        }

        .modal-video.ready { opacity: 1; }

        .modal-vignette {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.75);
        }

        .modal-close {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          z-index: 10;
          background: rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          width: 36px;
          height: 36px;
          cursor: pointer;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .modal-close:hover {
          border-color: #c9a84c;
          color: #c9a84c;
        }

        .modal-body {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
        }

        /* Left info column */
        .modal-info {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.08);
        }

        .modal-category {
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.7rem;
          display: block;
        }

        .modal-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 300;
          line-height: 1.1;
          margin: 0 0 0.8rem;
          color: white;
        }

        .modal-tagline {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          margin: 0 0 1.8rem;
          font-style: italic;
        }

        .modal-meta {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.8rem;
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .meta-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        .meta-value {
          font-size: 0.95rem;
          color: white;
          font-weight: 500;
        }

        .highlights-label {
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0 0 0.7rem;
        }

        .modal-highlights ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.4rem 1rem;
        }

        .modal-highlights li {
          font-size: 0.83rem;
          color: rgba(255,255,255,0.7);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .highlight-dot {
          color: #c9a84c;
          font-size: 0.4rem;
        }

        /* Right form column */
        .modal-form-col {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow-y: auto;
          background: rgba(0,0,0,0.3);
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }

        .form-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 400;
          color: white;
          margin: 0 0 0.5rem;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.7rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .field label {
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .field input,
        .field select,
        .field textarea {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          padding: 0.55rem 0.8rem;
          outline: none;
          transition: border-color 0.2s;
          resize: none;
          appearance: none;
          -webkit-appearance: none;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .field input:focus,
        .field select:focus,
        .field textarea:focus {
          border-color: rgba(201,168,76,0.5);
        }

        .field select option {
          background: #1a1a1a;
          color: white;
        }

        .btn-book {
          background: #c9a84c;
          border: none;
          color: #080808;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.85rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          margin-top: 0.4rem;
        }

        .btn-book:hover { background: #e0bc60; }
        .btn-book:disabled {
          background: rgba(201,168,76,0.35);
          color: rgba(0,0,0,0.5);
          cursor: not-allowed;
          transform: none;
        }
        .btn-book:active { transform: scale(0.99); }

        /* Success state */
        .form-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          height: 100%;
          gap: 1rem;
          padding: 1rem;
        }

        .success-icon {
          font-size: 2rem;
          color: #c9a84c;
        }

        .form-success h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          margin: 0;
          color: white;
        }

        .form-success p {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.55);
          line-height: 1.6;
          max-width: 260px;
          margin: 0;
        }

        .form-success strong { color: #c9a84c; }

        .btn-close-success {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.6rem 1.4rem;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s;
        }

        .btn-close-success:hover {
          background: #c9a84c;
          color: #080808;
        }
        /* ── RESPONSIVE ── */

        @media (max-width: 860px) {
          .destinations {
            padding: 80px 5vw;
          }

          .card {
            min-width: 300px;
            max-width: 300px;
          }

          .media { height: 220px; }
        }

        @media (max-width: 767px) {
          .destinations {
            padding: 64px 5vw 48px;
          }

          .destinations__header h2 {
            font-size: 2.2rem;
          }

          .card {
            min-width: 85vw;
            max-width: 85vw;
          }

          .media { height: 200px; }

          /* Modal — slide up from bottom, full width */
          .modal-backdrop {
            padding: 0;
            align-items: flex-end;
          }

          .modal {
            width: 100vw;
            height: 92vh;
            max-width: 100vw;
            border-left: none;
            border-right: none;
            border-bottom: none;
            border-radius: 0;
          }

          .modal-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            height: 100%;
            overflow-y: auto;
          }

          .modal-info {
            padding: 2.5rem 1.6rem 2rem;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            justify-content: flex-start;
            min-height: 52vh;
          }

          .modal-title { font-size: 2.2rem; }
          .modal-tagline { font-size: 0.95rem; margin-bottom: 1.6rem; line-height: 1.6; }
          .modal-meta { gap: 1.6rem; margin-bottom: 1.6rem; }
          .meta-value { font-size: 1rem; }

          .modal-highlights ul {
            grid-template-columns: 1fr 1fr;
          }

          .modal-form-col {
            padding: 1.4rem 1.4rem 2rem;
            justify-content: flex-start;
            overflow-y: visible;
          }

          .field-row {
            grid-template-columns: 1fr;
          }

          .modal-close {
            top: 0.75rem;
            right: 0.75rem;
          }

          /* Swipe hint */
          .dest__swipe-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            margin-top: 1.2rem;
            font-family: 'DM Sans', sans-serif;
            font-size: 0.68rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: rgba(201,168,76,0.5);
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: none;
          }

          .dest__swipe-hint.visible { opacity: 1; }

          .dest__swipe-arrow {
            display: inline-block;
            animation: dest-nudge 0.9s ease-in-out infinite alternate;
          }

          .dest__swipe-arrow:last-child {
            animation-direction: alternate-reverse;
          }

          @keyframes dest-nudge {
            from { transform: translateX(-4px); }
            to   { transform: translateX(4px); }
          }
        }

        @media (min-width: 768px) {
          .dest__swipe-hint { display: none; }
        }

        /* SCROLL DOTS */
        .dest__dots {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.45rem;
          margin-top: 1.8rem;
        }

        .dest__dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .dest__dot.active {
          width: 22px;
          border-radius: 3px;
          background: #c9a84c;
        }
      `}</style>
    </section>
  )
}
