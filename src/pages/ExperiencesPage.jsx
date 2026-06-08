import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { EXPERIENCES } from '../data/experiences'

// ─── Gallery Viewer (right panel of modal) ───────────────────────────────────
function GalleryViewer({ experience }) {
  // Build ordered media array: coverImage first, then coverVideo, then extras
  const mediaItems = [
    { src: experience.coverImage, type: 'image', poster: null },
    ...(experience.coverVideo
      ? [{ src: experience.coverVideo, type: 'video', poster: experience.coverImage }]
      : []),
    ...experience.gallery.filter(
      g => g.src !== experience.coverImage && g.src !== experience.coverVideo
    ),
  ]

  const [activeIdx, setActiveIdx] = useState(0)
  const videoRef = useRef(null)
  const active = mediaItems[activeIdx]

  useEffect(() => {
    if (active.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [activeIdx, active.type])

  return (
    <div className="xpg">
      {/* Main viewer */}
      <div className="xpg__main">
        {active.type === 'video' ? (
          <video
            key={active.src}
            ref={videoRef}
            src={active.src}
            poster={active.poster || experience.coverImage}
            controls
            playsInline
            className="xpg__media"
          />
        ) : (
          <img
            key={active.src}
            src={active.src}
            alt={experience.title}
            className="xpg__media"
          />
        )}
      </div>

      {/* Thumbnail strip — only render if there's more than one item */}
      {mediaItems.length > 1 && (
        <div className="xpg__thumbs">
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
              />
              {item.type === 'video' && (
                <span className="xpg__play">▶</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Experience Detail Modal ──────────────────────────────────────────────────
function ExperienceModal({ experience, onClose }) {
  const videoBgRef = useRef(null)

  useEffect(() => {
    if (videoBgRef.current) {
      videoBgRef.current.play().catch(() => {})
    }
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
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
            <span className="xpm__category">{experience.category}</span>
            <h2 className="xpm__title">{experience.title}</h2>
            <p className="xpm__tagline">{experience.tagline}</p>

            <div className="xpm__meta">
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">Destination</span>
                <span className="xpm-meta__value">{experience.destination}</span>
              </div>
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">When</span>
                <span className="xpm-meta__value">{experience.date}</span>
              </div>
              <div className="xpm-meta__row">
                <span className="xpm-meta__label">Group</span>
                <span className="xpm-meta__value">{experience.groupSize} travellers</span>
              </div>
            </div>

            <div className="xpm__story">
              <p>{experience.story}</p>
            </div>

            <Link
              to="/booking"
              className="xpm__book-btn"
              onClick={onClose}
            >
              Book a Similar Trip
            </Link>
          </div>

          {/* Right — gallery */}
          <div className="xpm__gallery">
            <GalleryViewer experience={experience} />
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExperiencesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeModal, setActiveModal] = useState(null)
  const videoRefs = useRef({})

  const categories = [
    'All',
    ...Array.from(new Set(EXPERIENCES.map(e => e.category))).sort(),
  ]

  const filtered = activeCategory === 'All'
    ? EXPERIENCES
    : EXPERIENCES.filter(e => e.category === activeCategory)

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
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Experience Grid */}
        <div className="xpp__grid">
          {filtered.map(exp => (
            <article
              key={exp.id}
              className="xpc"
              onClick={() => setActiveModal(exp)}
              onMouseEnter={() => playVideo(exp.id)}
              onMouseLeave={() => pauseVideo(exp.id)}
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setActiveModal(exp)}
              role="button"
              aria-label={`View ${exp.title}`}
            >
              {/* Media block */}
              <div className="xpc__media">
                <img
                  src={exp.coverImage}
                  alt={exp.title}
                  className="xpc__img"
                  draggable={false}
                />
                {exp.coverVideo && (
                  <video
                    ref={el => videoRefs.current[exp.id] = el}
                    src={exp.coverVideo}
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="xpc__video"
                    onCanPlay={e => e.target.classList.add('ready')}
                  />
                )}
                <div className="xpc__media-overlay" />
                <span className="xpc__category">{exp.category}</span>
              </div>

              {/* Text block */}
              <div className="xpc__body">
                <h3 className="xpc__title">{exp.title}</h3>
                <p className="xpc__dest">{exp.destination} &nbsp;·&nbsp; {exp.date}</p>
                <p className="xpc__group">{exp.groupSize} travellers</p>
                <p className="xpc__story">{exp.story}</p>
                <span className="xpc__view">View experience →</span>
              </div>
            </article>
          ))}
        </div>

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
           GRID
        ═══════════════════════════════════════ */
        .xpp__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          padding: 0 6vw;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ═══════════════════════════════════════
           EXPERIENCE CARD
        ═══════════════════════════════════════ */
        .xpc {
          background: #0e0e0e;
          cursor: pointer;
          outline: none;
          transition: background 0.2s;
        }

        .xpc:focus-visible {
          outline: 1px solid rgba(201,168,76,0.5);
          outline-offset: -1px;
        }

        /* Media */
        .xpc__media {
          position: relative;
          aspect-ratio: 3 / 2;
          overflow: hidden;
          background: #111;
        }

        .xpc__img,
        .xpc__video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .xpc__video {
          opacity: 0;
          transition: opacity 0.5s ease, transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .xpc__video.ready { opacity: 0; }

        .xpc:hover .xpc__img { transform: scale(1.05); }
        .xpc:hover .xpc__video.ready { opacity: 1; transform: scale(1.05); }

        .xpc__media-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
        }

        .xpc:hover .xpc__media-overlay {
          background: rgba(0,0,0,0.12);
        }

        .xpc__category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.58rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          border: 1px solid rgba(201,168,76,0.3);
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(6px);
          padding: 0.22rem 0.6rem;
          z-index: 1;
        }

        /* Body */
        .xpc__body {
          padding: 1.25rem 1.4rem 1.6rem;
        }

        .xpc__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: #fafaf8;
          margin: 0 0 0.25rem;
          line-height: 1.15;
        }

        .xpc__dest {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.68rem;
          color: rgba(250,250,248,0.38);
          margin: 0 0 0.15rem;
          letter-spacing: 0.02em;
        }

        .xpc__group {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          color: rgba(201,168,76,0.65);
          margin: 0 0 0.6rem;
          letter-spacing: 0.04em;
        }

        .xpc__story {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.76rem;
          color: rgba(250,250,248,0.32);
          line-height: 1.65;
          margin: 0 0 0.75rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .xpc__view {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(201,168,76,0);
          transition: color 0.2s ease;
        }

        .xpc:hover .xpc__view {
          color: rgba(201,168,76,0.75);
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
          max-width: 920px;
          height: 80vh;
          max-height: 660px;
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

        .xpg__thumbs {
          display: flex;
          gap: 0.45rem;
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
          padding-bottom: 2px;
        }

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
          .xpp__grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 767px) {
          .xpp__hero { padding: 120px 5vw 56px; }
          .xpp__grid { grid-template-columns: 1fr; padding: 0 5vw; }

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
          }

          .xpm__info {
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            padding: 2rem 1.5rem 1.6rem;
            justify-content: flex-start;
          }

          .xpm__title { font-size: 1.7rem; }

          .xpm__gallery {
            padding: 1.2rem;
            min-height: 260px;
          }
        }
      `}</style>
    </>
  )
}
