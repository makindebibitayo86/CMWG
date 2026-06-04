import { useRef } from 'react'

export default function Destinations() {
  const scrollRef = useRef(null)

  const places = [
    {
      title: 'Lagos City Escape',
      desc: 'Urban energy, beaches, nightlife',
      img: 'https://images.unsplash.com/photo-1526401485004-2aa7c8e5f9f2?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Safari Experience',
      desc: 'Wildlife, nature, guided tours',
      img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Sahara Adventure',
      desc: 'Desert journeys and cultural immersion',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Coastal Retreats',
      desc: 'Ocean views and relaxation',
      img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Cape Town Escape',
      desc: 'Mountains, beaches, and city life',
      img: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Nairobi Safari Hub',
      desc: 'Wildlife parks and nature reserves',
      img: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Zanzibar Islands',
      desc: 'Crystal waters and tropical escape',
      img: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Marrakech Culture',
      desc: 'Markets, heritage, and vibrant streets',
      img: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    },
  ]

  // DRAG LOGIC
  const startX = useRef(0)
  const scrollLeft = useRef(0)
  const isDown = useRef(false)

  const onMouseDown = (e) => {
    isDown.current = true
    startX.current = e.pageX - scrollRef.current.offsetLeft
    scrollLeft.current = scrollRef.current.scrollLeft
  }

  const onMouseLeave = () => {
    isDown.current = false
  }

  const onMouseUp = () => {
    isDown.current = false
  }

  const onMouseMove = (e) => {
    if (!isDown.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    scrollRef.current.scrollLeft = scrollLeft.current - walk
  }

  return (
    <section className="destinations" id="destinations">

      {/* HEADER */}
      <div className="destinations__header">
        <h2>Popular Destinations</h2>
        <p>Drag to explore curated journeys across Africa.</p>
      </div>

      {/* DRAGGABLE CAROUSEL */}
      <div
        className="destinations__scroll"
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseUp={onMouseUp}
        onMouseMove={onMouseMove}
      >
        {places.map((place) => (
          <div key={place.title} className="destinations__card">

            <div className="destinations__image">
              <img src={place.img} alt={place.title} />
              <div className="destinations__overlay" />
            </div>

            <div className="destinations__content">
              <h3>{place.title}</h3>
              <p>{place.desc}</p>

              <button className="destinations__btn">
                Explore
              </button>
            </div>

          </div>
        ))}
      </div>

      <style>{`
        .destinations {
          padding: 120px 6vw;
          background: #0a0a0a;
          color: white;
        }

        .destinations__header {
          max-width: 720px;
          margin-bottom: 2.5rem;
        }

        .destinations__header h2 {
          font-size: clamp(2rem, 4vw, 3rem);
          margin-bottom: 0.5rem;
        }

        .destinations__header p {
          opacity: 0.65;
          line-height: 1.6;
        }

        /* CAROUSEL */
        .destinations__scroll {
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
          padding-bottom: 1rem;
          cursor: grab;
          scroll-behavior: smooth;
        }

        .destinations__scroll:active {
          cursor: grabbing;
        }

        .destinations__scroll::-webkit-scrollbar {
          display: none;
        }

        /* CARD */
        .destinations__card {
          min-width: 340px;
          flex: 0 0 auto;

          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          overflow: hidden;
          transition: 0.35s ease;
        }

        .destinations__card:hover {
          transform: translateY(-10px);
          border-color: rgba(201,168,76,0.4);
        }

        /* IMAGE */
        .destinations__image {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .destinations__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          transition: transform 0.7s ease;
          user-select: none;
          pointer-events: none;
        }

        .destinations__card:hover img {
          transform: scale(1.15);
        }

        .destinations__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.8),
            transparent 60%
          );
        }

        /* CONTENT */
        .destinations__content {
          padding: 1.2rem;
        }

        .destinations__content h3 {
          margin: 0 0 0.4rem;
          font-size: 1.1rem;
        }

        .destinations__content p {
          margin: 0 0 1rem;
          opacity: 0.65;
          font-size: 0.9rem;
        }

        .destinations__btn {
          background: #c9a84c;
          border: none;
          padding: 0.6rem 1rem;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .destinations__btn:hover {
          background: #e2c27d;
        }
      `}</style>

    </section>
  )
}