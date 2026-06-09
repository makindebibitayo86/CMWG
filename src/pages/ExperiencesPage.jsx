import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const GAS_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d)) return dateStr
  return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

// ─── Gallery Viewer (right panel of modal) ───────────────────────────────────
function GalleryViewer({ experience }) {
  const mediaItems = [
    { src: experience.coverImage, type: 'image', poster: null },
    ...(experience.coverVideo
      ? [{ src: experience.coverVideo, type: 'video', poster: experience.coverImage }]
      : []),
    ...experience.gallery
      .map(g => ({ ...g, src: g.src || g.url }))
      .filter(g => g.src !== experience.coverImage && g.src !== experience.coverVideo),
  ]

  const [activeIdx, setActiveIdx] = useState(0)
  const stripRef = useRef(null)
  const videoRef = useRef(null)
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0, velocity: 0 })
  const active = mediaItems[activeIdx]

  // Preload adjacent images so switching feels instant
  useEffect(() => {
    [-1, 1].forEach(offset => {
      const item = mediaItems[activeIdx + offset]
      if (item && item.type === 'image') {
        const img = new Image()
        img.src = item.src
      }
    })
  }, [activeIdx])

  // Auto-play video when it becomes active
  useEffect(() => {
    if (active.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [activeIdx, active.type])

  // Smooth drag-scroll on the thumbnail strip (ported from Merch.jsx)
  const onDown = (e) => {
    const el = stripRef.current
    if (!el) return
    drag.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, velocity: 0 }
  }
  const onUp = () => {
    drag.current.isDown = false
    const momentum = () => {
      if (!stripRef.current) return
      stripRef.current.scrollLeft += drag.current.velocity
      drag.current.velocity *= 0.92
      if (Math.abs(drag.current.velocity) > 0.5) requestAnimationFrame(momentum)
    }
    momentum()
  }
  const onMove = (e) => {
    if (!drag.current.isDown || !stripRef.current) return
    e.preventDefault()
    const walk = (e.pageX - stripRef.current.offsetLeft) - drag.current.startX
    drag.current.velocity = walk * 0.15
    stripRef.current.scrollLeft = drag.current.scrollLeft - walk
  }

  // Scroll active thumb into view
  useEffect(() => {
    if (!stripRef.current) return
    const btn = stripRef.current.children[activeIdx]
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeIdx])

  // Touch swipe for mobile carousel
  const touch = useRef({ startX: 0, startY: 0 })
  const carouselRef = useRef(null)

  const onTouchStart = (e) => {
    touch.current.startX = e.touches[0].clientX
    touch.current.startY = e.touches[0].clientY
  }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touch.current.startX
    const dy = Math.abs(e.changedTouches[0].clientY - touch.current.startY)
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      if (dx < 0) setActiveIdx(i => Math.min(mediaItems.length - 1, i + 1))
      else        setActiveIdx(i => Math.max(0, i - 1))
    }
  }

  return (
    <div className="xpg">

      {/* ── MOBILE: full-width swipe carousel ── */}
      <div
        className="xpg__carousel"
        ref={carouselRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {mediaItems.map((item, i) => (
          item.type === 'video' ? (
            <video
              key={item.src}
              ref={i === activeIdx ? videoRef : null}
              src={item.src}
              poster={item.poster || experience.coverImage}
              controls
              playsInline
              className="xpg__carousel-slide"
              style={{ transform: `translateX(${(i - activeIdx) * 100}%)` }}
            />
          ) : (
            <img
              key={item.src}
              src={item.src}
              alt={experience.title}
              className="xpg__carousel-slide"
              style={{ transform: `translateX(${(i - activeIdx) * 100}%)` }}
              onError={e => { e.target.style.opacity = '0' }}
            />
          )
        ))}

        {/* Prev / Next overlays */}
        {activeIdx > 0 && (
          <button className="xpg__carousel-btn xpg__carousel-btn--prev"
            onClick={() => setActiveIdx(i => i - 1)} aria-label="Previous">&#8249;</button>
        )}
        {activeIdx < mediaItems.length - 1 && (
          <button className="xpg__carousel-btn xpg__carousel-btn--next"
            onClick={() => setActiveIdx(i => i + 1)} aria-label="Next">&#8250;</button>
        )}

        {/* Dot indicators */}
        {mediaItems.length > 1 && (
          <div className="xpg__carousel-dots">
            {mediaItems.map((_, i) => (
              <span key={i} className={`xpg__carousel-dot${i === activeIdx ? ' active' : ''}`}
                onClick={() => setActiveIdx(i)} />
            ))}
          </div>
        )}
      </div>

      {/* ── DESKTOP: primary viewer + thumb strip ── */}
      <div className="xpg__desktop">
        <div className="xpg__main">
          {mediaItems.map((item, i) => (
            item.type === 'video' ? (
              <video
                key={item.src}
                ref={i === activeIdx ? videoRef : null}
                src={item.src}
                poster={item.poster || experience.coverImage}
                controls
                playsInline
                className="xpg__media"
                style={{ display: i === activeIdx ? 'block' : 'none' }}
              />
            ) : (
              <img
                key={item.src}
                src={item.src}
                alt={experience.title}
                className={`xpg__media xpg__media--img${i === activeIdx ? ' xpg__media--active' : ''}`}
                style={{ display: i === activeIdx ? 'block' : 'none' }}
                onError={e => { e.target.style.opacity = '0' }}
              />
            )
          ))}
        </div>

        {mediaItems.length > 1 && (
          <div className="xpg__strip-row">
            <button
              className="xpg__arrow"
              onClick={() => setActiveIdx(idx => Math.max(0, idx - 1))}
              disabled={activeIdx === 0}
              aria-label="Previous"
            >&#8249;</button>

            <div
              className="xpg__thumbs"
              ref={stripRef}
              onMouseDown={onDown}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onMouseMove={onMove}
            >
              {mediaItems.map((item, i) => (
                <button
                  key={i}
                  className={`xpg__thumb ${i === activeIdx ? 'active' : ''}`}
                  onClick={() => setActiveIdx(i)}
                  aria-label={`View media ${i + 1}`}
                >
                  <img
                    src={item.type === 'video' ? (item.poster || experience.coverImage) : item.src}
                    alt=""
                    width="54"
                    height="40"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={e => { e.target.style.opacity = '0.3' }}
                  />
                  {item.type === 'video' && <span className="xpg__play">&#9654;</span>}
                </button>
              ))}
            </div>

            <button
              className="xpg__arrow"
              onClick={() => setActiveIdx(idx => Math.min(mediaItems.length - 1, idx + 1))}
              disabled={activeIdx === mediaItems.length - 1}
              aria-label="Next"
            >&#8250;</button>
          </div>
        )}
      </div>

    </div>
  )
}

// ─── Experience Detail Modal ──────────────────────────────────────────────────
function ExperienceModal({ experience, onClose }) {
  const videoBgRef = useRef(null)
  const galleryRef = useRef(null)

  useEffect(() => {
    if (videoBgRef.current) {
      videoBgRef.current.play().catch(() => {})
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // On mobile, scroll down to the gallery after a short delay so user reads info first
  useEffect(() => {
    if (window.innerWidth < 1025 && galleryRef.current) {
      const timer = setTimeout(() => {
        galleryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleBackdrop = useCallback((e) => {
    if (e.target === e.currentTarget) onClose()
  }, [onClose])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="xpm-backdrop" onClick={handleBackdrop}>
      <div className="xpm" role="dialog" aria-modal="true">

        {/* Ambient video background */}
        <div className="xpm__bg">
          <img src={experience.coverImage} alt="" className="xpm__bg-img" />
          {experience.coverVideo && (
            <video
              ref={videoBgRef}
              src={experience.coverVideo}
              muted
              loop
              playsInline
              preload="auto"
              className="xpm__bg-video"
              onCanPlay={e => e.target.classList.add('ready')}
            />
          )}
          <div className="xpm__vignette" />
        </div>

        <button className="xpm__close" onClick={onClose} aria-label="Close">✕</button>

        <div className="xpm__body">

          {/* Left — story info */}
          <div className="xpm__info">
            <h2 className="xpm__title">{experience.title}</h2>
            <p className="xpm__tagline">{experience.tagline}</p>

            <div className="xpm__meta">
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">Destination</span>
                <span className="xpm-meta__value">{experience.destination}</span>
              </div>
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">When</span>
                <span className="xpm-meta__value">{formatDate(experience.date)}</span>
              </div>
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">Group</span>
                <span className="xpm-meta__value">{experience.groupSize} tourists</span>
              </div>
            </div>

            <div className="xpm__story xpm__story--desktop">
              <p>{experience.story}</p>
            </div>

            <Link
              to="/#destinations"
              className="xpm__book-btn xpm__book-btn--desktop"
              onClick={onClose}
            >
              Book a Similar Trip
            </Link>
          </div>

          {/* Right — gallery */}
          <div className="xpm__gallery" ref={galleryRef}>
            <GalleryViewer experience={experience} />
          </div>

          {/* Mobile-only: story + book CTA below gallery */}
          <div className="xpm__story-block">
            <div className="xpm__story">
              <p>{experience.story}</p>
            </div>
            <Link
              to="/#destinations"
              className="xpm__book-btn"
              onClick={onClose}
            >
              Book a Similar Trip
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeModal, setActiveModal] = useState(null)
  const [activeCard, setActiveCard] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const trackRef = useRef(null)
  const videoRefs = useRef({})

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1025)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const CACHE_KEY = 'xpp_experiences_cache'
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) {
      try {
        setExperiences(JSON.parse(cached))
        setLoading(false)
        return
      } catch (_) {}
    }
    fetch(`${GAS_URL}?type=experiences`)
      .then(r => r.json())
      .then(res => {
        const data = res.data || []
        setExperiences(data)
        setLoading(false)
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)) } catch (_) {}
      })
      .catch(err => {
        console.error('Failed to load experiences:', err)
        setError('Failed to load experiences. Please try again later.')
        setLoading(false)
      })
  }, [])

  const categories = [
    'All',
    ...Array.from(new Set(experiences.map(e => e.category))).sort(),
  ]

  const PER_PAGE = 6
  const [page, setPage] = useState(1)

  const filtered = activeCategory === 'All'
    ? experiences
    : experiences.filter(e => e.category === activeCategory)

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat)
    setPage(1)
    setActiveCard(0)
    setShowSwipeHint(true)
  }

  const handlePageChange = (p) => {
    setPage(p)
    setActiveCard(0)
    setShowSwipeHint(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const playVideo = (id) => videoRefs.current[id]?.play().catch(() => {})
  const pauseVideo = (id) => {
    const v = videoRefs.current[id]
    if (v) { v.pause(); v.currentTime = 0 }
  }

  return (
    <>
      <Navbar />

      <main className="xpp">

        {/* Page Hero */}
        <div className="xpp__hero">
          <p className="xpp__eyebrow">Our Story, Trip by Trip</p>
          <h1 className="xpp__heading">Past Experiences</h1>
          <p className="xpp__sub">Real journeys. Real people. Told through every frame.</p>
          <span className="xpp__rule" />
        </div>

        {/* Category Filters */}
        <div className="xpp__filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`xpp__filter ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Experience Grid — big + two small, alternating */}
        {loading && (
          <>
            {/* Mobile skeleton */}
            <div className="xpp__mobile-carousel xpp__mobile-carousel--skeleton">
              <div className="xpp__mobile-track">
                {[0,1,2].map(i => (
                  <div key={i} className="xpc xpc--mobile xpc--skeleton" />
                ))}
              </div>
            </div>
            {/* Desktop skeleton */}
            <div className="xpp__pages xpp__pages--skeleton">
              {[0,1].map(gi => (
                <div key={gi} className={`xpp__group ${gi % 2 === 1 ? 'xpp__group--flip' : ''}`}>
                  <div className="xpc xpc--large xpc--skeleton" />
                  <div className="xpp__small-stack">
                    <div className="xpc xpc--small xpc--skeleton" />
                    <div className="xpc xpc--small xpc--skeleton" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {error && (
          <div className="xpp__status xpp__status--error">{error}</div>
        )}

        {/* ── MOBILE: horizontal snap carousel, 1 card at a time ── */}
        {!loading && !error && (
          <div className="xpp__mobile-carousel">
            <div
              className="xpp__mobile-track"
              ref={trackRef}
              onScroll={() => {
                if (showSwipeHint) setShowSwipeHint(false)
                const el = trackRef.current
                if (!el) return
                const max = el.scrollWidth - el.clientWidth
                if (max <= 0) { setActiveCard(0); return }
                const idx = Math.round((el.scrollLeft / max) * (paginated.length - 1))
                setActiveCard(Math.min(idx, paginated.length - 1))
              }}
            >
              {paginated.map((exp) => (
                <article
                  key={exp.id}
                  className="xpc xpc--mobile"
                  onClick={() => setActiveModal(exp)}
                  onMouseEnter={() => playVideo(exp.id)}
                  onMouseLeave={() => pauseVideo(exp.id)}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && setActiveModal(exp)}
                  role="button"
                  aria-label={`View ${exp.title}`}
                >
                  <img src={exp.coverImage} alt={exp.title} className="xpc__img" draggable={false} loading="lazy" />
                  {exp.coverVideo && (
                    <video ref={el => videoRefs.current[exp.id] = el} src={exp.coverVideo}
                      muted loop playsInline preload="none" className="xpc__video"
                      onCanPlay={e => e.target.classList.add('ready')} />
                  )}
                  <div className="xpc__overlay" />
                  <div className="xpc__content">
                    <span className="xpc__category">{exp.category}</span>
                    <div className="xpc__bottom">
                      <h3 className="xpc__name">{exp.title}</h3>
                      <p className="xpc__meta">{exp.destination} &nbsp;·&nbsp; {formatDate(exp.date)} &nbsp;·&nbsp; {exp.groupSize} tourists</p>
                      <p className="xpc__tagline">{exp.tagline}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Swipe hint — fades out after first scroll */}
            {isMobile && (
              <div className={`xpp__swipe-hint${showSwipeHint ? ' visible' : ''}`}>
                <span className="xpp__swipe-arrow">←</span>
                <span>Swipe to explore</span>
                <span className="xpp__swipe-arrow">→</span>
              </div>
            )}

            {/* Dots + Arrows */}
            {paginated.length > 1 && (
              <div className="xpp__mc-nav">
                <button
                  className="xpp__mc-arrow"
                  onClick={() => {
                    const el = trackRef.current
                    if (!el) return
                    const max = el.scrollWidth - el.clientWidth
                    el.scrollTo({ left: (max / (paginated.length - 1)) * Math.max(0, activeCard - 1), behavior: 'smooth' })
                  }}
                  disabled={activeCard === 0}
                >←</button>

                <div className="xpp__mc-dots">
                  {paginated.map((_, i) => (
                    <span
                      key={i}
                      className={`xpp__mc-dot${i === activeCard ? ' active' : ''}`}
                      onClick={() => {
                        const el = trackRef.current
                        if (!el) return
                        const max = el.scrollWidth - el.clientWidth
                        el.scrollTo({ left: (max / (paginated.length - 1)) * i, behavior: 'smooth' })
                      }}
                    />
                  ))}
                </div>

                <button
                  className="xpp__mc-arrow"
                  onClick={() => {
                    const el = trackRef.current
                    if (!el) return
                    const max = el.scrollWidth - el.clientWidth
                    el.scrollTo({ left: (max / (paginated.length - 1)) * Math.min(paginated.length - 1, activeCard + 1), behavior: 'smooth' })
                  }}
                  disabled={activeCard === paginated.length - 1}
                >→</button>
              </div>
            )}
          </div>
        )}

        {/* ── DESKTOP: big + two small grid ── */}
        <div className="xpp__pages">
          {chunkArray(paginated, 3).map((group, gi) => {
            const flip = gi % 2 === 1
            const [a, b, c] = group
            return (
              <div key={gi} className={`xpp__group ${flip ? 'xpp__group--flip' : ''}`}>
                {a && (
                  <article
                    className="xpc xpc--large"
                    onClick={() => setActiveModal(a)}
                    onMouseEnter={() => playVideo(a.id)}
                    onMouseLeave={() => pauseVideo(a.id)}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setActiveModal(a)}
                    role="button"
                    aria-label={`View ${a.title}`}
                  >
                    <img src={a.coverImage} alt={a.title} className="xpc__img" draggable={false} loading="lazy" />
                    {a.coverVideo && (
                      <video ref={el => videoRefs.current[a.id] = el} src={a.coverVideo}
                        muted loop playsInline preload="none" className="xpc__video"
                        onCanPlay={e => e.target.classList.add('ready')} />
                    )}
                    <div className="xpc__overlay" />
                    <div className="xpc__content">
                      <span className="xpc__category">{a.category}</span>
                      <div className="xpc__bottom">
                        <h3 className="xpc__name">{a.title}</h3>
                        <p className="xpc__meta">{a.destination} &nbsp;·&nbsp; {formatDate(a.date)} &nbsp;·&nbsp; {a.groupSize} tourists</p>
                        <p className="xpc__tagline">{a.tagline}</p>
                      </div>
                    </div>
                  </article>
                )}

                <div className="xpp__small-stack">
                  {[b, c].map((exp, si) => exp ? (
                    <article
                      key={exp.id}
                      className="xpc xpc--small"
                      onClick={() => setActiveModal(exp)}
                      onMouseEnter={() => playVideo(exp.id)}
                      onMouseLeave={() => pauseVideo(exp.id)}
                      tabIndex={0}
                      onKeyDown={e => e.key === 'Enter' && setActiveModal(exp)}
                      role="button"
                      aria-label={`View ${exp.title}`}
                    >
                      <img src={exp.coverImage} alt={exp.title} className="xpc__img" draggable={false} loading="lazy" />
                      {exp.coverVideo && (
                        <video ref={el => videoRefs.current[exp.id] = el} src={exp.coverVideo}
                          muted loop playsInline preload="none" className="xpc__video"
                          onCanPlay={e => e.target.classList.add('ready')} />
                      )}
                      <div className="xpc__overlay" />
                      <div className="xpc__content">
                        <span className="xpc__category">{exp.category}</span>
                        <div className="xpc__bottom">
                          <h3 className="xpc__name">{exp.title}</h3>
                          <p className="xpc__meta">{exp.destination} &nbsp;·&nbsp; {formatDate(exp.date)}</p>
                          <p className="xpc__tagline">{exp.tagline}</p>
                        </div>
                      </div>
                    </article>
                  ) : (
                    <div key={si} className="xpc xpc--small xpc--empty" />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="xpp__pagination">
            <div className="xpp__pg-info">
              {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} experiences
            </div>
            <div className="xpp__pg-controls">
              <button className="xpp__pg-arrow" onClick={() => handlePageChange(page - 1)} disabled={page === 1} aria-label="Previous page">←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const far = totalPages > 7 && Math.abs(p - page) > 2 && p !== 1 && p !== totalPages
                const ellBefore = p === page - 3 && p !== 1
                const ellAfter  = p === page + 3 && p !== totalPages
                if (far && !ellBefore && !ellAfter) return null
                if (ellBefore || ellAfter) return <span key={p} className="xpp__pg-dots">···</span>
                return (
                  <button key={p} className={`xpp__pg-num ${p === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(p)} aria-label={`Page ${p}`} aria-current={p === page ? 'page' : undefined}>
                    {String(p).padStart(2, '0')}
                  </button>
                )
              })}
              <button className="xpp__pg-arrow" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} aria-label="Next page">→</button>
            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Modal */}
      {activeModal && (
        <ExperienceModal
          experience={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}

      <style>{`

        /* ═══════════════════════════════════════
           PAGE SHELL
        ═══════════════════════════════════════ */
        .xpp {
          background: #0a0a0a;
          min-height: 100vh;
          padding-bottom: 140px;
        }

        /* ═══════════════════════════════════════
           HERO
        ═══════════════════════════════════════ */
        .xpp__hero {
          padding: 160px 6vw 72px;
          text-align: center;
        }

        .xpp__eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.66rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a84c;
          margin: 0 0 1rem;
        }

        .xpp__heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 7vw, 5.5rem);
          font-weight: 300;
          color: #fafaf8;
          margin: 0 0 0.75rem;
          line-height: 0.95;
          letter-spacing: -0.01em;
        }

        .xpp__sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: rgba(250,250,248,0.38);
          letter-spacing: 0.04em;
          margin: 0;
        }

        .xpp__rule {
          display: block;
          width: 36px;
          height: 1px;
          background: #c9a84c;
          opacity: 0.55;
          margin: 2rem auto 0;
        }

        /* ═══════════════════════════════════════
           STATUS (loading / error)
        ═══════════════════════════════════════ */
        .xpp__status {
          text-align: center;
          padding: 4rem 2rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          color: rgba(250,250,248,0.28);
        }


        .xpp__status--error {
          color: rgba(220,80,80,0.7);
        }

        /* ═══════════════════════════════════════
           SKELETON LOADING
        ═══════════════════════════════════════ */
        @keyframes xpp-shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }

        .xpc--skeleton {
          cursor: default;
          background: #161616;
          background-image: linear-gradient(
            90deg,
            #161616 0px,
            #222 200px,
            #161616 400px
          );
          background-size: 600px 100%;
          animation: xpp-shimmer 1.6s infinite linear;
          pointer-events: none;
        }

        .xpc--skeleton::after { display: none; }

        .xpp__mobile-carousel--skeleton { display: none; }
        .xpp__pages--skeleton { display: block; }

        @media (max-width: 1024px) {
          .xpp__mobile-carousel--skeleton { display: block; }
          .xpp__pages--skeleton           { display: none; }
        }

        /* ═══════════════════════════════════════
           FILTERS
        ═══════════════════════════════════════ */
        .xpp__filters {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0 6vw 3.5rem;
          flex-wrap: wrap;
        }

        .xpp__filter {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.67rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.38);
          background: transparent;
          border: 1px solid rgba(250,250,248,0.1);
          padding: 0.5rem 1.1rem;
          cursor: pointer;
          transition: color 0.2s, border-color 0.2s, background 0.2s;
        }

        .xpp__filter:hover {
          color: rgba(250,250,248,0.8);
          border-color: rgba(250,250,248,0.25);
        }

        .xpp__filter.active {
          color: #c9a84c;
          border-color: rgba(201,168,76,0.45);
          background: rgba(201,168,76,0.06);
        }

        /* ═══════════════════════════════════════
           MOBILE CARD CAROUSEL
        ═══════════════════════════════════════ */
        .xpp__mobile-carousel {
          display: none;
          padding: 0 5vw;
        }

        .xpp__mobile-track {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 12px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }

        .xpp__mobile-track::-webkit-scrollbar { display: none; }

        .xpc--mobile {
          flex: 0 0 88vw;
          scroll-snap-align: center;
          height: 72vw;
          max-height: 380px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }

        /* Nav row: arrows + dots */
        .xpp__mc-nav {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.2rem;
          margin-top: 1.8rem;
        }

        .xpp__mc-dots {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .xpp__mc-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.22);
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        .xpp__mc-dot.active {
          width: 22px;
          border-radius: 3px;
          background: #c9a84c;
        }

        .xpp__mc-arrow {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.4);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, color 0.2s;
          flex-shrink: 0;
        }

        .xpp__mc-arrow:hover:not(:disabled) {
          border-color: rgba(201,168,76,0.5);
          color: #c9a84c;
        }

        .xpp__mc-arrow:disabled { opacity: 0.2; cursor: default; }

        /* Swipe hint — matches Merch exactly */
        .xpp__swipe-hint {
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

        .xpp__swipe-hint.visible { opacity: 1; }

        .xpp__swipe-arrow {
          display: inline-block;
          animation: xpp-nudge 0.9s ease-in-out infinite alternate;
        }

        .xpp__swipe-arrow:last-child {
          animation-direction: alternate-reverse;
        }

        @keyframes xpp-nudge {
          from { transform: translateX(-4px); }
          to   { transform: translateX(4px); }
        }

        /* ═══════════════════════════════════════
           PAGES + GROUPS
        ═══════════════════════════════════════ */
        .xpp__pages {
          padding: 0 6vw;
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .xpp__group {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          grid-template-rows: 320px 320px;
          gap: 8px;
        }

        .xpp__group .xpc--large {
          grid-column: 1;
          grid-row: 1 / span 2;
        }

        .xpp__group .xpp__small-stack {
          grid-column: 2;
          grid-row: 1 / span 2;
        }

        .xpp__group--flip {
          grid-template-columns: 1fr 1.55fr;
        }

        .xpp__group--flip .xpc--large {
          grid-column: 2;
          grid-row: 1 / span 2;
        }

        .xpp__group--flip .xpp__small-stack {
          grid-column: 1;
          grid-row: 1 / span 2;
        }

        .xpp__small-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* ═══════════════════════════════════════
           CARDS
        ═══════════════════════════════════════ */
        .xpc {
          position: relative;
          display: block;
          overflow: hidden;
          background: #111;
          cursor: pointer;
          outline: none;
        }

        .xpc:focus-visible {
          outline: 1px solid rgba(201,168,76,0.5);
          outline-offset: -1px;
        }

        .xpc--small { flex: 1; }
        .xpc--empty { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); cursor: default; }

        .xpc__img,
        .xpc__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .xpc__video {
          opacity: 0;
          transition: opacity 0.55s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .xpc__video.ready { opacity: 0; }
        .xpc:hover .xpc__img { transform: scale(1.05); }
        .xpc:hover .xpc__video.ready { opacity: 1; transform: scale(1.05); }

        .xpc__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%);
          z-index: 1;
        }

        .xpc__content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 1.4rem 1.6rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
        }

        .xpc__category {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.35);
          background: rgba(0,0,0,0.35);
          backdrop-filter: blur(6px);
          padding: 0.25rem 0.65rem;
          display: inline-block;
        }

        .xpc__bottom {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .xpc__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          color: #fafaf8;
          margin: 0;
          line-height: 1.1;
          font-size: 1.5rem;
        }

        .xpc--large .xpc__name { font-size: 2.2rem; }

        .xpc__meta {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          color: rgba(250,250,248,0.45);
          margin: 0;
          letter-spacing: 0.03em;
        }

        .xpc__tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem;
          font-style: italic;
          color: rgba(250,250,248,0);
          margin: 0;
          transform: translateY(6px);
          transition: color 0.3s ease, transform 0.3s ease;
        }

        .xpc:hover .xpc__tagline {
          color: rgba(250,250,248,0.65);
          transform: translateY(0);
        }

        /* ═══════════════════════════════════════
           PAGINATION
        ═══════════════════════════════════════ */
        .xpp__pagination {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.8rem;
          padding: 5rem 6vw 2rem;
        }

        .xpp__pg-info {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.22);
        }

        .xpp__pg-controls {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .xpp__pg-arrow {
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(250,250,248,0.4);
          font-size: 0.9rem;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .xpp__pg-arrow:hover:not(:disabled) {
          border-color: rgba(201,168,76,0.4);
          color: #c9a84c;
          background: rgba(201,168,76,0.05);
        }

        .xpp__pg-arrow:disabled { opacity: 0.2; cursor: default; }

        .xpp__pg-num {
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid transparent;
          color: rgba(250,250,248,0.3);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .xpp__pg-num:hover { color: rgba(250,250,248,0.7); border-color: rgba(255,255,255,0.12); }
        .xpp__pg-num.active { color: #c9a84c; border-color: rgba(201,168,76,0.45); background: rgba(201,168,76,0.07); }

        .xpp__pg-dots {
          color: rgba(250,250,248,0.18);
          font-size: 0.7rem;
          letter-spacing: 0.05em;
          padding: 0 0.4rem;
          user-select: none;
        }

        /* ═══════════════════════════════════════
           MODAL BACKDROP
        ═══════════════════════════════════════ */
        .xpm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.78);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        /* ═══════════════════════════════════════
           MODAL SHELL
        ═══════════════════════════════════════ */
        .xpm {
          position: relative;
          width: 100%;
          max-width: 1440px;
          height: 92vh;
          max-height: 900px;
          background: #0b0b0b;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        /* Ambient video bg */
        .xpm__bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .xpm__bg-img,
        .xpm__bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .xpm__bg-video {
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .xpm__bg-video.ready { opacity: 1; }

        .xpm__vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(7,7,7,0.97) 0%,
            rgba(7,7,7,0.75) 45%,
            rgba(7,7,7,0.55) 100%
          );
        }

        /* Close */
        .xpm__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          cursor: pointer;
          backdrop-filter: blur(4px);
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .xpm__close:hover {
          background: rgba(201,168,76,0.18);
          border-color: rgba(201,168,76,0.45);
          color: #c9a84c;
        }

        /* ═══════════════════════════════════════
           MODAL BODY (2-col)
        ═══════════════════════════════════════ */
        .xpm__body {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          height: 100%;
          overflow: hidden;
        }

        /* Left: Info */
        .xpm__info {
          padding: 2.5rem 2.2rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-right: 1px solid rgba(255,255,255,0.06);
          overflow-y: auto;
          scrollbar-width: none;
        }

        .xpm__info::-webkit-scrollbar { display: none; }

        .xpm__category {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.6rem;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.8rem;
          display: block;
        }

        .xpm__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.1rem;
          font-weight: 300;
          color: #fafaf8;
          margin: 0 0 0.65rem;
          line-height: 1.05;
        }

        .xpm__tagline {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-style: italic;
          color: rgba(250,250,248,0.45);
          margin: 0 0 1.6rem;
          line-height: 1.65;
        }

        /* Meta rows */
        .xpm__meta {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          margin-bottom: 1.6rem;
          padding-bottom: 1.6rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .xpm-meta__row {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }

        .xpm-meta__label {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.56rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.28);
        }

        .xpm-meta__value {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.82rem;
          color: #fafaf8;
          letter-spacing: 0.01em;
        }

        /* Story */
        .xpm__story {
          margin-bottom: 1.8rem;
        }

        .xpm__story p {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          line-height: 1.75;
          color: rgba(250,250,248,0.52);
          margin: 0;
        }

        /* Story block wrapper — mobile only duplicate, hidden on desktop */
        .xpm__story-block {
          display: none;
        }

        /* Book CTA */
        .xpm__book-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #080808;
          background: #c9a84c;
          text-decoration: none;
          padding: 0.75rem 1.6rem;
          display: inline-block;
          align-self: flex-start;
          transition: background 0.2s;
        }

        .xpm__book-btn:hover { background: #e0bc60; }

        /* Right: Gallery */
        .xpm__gallery {
          display: flex;
          align-items: stretch;
          padding: 1.6rem;
          overflow: hidden;
        }

        /* ═══════════════════════════════════════
           GALLERY VIEWER
        ═══════════════════════════════════════ */
        /* ── MOBILE CAROUSEL ── */
        .xpg__carousel {
          display: none;
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .xpg__carousel-slide {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .xpg__carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 4;
          width: 32px;
          height: 48px;
          background: rgba(0,0,0,0.45);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.75);
          font-size: 1.4rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, color 0.2s;
        }

        .xpg__carousel-btn:hover { background: rgba(201,168,76,0.25); color: #c9a84c; }
        .xpg__carousel-btn--prev { left: 0.5rem; }
        .xpg__carousel-btn--next { right: 0.5rem; }

        .xpg__carousel-dots {
          position: absolute;
          bottom: 0.6rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 0.4rem;
          z-index: 4;
        }

        .xpg__carousel-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }

        .xpg__carousel-dot.active {
          width: 18px;
          border-radius: 3px;
          background: #c9a84c;
        }

        /* ── DESKTOP GALLERY ── */
        .xpg__desktop {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          gap: 0.6rem;
        }

        /* Show carousel on mobile+tablet, desktop layout on larger screens */
        @media (max-width: 1024px) {
          .xpg__carousel { display: block; }
          .xpg__desktop  { display: none; }

          /* Carousel is a natural block — fixed height, not position:absolute container */
          .xpg__carousel {
            position: relative;
            width: 100%;
            height: 320px;
            overflow: hidden;
            flex-shrink: 0;
          }

          /* Gallery panel: no padding, natural height */
          .xpm__gallery {
            padding: 0;
            height: 320px;
            min-height: unset;
            overflow: visible;
            align-items: flex-start;
          }
        }

        @media (min-width: 1025px) {
          .xpg__carousel { display: none; }
          .xpg__desktop  { display: flex; }
        }

        .xpg {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .xpg__main {
          flex: 1;
          overflow: hidden;
          background: #000;
          min-height: 0;
        }

        .xpg__media {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .xpg__media--img.xpg__media--active {
          animation: xpg-fade 0.22s ease;
        }

        @keyframes xpg-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .xpg__strip-row {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          flex-shrink: 0;
          width: 100%;
        }

        .xpg__arrow {
          flex-shrink: 0;
          width: 26px;
          height: 40px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.45);
          font-size: 1.1rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          padding: 0;
        }

        .xpg__arrow:hover:not(:disabled) {
          border-color: rgba(201,168,76,0.45);
          color: #c9a84c;
          background: rgba(201,168,76,0.06);
        }

        .xpg__arrow:disabled {
          opacity: 0.15;
          cursor: default;
        }

        .xpg__thumbs {
          flex: 1;
          min-width: 0;
          display: flex;
          gap: 0.45rem;
          overflow: hidden;
          flex-shrink: 1;
          scrollbar-width: none;
          padding-bottom: 2px;
          cursor: grab;
          user-select: none;
        }

        .xpg__thumbs:active { cursor: grabbing; }

        .xpg__thumbs::-webkit-scrollbar { display: none; }

        .xpg__thumb {
          position: relative;
          flex-shrink: 0;
          width: 54px;
          height: 40px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: #111;
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s;
        }

        .xpg__thumb:hover { border-color: rgba(255,255,255,0.3); }
        .xpg__thumb.active { border-color: #c9a84c; }

        .xpg__thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .xpg__play {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.5);
          color: rgba(255,255,255,0.85);
          font-size: 0.55rem;
        }

        /* ═══════════════════════════════════════
           RESPONSIVE
        ═══════════════════════════════════════ */
        @media (max-width: 1024px) {
          .xpp__group,
          .xpp__group--flip {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 260px 260px;
          }
          .xpp__group--flip .xpc--large { grid-column: 2; }
          .xpp__group--flip .xpp__small-stack { grid-column: 1; }
        }

        @media (max-width: 1024px) {
          .xpp__hero { padding: 120px 5vw 56px; }
          .xpp__pages { display: none; }
          .xpp__mobile-carousel { display: block; }

          .xpp__group,
          .xpp__group--flip {
            grid-template-columns: 1fr;
            grid-template-rows: 300px 200px 200px;
          }

          .xpp__group .xpc--large,
          .xpp__group--flip .xpc--large {
            grid-column: 1;
            grid-row: 1;
          }

          .xpp__group .xpp__small-stack,
          .xpp__group--flip .xpp__small-stack {
            grid-column: 1;
            grid-row: auto;
          }

          .xpc--large .xpc__name { font-size: 1.7rem; }
          .xpp__pg-num, .xpp__pg-arrow { width: 34px; height: 34px; }

          /* Modal: slide up from bottom */
          .xpm-backdrop {
            padding: 0;
            align-items: flex-end;
          }

          .xpm {
            max-width: 100vw;
            height: 94vh;
            max-height: 94vh;
            border-left: none;
            border-right: none;
            border-bottom: none;
          }

          .xpm__body {
            grid-template-columns: 1fr;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }

          /* On mobile, flatten the body so info, gallery, story-block are siblings */
          .xpm__info {
            order: 1;
            border-right: none;
            border-bottom: none;
            padding: 2rem 1.5rem 1rem;
            justify-content: flex-start;
            flex-shrink: 0;
            height: auto;
            overflow-y: visible;
          }

          /* Hide desktop-only story and book btn inside xpm__info */
          .xpm__story--desktop,
          .xpm__book-btn--desktop {
            display: none;
          }

          /* Gallery slides between the meta rows and the story text */
          .xpm__gallery {
            order: 2;
            flex-shrink: 0;
          }

          /* Story + book button sit below the gallery — shown on mobile only */
          .xpm__story-block {
            display: block;
            order: 3;
            flex-shrink: 0;
            padding: 1.2rem 1.5rem 1.6rem;
            border-top: 1px solid rgba(255,255,255,0.06);
          }

          .xpm__title { font-size: 1.7rem; }
        }
      `}</style>
    </>
  )
}
