import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

const merch = [
  {
    id: 1,
    name: 'CMWG Explorer Tee',
    category: 'Clothing',
    price: '$35',
    tag: 'Bestseller',
    desc: 'Lightweight cotton tee with embroidered CMWG crest. Built for the road.',
    imgs: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['sleeve', 'size', 'height', 'age', 'note'],
  },
  {
    id: 2,
    name: 'Safari Hoodie',
    category: 'Clothing',
    price: '$75',
    tag: 'New',
    desc: 'Midweight fleece hoodie in earthy gold. Perfect for cool savannah nights.',
    imgs: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['size', 'height', 'age', 'note'],
  },
  {
    id: 3,
    name: 'CMWG Snapback Cap',
    category: 'Clothing',
    price: '$28',
    tag: null,
    desc: 'Structured snapback with gold CMWG logo embroidery on a black crown.',
    imgs: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['age', 'note'],
  },
  {
    id: 4,
    name: 'Adventure Duffel',
    category: 'Travel Gear',
    price: '$110',
    tag: 'New',
    desc: '40L waxed canvas duffel with leather handles and CMWG patch. Weekend-ready.',
    imgs: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['note'],
  },
  {
    id: 5,
    name: 'Expedition Bottle',
    category: 'Travel Gear',
    price: '$42',
    tag: null,
    desc: 'Insulated 750ml steel bottle. Keeps cold 24hrs, hot 12hrs. CMWG laser-etched.',
    imgs: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['note'],
  },
  {
    id: 6,
    name: 'Passport Wallet',
    category: 'Travel Gear',
    price: '$55',
    tag: 'Bestseller',
    desc: 'Full-grain leather passport holder with card slots and CMWG gold foil stamp.',
    imgs: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606503153255-59d5e417b073?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    ],
    fields: ['note'],
  },
]

const categories = ['All', 'Clothing', 'Travel Gear']

