import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Merch from './components/Merch'
import About from './components/About'
import ExperiencesPreview from './components/ExperiencesPreview'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'
import BookingPage from './pages/BookingPage'
import ExperiencesPage from './pages/ExperiencesPage'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Destinations />
      <Merch />
      <ExperiencesPreview />
      <About />
      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiences" element={<ExperiencesPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
