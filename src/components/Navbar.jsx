import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Destinations', href: '#destinations' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'About', href: '#about' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // prevent background scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto'
  }, [menuOpen])

  return (
    <>
      {/* NAVBAR */}
      <motion.header
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Logo */}
        <a href="/" className="navbar__logo">
          <img src="/cmwg-logo.png" alt="CMWG" />
        </a>

        {/* Desktop Links */}
        <nav className="navbar__links">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a href="#plan" className="navbar__cta">
          Start Planning
        </a>

        {/* Hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? 'open top' : ''}></span>
          <span className={menuOpen ? 'open mid' : ''}></span>
          <span className={menuOpen ? 'open bot' : ''}></span>
        </button>
      </motion.header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__drawer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="navbar__drawer-inner">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="navbar__drawer-link"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#plan"
                onClick={() => setMenuOpen(false)}
                className="navbar__drawer-cta"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Start Planning
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STYLES */}
      <style>{`
        :root {
          --gold: #c9a84c;
          --white: #fafaf8;
          --muted: rgba(255,255,255,0.55);
          --nav-h: 80px;
        }

        /* ───────── NAVBAR GLASS (MORE TRANSPARENT) ───────── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: var(--nav-h);
          z-index: 999;

          display: flex;
          align-items: center;
          justify-content: space-between;

          padding: 0 3rem;

          /* MUCH lighter glass */
          background: rgba(10, 10, 10, 0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);

          border-bottom: 1px solid rgba(255,255,255,0.06);

          transition: all 0.4s ease;
        }

        /* even more transparent at rest → slightly stronger on scroll */
        .navbar--scrolled {
          background: rgba(10, 10, 10, 0.22);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(201,168,76,0.15);
        }

        /* ───────── LOGO ───────── */
        .navbar__logo img {
          height: 60px;
          width: auto;
        }

        /* ───────── LINKS ───────── */
        .navbar__links {
          display: flex;
          gap: 2rem;
        }

        .navbar__link {
          color: var(--muted);
          text-decoration: none;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          transition: 0.2s;
        }

        .navbar__link:hover {
          color: var(--white);
        }

        /* ───────── CTA ───────── */
        .navbar__cta {
          background: var(--gold);
          color: #000;
          padding: 0.55rem 1.2rem;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          text-decoration: none;
          border-radius: 2px;
          transition: 0.2s;
        }

        .navbar__cta:hover {
          transform: translateY(-1px);
          background: #e2c27d;
        }

        /* ───────── HAMBURGER ───────── */
        .navbar__hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
        }

        .navbar__hamburger span {
          width: 22px;
          height: 2px;
          background: white;
          transition: 0.3s;
        }

        .navbar__hamburger span.top.open {
          transform: translateY(7px) rotate(45deg);
        }

        .navbar__hamburger span.mid.open {
          opacity: 0;
        }

        .navbar__hamburger span.bot.open {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* ───────── DRAWER (LIGHTER GLASS THAN BEFORE) ───────── */
        .navbar__drawer {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);

          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar__drawer-inner {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          text-align: center;
        }

        .navbar__drawer-link {
          font-size: 2rem;
          color: white;
          text-decoration: none;
        }

        .navbar__drawer-cta {
          margin-top: 1rem;
          background: var(--gold);
          color: black;
          padding: 1rem 2rem;
          text-decoration: none;
        }

        /* ───────── RESPONSIVE ───────── */
        @media (max-width: 768px) {
          .navbar__links,
          .navbar__cta {
            display: none;
          }

          .navbar__hamburger {
            display: flex;
          }
        }
      `}</style>
    </>
  )
}

export default Navbar