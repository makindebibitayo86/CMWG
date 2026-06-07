import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const navLinks = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Merch', href: '#shop' },
  { label: 'About', href: '#about' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const prefersReduced = useReducedMotion()
  const drawerRef = useRef(null)
  const hamburgerRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setScale(w >= 768 && w < 1280 ? w / 1280 : 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  /* Trap focus inside drawer */
  useEffect(() => {
    if (!menuOpen) return
    const el = drawerRef.current
    if (!el) return
    const focusable = el.querySelectorAll('a, button')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    const trap = (e) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault()
        ;(e.shiftKey ? last : first)?.focus()
      }
    }
    const esc = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    el.addEventListener('keydown', trap)
    document.addEventListener('keydown', esc)
    return () => {
      el.removeEventListener('keydown', trap)
      document.removeEventListener('keydown', esc)
    }
  }, [menuOpen])

  const transition = prefersReduced
    ? { duration: 0 }
    : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }

  const drawerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: prefersReduced ? 0 : 0.25 } },
    exit:    { opacity: 0, transition: { duration: prefersReduced ? 0 : 0.2 } },
  }

  const linkVariants = (i) => ({
    hidden:  { opacity: 0, y: prefersReduced ? 0 : 18 },
    visible: { opacity: 1, y: 0, transition: { delay: prefersReduced ? 0 : i * 0.07, duration: 0.32, ease: 'easeOut' } },
  })

  return (
    <>
      {/* Skip link */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* ── NAVBAR ── */}
      <motion.header
        role="banner"
        className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={transition}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: scale < 1 ? `${100 / scale}%` : '100%',
        }}
      >
        {/* Logo */}
        <a href="/" className="navbar__logo" aria-label="CMWG — home">
          <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" width="auto" height="52" />
        </a>

        {/* Desktop Links */}
        <nav className="navbar__links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="navbar__right">
          <a href="#plan" className="navbar__cta">
            Start Planning
          </a>

          {/* Hamburger */}
          <button
            ref={hamburgerRef}
            className={`navbar__hamburger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
          >
            <span className="bar bar--top" />
            <span className="bar bar--mid" />
            <span className="bar bar--bot" />
          </button>
        </div>
      </motion.header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close area (click outside links) */}
            <div
              className="drawer__backdrop"
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            <nav className="drawer__inner" aria-label="Mobile navigation links">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="drawer__link"
                  variants={linkVariants(i)}
                  initial="hidden"
                  animate="visible"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#plan"
                onClick={() => setMenuOpen(false)}
                className="drawer__cta"
                variants={linkVariants(navLinks.length)}
                initial="hidden"
                animate="visible"
              >
                Start Planning
              </motion.a>

              <motion.button
                className="drawer__close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                variants={linkVariants(navLinks.length + 1)}
                initial="hidden"
                animate="visible"
              >
                ✕
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STYLES ── */}
      <style>{`
        /* ── Reset / tokens ── */
        :root {
          --gold: #c9a84c;
          --gold-light: #e0c278;
          --gold-dim: rgba(201,168,76,0.18);
          --white: #fafaf8;
          --muted: rgba(255,255,255,0.5);
          --nav-h: 76px;
          --nav-pad: clamp(1.25rem, 4vw, 3rem);
          --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
        }

        html { scroll-behavior: smooth; }

        /* ── Skip link ── */
        .skip-link {
          position: absolute;
          top: -100%;
          left: 1rem;
          z-index: 10000;
          background: var(--gold);
          color: #000;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          border-radius: 0 0 4px 4px;
          text-decoration: none;
          font-weight: 600;
          transition: top 0.2s;
        }
        .skip-link:focus { top: 0; }

        /* ── Navbar ── */
        .navbar {
          position: fixed;
          top: 0; left: 0;
          width: 100%;
          height: var(--nav-h);
          z-index: 999;

          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;

          padding: 0 var(--nav-pad);

          background: rgba(8, 8, 8, 0.08);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition:
            background 0.4s ease,
            border-color 0.4s ease,
            backdrop-filter 0.4s ease;
        }

        .navbar--scrolled {
          background: rgba(6, 6, 6, 0.55);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border-bottom-color: var(--gold-dim);
          box-shadow: 0 1px 0 var(--gold-dim);
        }

        /* ── Logo ── */
        .navbar__logo {
          flex-shrink: 0;
          display: block;
          outline: none;
          border-radius: 3px;
        }
        .navbar__logo:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }
        .navbar__logo img {
          height: 65px;
          width: auto;
          display: block;
        }

        /* ── Desktop links ── */
        .navbar__links {
          display: flex;
          gap: 2.25rem;
          margin: 0 auto;
        }

        .navbar__link {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.72rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 0.25rem 0;
          position: relative;
          transition: color 0.2s ease;
          outline: none;
        }

        .navbar__link::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0; right: 100%;
          height: 1px;
          background: var(--gold);
          transition: right 0.25s var(--ease-out);
        }

        .navbar__link:hover,
        .navbar__link:focus-visible {
          color: var(--white);
        }
        .navbar__link:hover::after,
        .navbar__link:focus-visible::after {
          right: 0;
        }
        .navbar__link:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
          border-radius: 2px;
        }

        /* ── Right cluster ── */
        .navbar__right {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-shrink: 0;
        }

        /* ── CTA ── */
        .navbar__cta {
          display: inline-flex;
          align-items: center;
          background: var(--gold);
          color: #0a0a0a;
          padding: 0.5rem 1.15rem;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.13em;
          text-decoration: none;
          border-radius: 2px;
          transition:
            background 0.2s ease,
            transform 0.2s var(--ease-out),
            box-shadow 0.2s ease;
          outline: none;
          cursor: pointer;
        }

        .navbar__cta:hover {
          background: var(--gold-light);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(201,168,76,0.28);
        }
        .navbar__cta:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .navbar__cta:focus-visible {
          outline: 2px solid var(--gold-light);
          outline-offset: 3px;
        }

        /* ── Hamburger ── */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 4px;
          min-width: 44px;
          min-height: 44px;
          outline: none;
          /* touch-action: manipulation removes 300ms delay */
          touch-action: manipulation;
        }
        .navbar__hamburger:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        .bar {
          display: block;
          width: 22px;
          height: 1.5px;
          background: rgba(255,255,255,0.85);
          border-radius: 2px;
          transition:
            transform 0.28s var(--ease-out),
            opacity 0.2s ease;
          transform-origin: center;
        }

        .navbar__hamburger.is-open .bar--top {
          transform: translateY(6.5px) rotate(45deg);
        }
        .navbar__hamburger.is-open .bar--mid {
          opacity: 0;
          transform: scaleX(0);
        }
        .navbar__hamburger.is-open .bar--bot {
          transform: translateY(-6.5px) rotate(-45deg);
        }

        /* ── Drawer ── */
        .drawer {
          position: fixed;
          inset: 0;
          z-index: 998;
          display: flex;
          align-items: stretch;
        }

        .drawer__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px) saturate(160%);
          -webkit-backdrop-filter: blur(8px) saturate(160%);
        }

        .drawer__inner {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1.75rem;
          width: 100%;
          padding: 2rem var(--nav-pad);
          text-align: center;
        }

        .drawer__link {
          font-size: clamp(1.75rem, 8vw, 2.5rem);
          font-weight: 300;
          letter-spacing: 0.06em;
          color: rgba(255,255,255,0.88);
          text-decoration: none;
          text-transform: uppercase;
          padding: 0.15em 0.5em;
          border-radius: 3px;
          transition: color 0.2s ease;
          outline: none;
          /* min tap target */
          min-height: 44px;
          display: inline-flex;
          align-items: center;
        }
        .drawer__link:hover,
        .drawer__link:focus-visible {
          color: var(--gold-light);
        }
        .drawer__link:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 4px;
        }

        .drawer__cta {
          display: inline-flex;
          align-items: center;
          margin-top: 0.5rem;
          background: var(--gold);
          color: #0a0a0a;
          padding: 0.85rem 2.5rem;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          text-decoration: none;
          border-radius: 2px;
          transition:
            background 0.2s ease,
            transform 0.2s var(--ease-out);
          min-height: 44px;
          outline: none;
        }
        .drawer__cta:hover {
          background: var(--gold-light);
          transform: scale(1.03);
        }
        .drawer__cta:focus-visible {
          outline: 2px solid var(--gold-light);
          outline-offset: 3px;
        }

        .drawer__close {
          position: absolute;
          top: calc(var(--nav-h) / 2 - 22px);
          right: var(--nav-pad);
          background: none;
          border: none;
          color: var(--muted);
          font-size: 1.1rem;
          cursor: pointer;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.2s ease, background 0.2s ease;
          outline: none;
          touch-action: manipulation;
        }
        .drawer__close:hover {
          color: var(--white);
          background: rgba(255,255,255,0.08);
        }
        .drawer__close:focus-visible {
          outline: 2px solid var(--gold);
          outline-offset: 2px;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .navbar__links { display: none; }
          .navbar__cta { display: none; }
          .navbar__hamburger { display: flex; }
        }

        @media (prefers-reduced-motion: reduce) {
          .navbar,
          .navbar__link::after,
          .bar,
          .navbar__cta,
          .drawer__link,
          .drawer__cta {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar
