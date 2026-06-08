import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EXPERIENCES } from '../data/experiences'

export default function ExperiencesPreview() {
  const featured = EXPERIENCES.filter(e => e.featured).slice(0, 3)
  const videoRefs = useRef({})
  const navigate = useNavigate()

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

  return (
    <section id="experiences" className="xp-prev">

      <div className="xp-prev__header">
        <p className="xp-prev__eyebrow">From Our Travels</p>
        <h2 className="xp-prev__title">Real Trips. Real Memories.</h2>
        <p className="xp-prev__sub">Every experience — documented, curated, and lived.</p>
      </div>

      <div className="xp-prev__grid">
        {featured.map((exp, i) => (
          <Link
            key={exp.id}
            to="/experiences"
            className={`xp-card ${i === 0 ? 'xp-card--large' : 'xp-card--small'}`}
            onMouseEnter={() => playVideo(exp.id)}
            onMouseLeave={() => pauseVideo(exp.id)}
            onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
          >
            <img
              src={exp.coverImage}
              alt={exp.title}
              className="xp-card__img"
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
                className="xp-card__video"
                onCanPlay={e => e.target.classList.add('ready')}
              />
            )}
            <div className="xp-card__overlay" />
            <div className="xp-card__content">
              <span className="xp-card__category">{exp.category}</span>
              <div className="xp-card__bottom">
                <h3 className="xp-card__name">{exp.title}</h3>
                <p className="xp-card__meta">
                  {exp.destination} &nbsp;·&nbsp; {exp.date} &nbsp;·&nbsp; {exp.groupSize} travellers
                </p>
                <p className="xp-card__tagline">{exp.tagline}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="xp-prev__footer">
        <a href="/experiences" className="xp-prev__cta" onClick={handleViewAll}>
          View All Experiences
          <span className="xp-prev__arrow">→</span>
        </a>
      </div>

      <style>{`
        /* ── SECTION ── */
        .xp-prev {
          padding: 120px 6vw 100px;
          background: #0a0a0a;
        }

        /* ── HEADER ── */
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

        /* ── GRID ── */
        .xp-prev__grid {
          display: grid;
          grid-template-columns: 1.55fr 1fr;
          grid-template-rows: 295px 295px;
          gap: 8px;
          max-width: 1100px;
          margin: 0 auto;
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

        .xp-card--large {
          grid-row: span 2;
        }

        /* Media layers */
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

        .xp-card:hover .xp-card__img {
          transform: scale(1.05);
        }

        .xp-card:hover .xp-card__video.ready {
          opacity: 1;
          transform: scale(1.05);
        }

        /* Gradient overlay */
        .xp-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.92) 0%,
            rgba(0,0,0,0.35) 50%,
            rgba(0,0,0,0.08) 100%
          );
          transition: opacity 0.4s ease;
          z-index: 1;
        }

        /* Text content */
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

        .xp-card--large .xp-card__name {
          font-size: 2.1rem;
        }

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

        .xp-prev__arrow {
          display: inline-block;
          transition: transform 0.25s ease;
        }

        .xp-prev__cta:hover .xp-prev__arrow {
          transform: translateX(5px);
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .xp-prev { padding: 80px 5vw 72px; }

          .xp-prev__grid {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 240px 240px;
          }
        }

        @media (max-width: 600px) {
          .xp-prev__grid {
            grid-template-columns: 1fr;
            grid-template-rows: 280px 220px 220px;
          }

          .xp-card--large {
            grid-row: span 1;
          }

          .xp-card--large .xp-card__name {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </section>
  )
}
