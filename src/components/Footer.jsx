import { motion } from 'framer-motion'

const FOOTER_LINKS = {
  Explore: [
    { label: 'Destinations', href: '#destinations' },
    { label: 'Experiences', href: '#experiences' },
    { label: 'Itineraries', href: '#itineraries' },
    { label: 'Travel Guides', href: '#guides' },
  ],
  Company: [
    { label: 'About CMWG', href: '#about' },
    { label: 'Our Story', href: '#story' },
    { label: 'Press', href: '#press' },
    { label: 'Careers', href: '#careers' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#privacy' },
    { label: 'Terms of Use', href: '#terms' },
    { label: 'Cookie Policy', href: '#cookies' },
    { label: 'Admin', href: '/admin' },
  ],
}

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/cmwg_tour',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/CmwgTours',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/2348160786498',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@ayanniyiayantayo907',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: 'mailto:cmwg.worldwide@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
]

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <a href="/" className="footer__logo" aria-label="CMWG Home">
            <img src="https://res.cloudinary.com/dgjcl0te0/image/upload/f_auto,q_auto/cmwg/cmwg-logo.png" alt="CMWG" className="footer__logo-img" />
          </a>
          <p className="footer__tagline">
            Africa's cinematic travel experience.<br />
            Every journey, a story worth telling.
          </p>
          <div className="footer__socials">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="footer__social"
                aria-label={s.label}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group} className="footer__col">
              <h3 className="footer__col-heading">{group}</h3>
              <ul className="footer__col-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer__col-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="footer__divider" aria-hidden="true" />

      <div className="footer__bottom">
        <p className="footer__copy">&copy; {year} CMWG. All rights reserved.</p>
        <p className="footer__made">Crafted with intention &mdash; for the love of Africa.</p>
      </div>

      <style>{`
        :root {
          --cmwg-black:    #0a0a0a;
          --cmwg-gold:     #c9a84c;
          --cmwg-gold-lt:  #e2c27d;
          --cmwg-sand:     #f0e6d3;
          --cmwg-white:    #fafaf8;
          --cmwg-muted:    rgba(250,250,248,0.45);
          --font-display:  'Cormorant Garamond', 'Garamond', Georgia, serif;
          --font-body:     'DM Sans', 'Helvetica Neue', sans-serif;
          --ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
        }

        .footer {
          background: #0d0d0b;
          color: var(--cmwg-white);
          padding: 5rem clamp(1.5rem, 6vw, 6rem) 2.5rem;
          border-top: 1px solid rgba(201,168,76,0.12);
        }

        .footer__top {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 4rem;
          margin-bottom: 4rem;
        }

        .footer__brand {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .footer__logo {
          display: inline-flex;
          text-decoration: none;
        }
        .footer__logo-img {
          height: 72px;
          width: auto;
          display: block;
          transition: opacity 0.25s;
        }
        .footer__logo:hover .footer__logo-img {
          opacity: 0.85;
        }

        .footer__tagline {
          font-family: var(--font-body);
          font-size: 0.85rem;
          line-height: 1.7;
          color: var(--cmwg-muted);
          max-width: 280px;
        }

        .footer__socials {
          display: flex;
          gap: 1rem;
          margin-top: 0.25rem;
          flex-wrap: wrap;
        }
        .footer__social {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          color: var(--cmwg-muted);
          border: 1px solid rgba(250,250,248,0.12);
          border-radius: 50%;
          text-decoration: none;
          transition: color 0.25s, border-color 0.25s, transform 0.2s;
        }
        .footer__social:hover {
          color: var(--cmwg-gold);
          border-color: var(--cmwg-gold);
          transform: translateY(-2px);
        }

        .footer__nav {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .footer__col-heading {
          font-family: var(--font-body);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cmwg-gold);
          margin: 0 0 1.2rem;
        }
        .footer__col-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer__col-link {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 300;
          color: var(--cmwg-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer__col-link:hover { color: var(--cmwg-white); }

        .footer__divider {
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(201,168,76,0.2) 20%,
            rgba(201,168,76,0.2) 80%,
            transparent
          );
          margin-bottom: 2rem;
        }

        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .footer__copy,
        .footer__made {
          font-family: var(--font-body);
          font-size: 0.75rem;
          font-weight: 300;
          color: rgba(250,250,248,0.28);
          margin: 0;
        }

        /* Tablet: brand stacks above nav, nav stays 3-col */
        @media (max-width: 900px) {
          .footer__top {
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
          }
          .footer {
            padding-top: 3rem;
            padding-bottom: 2rem;
          }
          .footer__brand {
            gap: 0.85rem;
          }
        }

        /* Large mobile (≤600px): Explore + Company side by side, Legal full-width below */
        @media (max-width: 600px) {
          .footer__nav {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto;
          }
          /* Legal spans both columns so it's never squished */
          .footer__col:last-child {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-items: start;
            gap: 0 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(201,168,76,0.08);
          }
          /* heading sits above both columns */
          .footer__col:last-child .footer__col-heading {
            grid-column: 1 / -1;
          }
          .footer__bottom {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Small mobile (≤400px): everything single column */
        @media (max-width: 400px) {
          .footer__nav {
            grid-template-columns: 1fr;
          }
          .footer__col:last-child {
            grid-column: unset;
            display: flex;
            flex-direction: column;
            padding-top: 1.5rem;
            border-top: 1px solid rgba(201,168,76,0.08);
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
