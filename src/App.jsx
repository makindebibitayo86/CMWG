import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Destinations from './components/Destinations'
import Merch from './components/Merch'
import About from './components/About'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'
import BookingPage from './pages/BookingPage'

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Destinations />
      <Merch />
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App