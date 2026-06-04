import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1, delay, ease: [0.16, 1, 0.3, 1] },
})

function Hero() {
  return (
    <section className="hero">

      {/* VIDEO BACKGROUND */}
      <div className="hero__media">
        <video
          className="hero__video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://res.cloudinary.com/dgjcl0te0/video/upload/f_auto,q_auto/cmwg/droneshots.webm" type="video/webm" />
        </video>
      </div>

      {/* OVERLAY */}
      <div className="hero__overlay" />

      {/* MAIN LAYOUT */}
      <div className="hero__grid">

        {/* LEFT CONTENT */}
        <motion.div className="hero__left" {...fadeUp(0.2)}>
          <p className="hero__eyebrow">Explore Africa Differently</p>

          <h1 className="hero__title">
            Travel. Explore.<br />
            <span>Experience.</span>
          </h1>

          <p className="hero__text">
            Book trips, plan excursions, and discover unforgettable destinations
            across Africa’s most cinematic landscapes.
          </p>
        </motion.div>

        {/* RIGHT ACTIONS */}
        <motion.div className="hero__right" {...fadeUp(0.5)}>

          <a href="#destinations" className="hero__card">
            <h3>Book Trips</h3>
            <p>Curated travel packages</p>
          </a>

          <a href="#experiences" className="hero__card">
            <h3>Excursions</h3>
            <p>Guided local experiences</p>
          </a>

          <a href="#shop" className="hero__card">
            <h3>Merch</h3>
            <p>Travel essentials & gear</p>
          </a>

        </motion.div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

        .hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 120px 6vw;
          overflow: hidden;
          color: white;
          font-family: 'Montserrat', sans-serif;
        }

        /* VIDEO */
        .hero__media {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .hero__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.7) contrast(1.15) saturate(1.1);
          transform: scale(1.1);
          animation: zoom 25s ease-in-out infinite alternate;
        }

        @keyframes zoom {
          from { transform: scale(1.1); }
          to { transform: scale(1.2); }
        }

        /* DARK OVERLAY */
        .hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(
              circle at 50% 40%,
              rgba(0,0,0,0.2),
              rgba(0,0,0,0.85)
            ),
            linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%);
        }

        /* LAYOUT */
        .hero__grid {
          position: relative;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          gap: 4rem;
          width: 100%;
          max-width: 1200px;
        }

        /* LEFT */
        .hero__left {
          max-width: 520px;
        }

        .hero__eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          opacity: 0.7;
          font-weight: 600;
        }

        .hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.5rem, 7vw, 6.5rem);
          font-weight: 400;
          line-height: 1.05;
          margin: 1rem 0;
          letter-spacing: -0.01em;
        }

        .hero__title span {
          color: #c9a84c;
        }

        .hero__text {
          font-size: 1.05rem;
          line-height: 1.7;
          opacity: 0.65;
          font-weight: 300;
          letter-spacing: 0.01em;
        }

        /* RIGHT CARDS */
        .hero__right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-width: 260px;
        }

        .hero__card {
          padding: 1.2rem;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          text-decoration: none;
          color: white;
          transition: 0.3s;
        }

        .hero__card:hover {
          transform: translateY(-4px);
          border-color: rgba(201,168,76,0.5);
          background: rgba(255,255,255,0.1);
        }

        .hero__card h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .hero__card p {
          margin: 0.3rem 0 0;
          font-size: 0.8rem;
          opacity: 0.6;
          font-weight: 300;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .hero__grid {
            flex-direction: column;
          }

          .hero__right {
            width: 100%;
          }
        }
      `}</style>

    </section>
  )
}

export default Hero