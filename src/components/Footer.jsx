import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import cmwgLogo from '../assets/cmwg-logo.png'

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

const MODAL_CONTENT = {
  Experiences: {
    heading: 'Curated Experiences',
    sub: 'Beyond the itinerary — moments that stay with you.',
    body: `CMWG crafts immersive travel experiences that go far beyond sightseeing. From private sunrise game drives in the Serengeti to guided street food tours through Lagos markets, every experience is handpicked for cultural depth and cinematic quality.\n\nWe work with local guides, artists, chefs, and storytellers to ensure each moment feels authentic — never touristy. Whether you're after adrenaline, contemplation, or connection, our experiences are designed around the rhythm of real Africa.`,
    items: ['Private game drives & safari walks', 'Cultural immersion with local communities', 'Culinary tours & market experiences', 'Photography & film-focused journeys', 'Wellness & nature retreats', 'Exclusive sunset & sunrise events'],
  },
  Itineraries: {
    heading: 'Signature Itineraries',
    sub: 'Every day planned. Every moment intentional.',
    body: `Our signature itineraries are built for travellers who want the richness of Africa without the guesswork. Each route is tested, refined, and crafted with the perfect balance of adventure, rest, and discovery.\n\nFrom a 5-day Lagos City Escape to a 14-day East African Safari Circuit, our itineraries are flexible frameworks — not rigid schedules. We start with a proven route, then tailor it around you.`,
    items: ['5-day city escapes', '7-day coastal retreats', '10-day cultural deep-dives', '14-day safari circuits', 'Custom multi-country routes', 'Group & private options'],
  },
  'Travel Guides': {
    heading: 'Travel Guides',
    sub: 'Know before you go. See more when you arrive.',
    body: `Our destination guides are written by people who've actually been there — not aggregated from review sites. Each guide covers the practical and the poetic: where to stay, what to eat, how to move, and what most tourists miss entirely.\n\nGuides are updated seasonally and include local insights from our network of on-ground contacts across Africa and the Middle East.`,
    items: ['Neighbourhood-level city guides', 'Safari & wildlife planning guides', 'Packing & gear recommendations', 'Visa & entry requirements', 'Cultural etiquette & customs', 'Budget breakdowns by destination'],
  },
  'Our Story': {
    heading: 'Our Story',
    sub: 'Born from a love of Africa. Built for those who feel it too.',
    body: `CMWG — Cinema, Movement, World, Go — began as a creative collective of filmmakers and travellers who were tired of Africa being reduced to a safari cliché.\n\nWe set out to document the continent the way we actually experienced it: vibrant, complex, cinematic, and endlessly alive. What started as a passion project became a full travel brand — one rooted in authentic storytelling and the belief that travel should change you.\n\nToday, CMWG plans journeys for travellers across Nigeria and the diaspora who want more than a holiday. We want them to come back different.`,
    items: ['Founded by creatives, not corporates', 'Rooted in African storytelling', 'Community-first approach', 'Partnerships with local operators', 'Film & photography heritage', 'Growing network across 20+ countries'],
  },
  Press: {
    heading: 'Press & Media',
    sub: 'For journalists, creators, and collaborators.',
    body: `CMWG welcomes press enquiries, partnership proposals, and media collaboration requests. We've been featured across travel, lifestyle, and culture publications — and we're always open to telling our story in new ways.\n\nFor press kits, brand assets, or interview requests, please reach out directly to our media team. We respond within 48 hours.`,
    items: ['Brand press kit available on request', 'High-resolution photography archive', 'Founder interview availability', 'Partnership & co-creation briefs', 'Social media collaboration', 'Documentary & film partnerships'],
    cta: { label: 'Contact Press Team', href: 'https://wa.me/2348160786498?text=Hi%2C%20I%27m%20reaching%20out%20regarding%20a%20press%20enquiry%20for%20CMWG.' },
  },
  Careers: {
    heading: 'Join the Team',
    sub: "We're building something real. Come build it with us.",
    body: `CMWG is a small, intentional team — and we're growing carefully. We look for people who love travel, understand storytelling, and want to do genuinely meaningful work.\n\nWe hire across travel operations, content creation, design, and community. If nothing is listed below that fits you, send an open application. The right people always find a way in.`,
    items: ['Travel Operations Coordinator', 'Content Creator (Video & Photo)', 'Community & Social Manager', 'Brand & Design Partnerships', 'Destination Research Analyst', 'Open applications always welcome'],
    cta: { label: 'Send Open Application', href: 'https://wa.me/2348160786498?text=Hi%2C%20I%27d%20like%20to%20submit%20an%20open%20application%20to%20join%20the%20CMWG%20team.' },
  },
  'Privacy Policy': {
    heading: 'Privacy Policy',
    sub: 'Your data. Your trust. Handled with care.',
    body: `Last updated: June 2026\n\nCMWG ("we", "us", "our") is committed to protecting the personal information of our users and customers. This policy explains what data we collect, how we use it, and your rights.\n\nWe collect information you provide directly (name, email, phone) when submitting enquiries or orders. We do not sell your data to third parties. Information is used solely to process your travel or merchandise requests and communicate with you.\n\nWe use industry-standard security practices to protect your information. You may request deletion of your data at any time by contacting us directly.`,
    items: ['No data sold to third parties', 'Used only for order & booking processing', 'Secure storage via encrypted services', 'Email communications are opt-in', 'Data deletion available on request', 'Contact: cmwg.worldwide@gmail.com'],
  },
  'Terms of Use': {
    heading: 'Terms of Use',
    sub: 'Clear terms. No surprises.',
    body: `Last updated: June 2026\n\nBy using the CMWG website and services, you agree to these terms. Our platform is intended for personal, non-commercial use related to travel planning and merchandise.\n\nAll content on this site — including images, copy, and video — is the intellectual property of CMWG and may not be reproduced without written permission. Bookings and orders placed through our platform are subject to our cancellation and refund policy, available on request.\n\nWe reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of any changes.`,
    items: ['Personal, non-commercial use only', 'All content © CMWG', 'No reproduction without permission', 'Cancellation policy available on request', 'Dispute resolution via direct contact', 'Nigerian law governs these terms'],
  },
  'Cookie Policy': {
    heading: 'Cookie Policy',
    sub: 'We use cookies to make this work better.',
    body: `Last updated: June 2026\n\nCMWG uses a minimal set of cookies to ensure our website functions correctly and to understand how visitors use it. We do not use advertising or tracking cookies.\n\nEssential cookies are required for the site to function and cannot be disabled. Analytics cookies (if enabled) help us understand traffic patterns in aggregate — no personally identifiable data is collected. You can manage cookie preferences through your browser settings at any time.`,
    items: ['Essential cookies: always active', 'Analytics: aggregate data only', 'No advertising cookies', 'No cross-site tracking', 'Manageable via browser settings', 'Third-party: Google Analytics (anonymised)'],
  },
}

