import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HotelCard from '../components/booking/HotelCard'
import HotelFilters from '../components/booking/HotelFilters'
import BookingModal from '../components/booking/BookingModal'
import './BookingPage.css'

const MOCK_HOTELS = [
  {
    id: 1,
    name: 'Grand Palace Hotel',
    location: 'Paris, France',
    rating: 5,
    price: 250,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80',
    amenities: ['WiFi', 'Pool', 'Breakfast', 'Spa'],
    description: 'An iconic landmark offering unparalleled views of the Seine and the finest Parisian hospitality.',
    available: true,
  },
  {
    id: 2,
    name: 'City Center Suites',
    location: 'Paris, France',
    rating: 4,
    price: 180,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    amenities: ['WiFi', 'Gym', 'Breakfast'],
    description: 'Sleek urban retreats in the heart of Paris, steps from major attractions.',
    available: true,
  },
  {
    id: 3,
    name: 'Luxury River Resort',
    location: 'Paris, France',
    rating: 5,
    price: 320,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
    amenities: ['WiFi', 'Pool', 'Spa', 'Breakfast', 'Pet Friendly'],
    description: 'Where the river whispers and luxury speaks. A sanctuary of calm amid the city.',
    available: true,
  },
  {
    id: 4,
    name: 'Le Marais Boutique',
    location: 'Paris, France',
    rating: 4,
    price: 210,
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80',
    amenities: ['WiFi', 'Breakfast', 'Spa'],
    description: 'Nestled in the historic Marais district, blending art, culture, and refined comfort.',
    available: false,
  },
  {
    id: 5,
    name: 'Montmartre Heights',
    location: 'Paris, France',
    rating: 3,
    price: 120,
    image: 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=800&q=80',
    amenities: ['WiFi', 'Gym'],
    description: 'Charming hillside hotel with stunning views of the Sacré-Cœur basilica.',
    available: true,
  },
  {
    id: 6,
    name: 'Champs-Élysées Prestige',
    location: 'Paris, France',
    rating: 5,
    price: 480,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
    amenities: ['WiFi', 'Pool', 'Spa', 'Breakfast', 'Gym', 'Pet Friendly'],
    description: 'The pinnacle of Parisian luxury on the world\'s most famous boulevard.',
    available: true,
  },
]

export default function BookingPage() {
  useEffect(() => {
    document.title = 'Hotels & Stays — CMWG Travel'
    return () => { document.title = 'CMWG Travel — Explore the World' }
  }, [])

  const [searchTriggered, setSearchTriggered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    priceMax: 600,
    rating: 0,
    amenities: [],
  })

  const handleSearch = (params) => {
    setSearchParams(params)
    setLoading(true)
    setSearchTriggered(false)
    setTimeout(() => {
      setLoading(false)
      setSearchTriggered(true)
    }, 1400)
  }

  const handleBookNow = (hotel) => {
    setSelectedHotel(hotel)
    setModalOpen(true)
  }

  const filteredHotels = useMemo(() => {
    if (!searchTriggered) return []
    return MOCK_HOTELS.filter((hotel) => {
      if (hotel.price > filters.priceMax) return false
      if (filters.rating > 0 && hotel.rating < filters.rating) return false
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => hotel.amenities.includes(a))
        if (!hasAll) return false
      }
      return true
    })
  }, [searchTriggered, filters])

  return (
    <div className="booking-page">
      <Navbar />
      {/* Hero */}
      <section className="booking-hero">
        <div className="booking-hero__bg" />
        <div className="booking-hero__overlay" />

        <div className="booking-hero__columns">
          {/* Left — existing hero content */}
          <motion.div
            className="booking-hero__content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="booking-hero__eyebrow">Curated Stays Worldwide</p>
            <h1 className="booking-hero__title">Find Your<br /><em>Perfect Stay</em></h1>
            <p className="booking-hero__subtitle">
              Discover hand-picked hotels, resorts, and boutique stays — crafted for every kind of journey.
            </p>
          </motion.div>

          {/* Right — glassmorphism instructions panel */}
          <motion.div
            className="booking-hero__instructions"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="instructions__eyebrow">How It Works</p>
            <h2 className="instructions__heading">Book in Four<br /><em>Simple Steps</em></h2>
            <ol className="instructions__steps">
              {[
                {
                  num: '01',
                  title: 'Choose Your Destination',
                  body: 'Use the search panel below to enter your city or landmark. Popular destinations are suggested to get you started quickly.',
                },
                {
                  num: '02',
                  title: 'Set Your Dates & Guests',
                  body: 'Select your check-in and check-out dates, then specify the number of adults, children, and rooms you need.',
                },
                {
                  num: '03',
                  title: 'Filter & Compare',
                  body: 'Refine results by price range, star rating, or amenities like Pool, Spa, or Pet Friendly to find your perfect match.',
                },
                {
                  num: '04',
                  title: 'Confirm Your Stay',
                  body: 'Click "Book Now" on any hotel card, review the price summary, and confirm your reservation instantly.',
                },
              ].map((step, i) => (
                <motion.li
                  key={step.num}
                  className="instructions__step"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                >
                  <span className="instructions__step-num">{step.num}</span>
                  <div className="instructions__step-body">
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="booking-results-section">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="skeleton"
              className="skeleton-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[...Array(3)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-img shimmer" />
                  <div className="skeleton-body">
                    <div className="skeleton-line shimmer" style={{ width: '60%' }} />
                    <div className="skeleton-line shimmer" style={{ width: '40%' }} />
                    <div className="skeleton-line shimmer" style={{ width: '80%' }} />
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {searchTriggered && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="results-header">
                <motion.h2
                  className="results-title"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {filteredHotels.length > 0
                    ? `${filteredHotels.length} ${filteredHotels.length === 1 ? 'Stay' : 'Stays'} Found`
                    : 'No Results'}
                  {searchParams?.destination && (
                    <span className="results-destination"> in {searchParams.destination}</span>
                  )}
                </motion.h2>
              </div>

              <div className="results-layout">
                <aside className="filters-aside">
                  <HotelFilters filters={filters} onChange={setFilters} />
                </aside>

                <div className="hotels-grid">
                  {filteredHotels.length === 0 ? (
                    <motion.div
                      className="empty-state"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="empty-state__icon">⊘</div>
                      <h3>No hotels match your filters</h3>
                      <p>Try adjusting your price range or removing some filters.</p>
                    </motion.div>
                  ) : (
                    filteredHotels.map((hotel, i) => (
                      <motion.div
                        key={hotel.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        <HotelCard
                          hotel={hotel}
                          searchParams={searchParams}
                          onBookNow={handleBookNow}
                        />
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {!searchTriggered && !loading && (
            <motion.div
              key="idle"
              className="idle-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="idle-state__grid">
                {['Paris', 'Tokyo', 'Santorini', 'New York'].map((city, i) => (
                  <motion.div
                    key={city}
                    className="idle-destination"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    whileHover={{ y: -4 }}
                  >
                    <span className="idle-destination__name">{city}</span>
                    <span className="idle-destination__label">Popular Destination</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {modalOpen && selectedHotel && (
          <BookingModal
            hotel={selectedHotel}
            searchParams={searchParams}
            onClose={() => setModalOpen(false)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}