function MerchModal({ item, onClose }) {
  const [activeImg, setActiveImg] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ sleeve: '', size: '', height: '', age: '', note: '' })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBackdrop = (e) => { if (e.target === e.currentTarget) onClose() }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const has = (f) => item.fields.includes(f)

  return (
    <div className="m-backdrop" onClick={handleBackdrop}>
      <div className="m-modal">
        <button className="m-close" onClick={onClose}>✕</button>

        <div className="m-body">

          {/* LEFT — gallery */}
          <div className="m-gallery">
            <div className="m-main-img">
              <img src={item.imgs[activeImg]} alt={item.name} />
              {item.tag && <span className="m-tag">{item.tag}</span>}
            </div>
            <div className="m-thumbs">
              {item.imgs.map((src, i) => (
                <div
                  key={i}
                  className={`m-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={src} alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — info + optional fit form */}
          <div className="m-right">
            <span className="m-cat">{item.category}</span>
            <h2 className="m-name">{item.name}</h2>
            <p className="m-desc">{item.desc}</p>
            <p className="m-price">{item.price}</p>

            {!submitted ? (
              <form className="m-form" onSubmit={handleSubmit}>
                <p className="m-form-label">Tailor your fit <span>(all optional)</span></p>

                {has('sleeve') && (
                  <div className="m-field">
                    <label>Sleeve preference</label>
                    <div className="m-toggle-row">
                      {['Short sleeve', 'Long sleeve'].map(s => (
                        <button
                          type="button"
                          key={s}
                          className={`m-toggle ${form.sleeve === s ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, sleeve: form.sleeve === s ? '' : s })}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {has('size') && (
                  <div className="m-field">
                    <label>Size</label>
                    <div className="m-toggle-row">
                      {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(s => (
                        <button
                          type="button"
                          key={s}
                          className={`m-toggle m-toggle--sm ${form.size === s ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, size: form.size === s ? '' : s })}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {has('height') && (
                  <div className="m-field">
                    <label>Height <span className="opt">(cm or ft)</span></label>
                    <input
                      type="text"
                      placeholder="e.g. 175cm or 5'9&quot;"
                      value={form.height}
                      onChange={e => setForm({ ...form, height: e.target.value })}
                    />
                  </div>
                )}

                {has('age') && (
                  <div className="m-field">
                    <label>Age <span className="opt">(helps with fit)</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 28"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={e => setForm({ ...form, age: e.target.value })}
                    />
                  </div>
                )}

                {has('note') && (
                  <div className="m-field">
                    <label>Any requests <span className="opt">(optional)</span></label>
                    <textarea
                      rows={2}
                      placeholder="Custom print, colour preference, gift wrapping…"
                      value={form.note}
                      onChange={e => setForm({ ...form, note: e.target.value })}
                    />
                  </div>
                )}

                <button type="submit" className="m-submit">Submit Order Interest</button>
              </form>
            ) : (
              <div className="m-success">
                <div className="m-success-icon">✦</div>
                <h3>We've got your details</h3>
                <p>Our team will reach out to confirm your <strong>{item.name}</strong> order shortly.</p>
                <button className="m-success-close" onClick={onClose}>Close</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default function Merch() {
  const scrollRef = useRef(null)
  const [active, setActive] = useState('All')
  const [openItem, setOpenItem] = useState(null)

  const filtered = active === 'All' ? merch : merch.filter(m => m.category === active)

  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0, velocity: 0 })

  const onDown = (e) => {
    const el = scrollRef.current
    drag.current = { ...drag.current, isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft }
  }
  const onUp = () => {
    drag.current.isDown = false
    const momentum = () => {
      scrollRef.current.scrollLeft += drag.current.velocity
      drag.current.velocity *= 0.92
      if (Math.abs(drag.current.velocity) > 0.5) requestAnimationFrame(momentum)
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

  return (
    <section className="merch" id="shop">

      <div className="merch__header">
        <p className="merch__eyebrow">Official Store</p>
        <h2 className="merch__title">Wear the Journey</h2>
        <p className="merch__sub">CMWG-branded gear for every explorer — on the road and off it.</p>

        <div className="merch__filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={active === cat ? 'active' : ''}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* HORIZONTAL SCROLL */}
      <div
        className="merch__scroll"
        ref={scrollRef}
        onMouseDown={onDown}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onMouseMove={onMove}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="merch__card"
            onClick={() => setOpenItem(item)}
          >
            <div className="merch__img-wrap">
              <img src={item.imgs[0]} alt={item.name} />
              {item.tag && <span className="merch__tag">{item.tag}</span>}
              <div className="merch__img-overlay" />
            </div>
            <div className="merch__info">
              <span className="merch__cat">{item.category}</span>
              <h3>{item.name}</h3>
              <p>{item.desc}</p>
              <div className="merch__footer">
                <span className="merch__price">{item.price}</span>
                <button className="merch__cta">View →</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="merch__bottom">
        <p>Want a custom order or bulk gear for your group trip?</p>
        <a href="#plan" className="merch__contact">Get in Touch</a>
      </div>

      {openItem && <MerchModal item={openItem} onClose={() => setOpenItem(null)} />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

        .merch {
          background: #080808;
          padding: 120px 6vw;
          color: white;
          font-family: 'DM Sans', sans-serif;
        }

        .merch__header { margin-bottom: 3rem; }

        .merch__eyebrow {
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          margin-bottom: 0.5rem;
        }

        .merch__title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 5vw, 4rem);
          font-weight: 300;
          margin: 0 0 0.4rem;
          letter-spacing: -0.01em;
        }

        .merch__sub {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin-bottom: 1.8rem;
        }

        .merch__filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .merch__filters button {
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

        .merch__filters button:hover { border-color: rgba(201,168,76,0.5); color: #c9a84c; }
        .merch__filters .active { background: #c9a84c; border-color: #c9a84c; color: #080808; }

        /* SCROLL STRIP */
        .merch__scroll {
          display: flex;
          gap: 1.2rem;
          overflow-x: auto;
          cursor: grab;
          scroll-snap-type: x mandatory;
          padding-bottom: 1rem;
          user-select: none;
        }

        .merch__scroll:active { cursor: grabbing; }
        .merch__scroll::-webkit-scrollbar { display: none; }

        .merch__card {
          min-width: 300px;
          max-width: 300px;
          scroll-snap-align: start;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.3s, transform 0.3s;
        }

        .merch__card:hover {
          border-color: rgba(201,168,76,0.4);
          transform: translateY(-4px);
        }

        .merch__img-wrap {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .merch__img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .merch__card:hover .merch__img-wrap img { transform: scale(1.05); }

        .merch__img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%);
          pointer-events: none;
        }

        .merch__tag {
          position: absolute;
          top: 1rem; left: 1rem;
          background: #c9a84c;
          color: #080808;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.28rem 0.65rem;
        }

        .merch__info { padding: 1.1rem 1.2rem 1.3rem; }

        .merch__cat {
          font-size: 0.62rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c9a84c;
          display: block;
          margin-bottom: 0.35rem;
        }

        .merch__info h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem;
          font-weight: 400;
          margin: 0 0 0.3rem;
          line-height: 1.2;
        }

        .merch__info p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.55;
          margin: 0 0 0.9rem;
        }

        .merch__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .merch__price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.45rem;
          color: #c9a84c;
        }

        .merch__cta {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .merch__cta:hover { background: #c9a84c; color: #080808; }

        .merch__bottom {
          margin-top: 3.5rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .merch__bottom p { font-size: 0.88rem; color: rgba(255,255,255,0.4); margin: 0; }

        .merch__contact {
          background: #c9a84c;
          color: #080808;
          text-decoration: none;
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.7rem 1.6rem;
          transition: background 0.2s;
          white-space: nowrap;
        }

        .merch__contact:hover { background: #e0bc60; }

        /* ── MODAL ── */
        .m-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.93);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2vw;
          animation: mFade 0.25s ease;
        }

        @keyframes mFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }

        .m-modal {
          position: relative;
          width: 90vw;
          max-width: 1100px;
          height: 85vh;
          min-width: 420px;
          min-height: 400px;
          max-height: 95vh;
          background: #0f0f0f;
          border: 1px solid rgba(201,168,76,0.2);
          animation: mUp 0.32s ease;
          display: flex;
          flex-direction: column;
          resize: both;
          overflow: hidden;
          box-sizing: border-box;
        }

        .m-modal::after {
          content: '';
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 12px;
          height: 12px;
          border-right: 2px solid rgba(201,168,76,0.4);
          border-bottom: 2px solid rgba(201,168,76,0.4);
          pointer-events: none;
        }

        .m-close {
          position: absolute;
          top: 1rem; right: 1rem;
          z-index: 10;
          background: rgba(0,0,0,0.6);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
          width: 34px; height: 34px;
          cursor: pointer;
          font-size: 0.72rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          border-radius: 2px;
        }

        .m-close:hover { border-color: #c9a84c; color: #c9a84c; }

        .m-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          flex: 1;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        /* LEFT gallery */
        .m-gallery {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          border-right: 1px solid rgba(255,255,255,0.07);
          background: #0a0a0a;
          box-sizing: border-box;
          overflow: hidden;
          height: 100%;
        }

        .m-main-img {
          position: relative;
          flex: 1;
          min-height: 0;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .m-main-img img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease, opacity 0.3s ease;
        }

        .m-main-img:hover img { transform: scale(1.03); }

        .m-tag {
          position: absolute;
          top: 0.8rem; left: 0.8rem;
          z-index: 2;
          background: #c9a84c;
          color: #080808;
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.28rem 0.65rem;
        }

        .m-thumbs {
          display: flex;
          gap: 0.6rem;
          flex-shrink: 0;
          height: 72px;
        }

        .m-thumb {
          flex: 1;
          height: 72px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.2s;
          position: relative;
        }

        .m-thumb.active { border-color: #c9a84c; }
        .m-thumb:hover { border-color: rgba(201,168,76,0.5); }

        .m-thumb img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .m-thumb:hover img { transform: scale(1.08); }

        /* RIGHT info + form */
        .m-right {
          padding: 1.8rem 1.8rem 1.5rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          height: 100%;
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: rgba(201,168,76,0.3) transparent;
        }

        .m-right::-webkit-scrollbar { width: 4px; }
        .m-right::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }
        .m-right::-webkit-scrollbar-track { background: transparent; }

        .m-cat {
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c9a84c;
          display: block;
          margin-bottom: 0.5rem;
        }

        .m-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 300;
          color: white;
          margin: 0 0 0.6rem;
          line-height: 1.1;
        }

        .m-desc {
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.65;
          margin: 0 0 0.8rem;
        }

        .m-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          color: #c9a84c;
          margin: 0 0 1.4rem;
        }

        .m-form { display: flex; flex-direction: column; gap: 1rem; }

        .m-form-label {
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin: 0;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .m-form-label span { color: rgba(255,255,255,0.2); text-transform: none; letter-spacing: 0; }

        .m-field { display: flex; flex-direction: column; gap: 0.35rem; }

        .m-field label {
          font-size: 0.67rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.38);
        }

        .m-field label .opt {
          text-transform: none;
          letter-spacing: 0;
          color: rgba(255,255,255,0.2);
          font-size: 0.65rem;
        }

        .m-field input,
        .m-field textarea {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          padding: 0.5rem 0.75rem;
          outline: none;
          resize: none;
          transition: border-color 0.2s;
        }

        .m-field input:focus,
        .m-field textarea:focus { border-color: rgba(201,168,76,0.5); }
        .m-field input::placeholder,
        .m-field textarea::placeholder { color: rgba(255,255,255,0.18); }

        .m-toggle-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .m-toggle {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          padding: 0.4rem 0.9rem;
          cursor: pointer;
          transition: all 0.18s;
        }

        .m-toggle--sm { padding: 0.35rem 0.65rem; font-size: 0.74rem; }

        .m-toggle:hover { border-color: rgba(201,168,76,0.4); color: #c9a84c; }
        .m-toggle.active { background: #c9a84c; border-color: #c9a84c; color: #080808; }

        .m-submit {
          background: #c9a84c;
          border: none;
          color: #080808;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 0.4rem;
        }

        .m-submit:hover { background: #e0bc60; }

        /* success */
        .m-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          flex: 1;
          gap: 0.9rem;
          padding: 2rem 1rem;
        }

        .m-success-icon { font-size: 2rem; color: #c9a84c; }

        .m-success h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.7rem;
          font-weight: 300;
          margin: 0;
          color: white;
        }

        .m-success p {
          font-size: 0.84rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.6;
          max-width: 240px;
          margin: 0;
        }

        .m-success strong { color: #c9a84c; }

        .m-success-close {
          background: transparent;
          border: 1px solid rgba(201,168,76,0.4);
          color: #c9a84c;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.74rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.55rem 1.3rem;
          cursor: pointer;
          margin-top: 0.4rem;
          transition: all 0.2s;
        }

        .m-success-close:hover { background: #c9a84c; color: #080808; }

        /* responsive */
        @media (max-width: 700px) {
          .m-body { grid-template-columns: 1fr; }
          .m-gallery { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); max-height: 280px; }
        }
      `}</style>
    </section>
  )
}
