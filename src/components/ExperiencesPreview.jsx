import { useRef, useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwC3KdhH5lRljjcAZ9DD5Jsqhp3rKPHkSadO0hXrH0iFjEIUh0JKCy0qxsvFcxkN9OEvw/exec'
const CACHE_KEY = 'xp_preview_cache'

function chunkArray(arr, size) {
  const chunks = []
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size))
  return chunks
}

// ── Skeleton page: mirrors the real grid (1 large + 2 small) ──
function SkeletonPage({ flip = false }) {
  return (
    <div className={`xp-prev__page ${flip ? 'xp-prev__page--flip' : ''}`}>
      <div className="xp-card xp-card--large xp-card--skeleton">
        <div className="xp-skeleton__shimmer" />
      </div>
      <div className="xp-prev__small-stack">
        <div className="xp-card xp-card--small xp-card--skeleton">
          <div className="xp-skeleton__shimmer" />
        </div>
        <div className="xp-card xp-card--small xp-card--skeleton">
          <div className="xp-skeleton__shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function ExperiencesPreview() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeDot, setActiveDot] = useState(0)
  const videoRefs = useRef({})
  const navigate = useNavigate()
  const scrollRef = useRef(null)
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0, velocity: 0, frame: null })

  useEffect(() => {
    // ── 1. Try session cache first ──
    try {
      const cached = sessionStorage.getItem(CACHE_KEY)
      if (cached) {
        setExperiences(JSON.parse(cached))
        setLoading(false)
        return
      }
    } catch (_) {}

    // ── 2. Fetch from GAS, then persist to session cache ──
    fetch(`${SHEET_URL}?type=experiences`)
      .then(r => r.json())
      .then(res => {
        const all = (res.data || []).map(exp => ({
          ...exp,
          gallery: (exp.gallery || []).slice(0, 3),
        }))
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(all)) } catch (_) {}
        setExperiences(all)
      })
      .catch(() => setExperiences([]))
      .finally(() => setLoading(false))
  }, [])

  const featured = experiences.filter(e => e.featured)
  const pages = chunkArray(featured, 3)
  const totalPages = pages.length

  // ── Native scroll drag ──
  const onDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    cancelAnimationFrame(drag.current.frame)
    drag.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, velocity: 0, frame: null }
  }
  const onUp = () => {
    drag.current.isDown = false
    const momentum = () => {
      const el = scrollRef.current
      if (!el) return
      el.scrollLeft += drag.current.velocity
      drag.current.velocity *= 0.92
      if (Math.abs(drag.current.velocity) > 0.5) {
        drag.current.frame = requestAnimationFrame(momentum)
      }
    }
    momentum()
  }
  const onMove = (e) => {
    if (!drag.current.isDown) return
    e.preventDefault()
    const el = scrollRef.current
    if (!el) return
    const walk = (e.pageX - el.offsetLeft) - drag.current.startX
    drag.current.velocity = walk * 0.15
    el.scrollLeft = drag.current.scrollLeft - walk
  }

  const onScroll = () => {
    const el = scrollRef.current
    if (!el || totalPages <= 1) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) { setActiveDot(0); return }
    const idx = Math.round((el.scrollLeft / max) * (totalPages - 1))
    setActiveDot(Math.min(idx, totalPages - 1))
  }

  const goTo = (i) => {
    const el = scrollRef.current
    if (!el) return
    const pageWidth = el.clientWidth
    el.scrollTo({ left: i * pageWidth, behavior: 'smooth' })
  }

  const playVideo = (id) => videoRefs.current[id]?.play().catch(() => {})
  const pauseVideo = (id) => {
    const v = videoRefs.current[id]
    if (v) { v.pause(); v.currentTime = 0 }
  }

  const handleViewAll = (e) => {
    e.preventDefault()
    navigate('/experiences')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const formatDate = (d) => {
    if (!d) return ''
    const parsed = new Date(d)
    return isNaN(parsed) ? d : parsed.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  }

  // ── Skeleton state: show 1 placeholder page while loading ──
  if (loading) return (
    <section id="experiences" className="xp-prev">
      <div className="xp-prev__header">
        <p className="xp-prev__eyebrow">From Our Travels</p>
        <h2 className="xp-prev__title">Real Trips. Real Memories.</h2>
        <p className="xp-prev__sub">Every experience — documented, curated, and lived.</p>
      </div>
      <div className="xp-prev__outer">
        <div className="xp-prev__scroll xp-prev__scroll--skeleton">
          <SkeletonPage />
        </div>
      </div>
      <style>{styles}</style>
    </section>
  )

  if (!featured.length) return null

  return (
    <section id="experiences" className="xp-prev">
      <div className="xp-prev__header">
        <p className="xp-prev__eyebrow">From Our Travels</p>
        <h2 className="xp-prev__title">Real Trips. Real Memories.</h2>
        <p className="xp-prev__sub">Every experience — documented, curated, and lived.</p>
      </div>

      {/* Scroll track */}
      <div className="xp-prev__outer">
        <div
          ref={scrollRef}
          className="xp-prev__scroll"
          onMouseDown={onDown}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          onMouseMove={onMove}
          onScroll={onScroll}
        >
          {pages.map((group, pageIdx) => {
            const flip = pageIdx % 2 === 1
            const [a, b, c] = group

            return (
              <div key={pageIdx} className={`xp-prev__page ${flip ? 'xp-prev__page--flip' : ''}`}>
                {a && (
                  <Link
                    to="/experiences"
                    className="xp-card xp-card--large"
                    onMouseEnter={() => playVideo(a.id)}
                    onMouseLeave={() => pauseVideo(a.id)}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                  >
                    {/* ── 3. lazy image ── */}
                    <img src={a.coverImage} alt={a.title} className="xp-card__img" draggable={false} loading="lazy" />
                    {a.coverVideo && (
                      <video ref={el => videoRefs.current[a.id] = el} src={a.coverVideo}
                        muted loop playsInline preload="none" className="xp-card__video"
                        onCanPlay={e => e.target.classList.add('ready')} />
                    )}
                    <div className="xp-card__overlay" />
                    <div className="xp-card__content">
                      <span className="xp-card__category">{a.category}</span>
                      <div className="xp-card__bottom">
                        <h3 className="xp-card__name">{a.title}</h3>
                        <p className="xp-card__meta">{a.destination} &nbsp;·&nbsp; {formatDate(a.date)} &nbsp;·&nbsp; {a.groupSize} travellers</p>
                        <p className="xp-card__tagline">{a.tagline}</p>
                      </div>
                    </div>
                  </Link>
                )}

                <div className="xp-prev__small-stack">
                  {[b, c].map((exp, si) => exp ? (
                    <Link
                      key={exp.id}
                      to="/experiences"
                      className="xp-card xp-card--small"
                      onMouseEnter={() => playVideo(exp.id)}
                      onMouseLeave={() => pauseVideo(exp.id)}
                      onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
                    >
                      {/* ── 3. lazy image ── */}
                      <img src={exp.coverImage} alt={exp.title} className="xp-card__img" draggable={false} loading="lazy" />
                      {exp.coverVideo && (
                        <video ref={el => videoRefs.current[exp.id] = el} src={exp.coverVideo}
                          muted loop playsInline preload="none" className="xp-card__video"
                          onCanPlay={e => e.target.classList.add('ready')} />
                      )}
                      <div className="xp-card__overlay" />
                      <div className="xp-card__content">
                        <span className="xp-card__category">{exp.category}</span>
                        <div className="xp-card__bottom">
                          <h3 className="xp-card__name">{exp.title}</h3>
                          <p className="xp-card__meta">{exp.destination} &nbsp;·&nbsp; {formatDate(exp.date)} &nbsp;·&nbsp; {exp.groupSize} travellers</p>
                          <p className="xp-card__tagline">{exp.tagline}</p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div key={si} className="xp-card xp-card--small xp-card--empty" />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Dots + arrows */}
      {totalPages > 1 && (
        <div className="xp-prev__nav">
          <button className="xp-prev__arrow-btn" onClick={() => goTo(activeDot - 1)} disabled={activeDot === 0}>←</button>
          <div className="xp-prev__dots">
            {pages.map((_, i) => (
              <button key={i} className={`xp-prev__dot ${i === activeDot ? 'xp-prev__dot--active' : ''}`} onClick={() => goTo(i)} />
            ))}
          </div>
          <button className="xp-prev__arrow-btn" onClick={() => goTo(activeDot + 1)} disabled={activeDot === totalPages - 1}>→</button>
        </div>
      )}

      <div className="xp-prev__footer">
        <a href="/experiences" className="xp-prev__cta" onClick={handleViewAll}>
          View All Experiences
          <span className="xp-prev__cta-arrow">→</span>
        </a>
      </div>

      <style>{styles}</style>
    </section>
  )
}

const styles = `
  .xp-prev {
    padding: 120px 6vw 100px;
    background: #0a0a0a;
    overflow: hidden;
  }

  .xp-prev__header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .xp-prev__eyebrow {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: #c9a84c;
    margin-bottom: 0.85rem;
  }

  .xp-prev__title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.4rem, 4vw, 3.6rem);
    font-weight: 300;
    color: #fafaf8;
    margin: 0 0 0.6rem;
    line-height: 1;
  }

  .xp-prev__sub {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: rgba(250,250,248,0.38);
    letter-spacing: 0.04em;
    margin: 0;
  }

  /* ── SKELETON ── */
  .xp-card--skeleton {
    background: #161616;
    overflow: hidden;
  }

  .xp-skeleton__shimmer {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0)    0%,
      rgba(255,255,255,0.04) 40%,
      rgba(255,255,255,0.08) 50%,
      rgba(255,255,255,0.04) 60%,
      rgba(255,255,255,0)    100%
    );
    background-size: 200% 100%;
    animation: xp-shimmer 1.6s ease-in-out infinite;
  }

  @keyframes xp-shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }

  /* pointer-events off while skeleton is showing so it doesn't feel broken */
  .xp-prev__scroll--skeleton { pointer-events: none; }

  /* ── OUTER / SCROLL ── */
  .xp-prev__outer {
    overflow: hidden;
  }

  .xp-prev__scroll {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 24px;
    scrollbar-width: none;
    -ms-overflow-style: none;
    cursor: grab;
    user-select: none;
  }

  .xp-prev__scroll:active { cursor: grabbing; }
  .xp-prev__scroll::-webkit-scrollbar { display: none; }

  /* ── PAGE ── */
  .xp-prev__page {
    flex: 0 0 100%;
    scroll-snap-align: start;
    display: grid;
    grid-template-columns: 1.55fr 1fr;
    grid-template-rows: 295px 295px;
    gap: 8px;
  }

  /* Normal: large card pinned left */
  .xp-prev__page .xp-card--large {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .xp-prev__page .xp-prev__small-stack {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  /* Flip: large card moves right */
  .xp-prev__page--flip {
    grid-template-columns: 1fr 1.55fr;
  }

  .xp-prev__page--flip .xp-card--large {
    grid-column: 2;
    grid-row: 1 / span 2;
  }

  .xp-prev__page--flip .xp-prev__small-stack {
    grid-column: 1;
    grid-row: 1 / span 2;
  }

  .xp-prev__small-stack {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  /* ── CARDS ── */
  .xp-card {
    position: relative;
    display: block;
    text-decoration: none;
    overflow: hidden;
    background: #111;
    cursor: pointer;
  }

  .xp-card--large { grid-row: 1 / span 2; }
  .xp-card--small { flex: 1; }
  .xp-card--empty { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); }

  .xp-card__img,
  .xp-card__video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  .xp-card__video {
    opacity: 0;
    transition: opacity 0.55s ease, transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .xp-card__video.ready { opacity: 0; }
  .xp-card:hover .xp-card__img { transform: scale(1.05); }
  .xp-card:hover .xp-card__video.ready { opacity: 1; transform: scale(1.05); }

  .xp-card__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.08) 100%);
    z-index: 1;
  }

  .xp-card__content {
    position: absolute;
    inset: 0;
    z-index: 2;
    padding: 1.4rem 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
  }

  .xp-card__category {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #c9a84c;
    border: 1px solid rgba(201,168,76,0.35);
    background: rgba(0,0,0,0.35);
    backdrop-filter: blur(6px);
    padding: 0.25rem 0.65rem;
    display: inline-block;
  }

  .xp-card__bottom {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .xp-card__name {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 300;
    color: #fafaf8;
    margin: 0;
    line-height: 1.1;
    font-size: 1.5rem;
  }

  .xp-card--large .xp-card__name { font-size: 2.1rem; }

  .xp-card__meta {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    color: rgba(250,250,248,0.45);
    margin: 0;
    letter-spacing: 0.03em;
  }

  .xp-card__tagline {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.76rem;
    font-style: italic;
    color: rgba(250,250,248,0);
    margin: 0;
    max-width: 300px;
    transform: translateY(5px);
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .xp-card:hover .xp-card__tagline {
    color: rgba(250,250,248,0.7);
    transform: translateY(0);
  }

  /* ── NAV ── */
  .xp-prev__nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1.2rem;
    margin-top: 1.8rem;
  }

  .xp-prev__arrow-btn {
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
  }

  .xp-prev__arrow-btn:hover:not(:disabled) {
    border-color: rgba(201,168,76,0.5);
    color: #c9a84c;
  }

  .xp-prev__arrow-btn:disabled { opacity: 0.2; cursor: default; }

  .xp-prev__dots {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .xp-prev__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: none;
    background: rgba(255,255,255,0.18);
    cursor: pointer;
    padding: 0;
    transition: background 0.25s, transform 0.25s, width 0.25s;
  }

  .xp-prev__dot--active {
    width: 22px;
    border-radius: 3px;
    background: #c9a84c;
    transform: none;
  }

  /* ── FOOTER CTA ── */
  .xp-prev__footer {
    display: flex;
    justify-content: center;
    margin-top: 2.5rem;
  }

  .xp-prev__cta {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(250,250,248,0.75);
    text-decoration: none;
    border: 1px solid rgba(250,250,248,0.18);
    padding: 0.88rem 2.2rem;
    display: inline-flex;
    align-items: center;
    gap: 0.8rem;
    transition: color 0.25s, border-color 0.25s;
  }

  .xp-prev__cta:hover {
    color: #c9a84c;
    border-color: rgba(201,168,76,0.5);
  }

  .xp-prev__cta-arrow {
    display: inline-block;
    transition: transform 0.25s ease;
  }

  .xp-prev__cta:hover .xp-prev__cta-arrow { transform: translateX(5px); }

  /* ── RESPONSIVE ── */
  @media (max-width: 860px) {
    .xp-prev { padding: 80px 5vw 72px; }

    .xp-prev__page,
    .xp-prev__page--flip {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 240px 240px;
    }

    .xp-prev__page--flip .xp-card--large { grid-column: 2; }
    .xp-prev__page--flip .xp-prev__small-stack { grid-column: 1; }
  }

  @media (max-width: 600px) {
    .xp-prev__page,
    .xp-prev__page--flip {
      grid-template-columns: 1fr;
      grid-template-rows: 280px 220px 220px;
    }

    .xp-prev__page--flip .xp-card--large,
    .xp-card--large { grid-column: 1; grid-row: 1; }

    .xp-prev__page--flip .xp-prev__small-stack,
    .xp-prev__small-stack { grid-column: 1; grid-row: auto; }

    .xp-card--large .xp-card__name { font-size: 1.6rem; }
  }
`
