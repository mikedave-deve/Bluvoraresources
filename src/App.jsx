import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'

// Lazy load pages for code splitting
const Home          = lazy(() => import('./pages/Home'))
const Jobs          = lazy(() => import('./pages/jobs'))
const SubmitResume  = lazy(() => import('./pages/SubmitResume'))
const About         = lazy(() => import('./pages/About'))
const Contact       = lazy(() => import('./pages/Contact'))

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/jobs"          element={<Jobs />} />
            <Route path="/submit-resume" element={<SubmitResume />} />
            <Route path="/about"         element={<About />} />
            <Route path="/contact"        element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
