import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BookingWizard from '../components/booking/BookingWizard'
import './BookingPage.css'

export default function BookingPage() {
  useEffect(() => {
    document.title = 'Hotels & Stays — CMWG Travel'
    return () => { document.title = 'CMWG Travel — Explore the World' }
  }, [])

  return (
    <div className="booking-page">
      <Navbar />

      {/* ── Hero — untouched ── */}
      <section className="booking-hero">
        <div className="booking-hero__bg" />
        <div className="booking-hero__overlay" />

        <div className="booking-hero__columns">
          {/* Left */}
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

          {/* Right — instructions panel */}
          <motion.div
            className="booking-hero__instructions"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="instructions__eyebrow">How It Works</p>
            <h2 className="instructions__heading">Book in Six<br /><em>Simple Steps</em></h2>
            <ol className="instructions__steps">
              {[
                {
                  num: '01',
                  title: 'Choose Your Destination',
                  body: 'Pick from our curated list of cities below to see available hotels.',
                },
                {
                  num: '02',
                  title: 'Select Your Hotel',
                  body: 'Browse top picks for your destination and choose the one that fits you best.',
                },
                {
                  num: '03',
                  title: 'Pick Your View',
                  body: 'Ocean, city, garden, pool, or mountain — choose what you want to wake up to.',
                },
                {
                  num: '04',
                  title: 'Set Your Dates',
                  body: 'Select your check-in and check-out dates to see your total nights.',
                },
                {
                  num: '05',
                  title: 'Choose Payment',
                  body: 'Decide whether to pay now or settle up when you arrive.',
                },
                {
                  num: '06',
                  title: 'Review & Confirm',
                  body: 'Add your name, email, and phone, review your summary, and confirm your booking.',
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

      {/* ── Booking Wizard — anchored below hero ── */}
      <section className="booking-search-section">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <BookingWizard />
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