function FooterModal({ id, onClose }) {
  const content = MODAL_CONTENT[id]
  if (!content) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fm-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="fm-modal"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="fm-close" onClick={onClose} aria-label="Close">✕</button>

          <div className="fm-inner">
            <img
              src={cmwgLogo}
              alt="CMWG"
              className="fm-logo"
            />
            <p className="fm-sub">{content.sub}</p>
            <h2 className="fm-heading">{content.heading}</h2>
            <div className="fm-divider" />

            <div className="fm-body">
              {content.body.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {content.items && (
              <ul className="fm-list">
                {content.items.map((item) => (
                  <li key={item}>
                    <span className="fm-dot">◆</span>{item}
                  </li>
                ))}
              </ul>
            )}

            {content.cta && (
              <a href={content.cta.href} className="fm-cta" target="_blank" rel="noopener noreferrer">{content.cta.label}</a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const MODAL_KEYS = new Set(Object.keys(MODAL_CONTENT))

function Footer() {
  const year = new Date().getFullYear()
  const [activeModal, setActiveModal] = useState(null)

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <a href="/" className="footer__logo" aria-label="CMWG Home">
            <img src={cmwgLogo} alt="CMWG" className="footer__logo-img" />
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
                    {MODAL_KEYS.has(link.label)
                      ? (
                        <button
                          className="footer__col-link footer__col-link--btn"
                          onClick={() => setActiveModal(link.label)}
                        >
                          {link.label}
                        </button>
                      ) : (
                        <a href={link.href} className="footer__col-link">{link.label}</a>
                      )
                    }
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

      {activeModal && <FooterModal id={activeModal} onClose={() => setActiveModal(null)} />}

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

        /* Button-reset for modal-trigger footer links */
        .footer__col-link--btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          text-align: left;
        }

        /* ── Footer Modal ── */
        .fm-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0,0,0,0.72);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        .fm-modal {
          position: relative;
          background: #0f0f0d;
          border: 1px solid rgba(201,168,76,0.15);
          width: 100%;
          max-width: 560px;
          max-height: 85vh;
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .fm-modal::-webkit-scrollbar { display: none; }

        .fm-close {
          position: sticky;
          top: 0;
          float: right;
          background: none;
          border: none;
          color: rgba(250,250,248,0.4);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 1rem 1.2rem 0.5rem;
          display: block;
          margin-left: auto;
          transition: color 0.2s;
          z-index: 1;
        }
        .fm-close:hover { color: var(--cmwg-white); }

        .fm-inner {
          padding: 1rem 2rem 2.5rem;
        }

        .fm-logo {
          height: 48px;
          width: auto;
          display: block;
          margin-bottom: 1.5rem;
          opacity: 0.9;
          padding-top: 0.25rem;
        }

        .fm-sub {
          font-family: var(--font-body);
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--cmwg-gold);
          margin: 0 0 0.75rem;
        }

        .fm-heading {
          font-family: var(--font-display);
          font-size: clamp(1.8rem, 4vw, 2.6rem);
          font-weight: 300;
          color: var(--cmwg-white);
          margin: 0 0 1.25rem;
          line-height: 1.1;
        }

        .fm-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(201,168,76,0.3), transparent);
          margin-bottom: 1.5rem;
        }

        .fm-body {
          margin-bottom: 1.5rem;
        }

        .fm-body p {
          font-family: var(--font-body);
          font-size: 0.84rem;
          line-height: 1.75;
          color: rgba(250,250,248,0.55);
          margin: 0 0 1rem;
        }

        .fm-list {
          list-style: none;
          margin: 0 0 1.75rem;
          padding: 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.6rem 1.5rem;
        }

        .fm-list li {
          font-family: var(--font-body);
          font-size: 0.78rem;
          color: rgba(250,250,248,0.5);
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .fm-dot {
          color: var(--cmwg-gold);
          font-size: 0.4rem;
          flex-shrink: 0;
          position: relative;
          top: -1px;
        }

        .fm-cta {
          display: inline-flex;
          align-items: center;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.45);
          color: var(--cmwg-gold);
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          padding: 0.7rem 1.6rem;
          transition: background 0.2s, color 0.2s;
        }
        .fm-cta:hover {
          background: var(--cmwg-gold);
          color: #080808;
        }

        @media (max-width: 480px) {
          .fm-inner { padding: 0 1.25rem 2rem; }
          .fm-list { grid-template-columns: 1fr; }
        }
      `}</style>
    </footer>
  )
}

export default Footer
