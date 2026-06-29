import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Preloader from './components/Preloader'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import FloatingShapes from './components/FloatingShapes'
import Marquee from './components/Marquee'

function AppContent() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f0f0f5] relative">
      <ScrollProgress />
      <FloatingShapes />

      {/* Grain overlay for filmic texture */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navigation scrolled={scrolled} />

      <main className="relative z-10">
        <Hero />

        {/* Marquee strip between Hero and About */}
        <div className="py-8 border-y border-[rgba(65,236,255,0.06)]">
          <Marquee speed={80}>
            <span className="text-[#6b6b7b] text-sm tracking-[0.2em] uppercase mx-8">
              React • TypeScript • Node.js • Next.js • PostgreSQL • Docker • Linux • Tailwind CSS
            </span>
            <span className="text-[#41ECFF] text-sm tracking-[0.2em] uppercase mx-8">
              Full Stack Developer
            </span>
            <span className="text-[#6b6b7b] text-sm tracking-[0.2em] uppercase mx-8">
              React • TypeScript • Node.js • Next.js • PostgreSQL • Docker • Linux • Tailwind CSS
            </span>
            <span className="text-[#41ECFF] text-sm tracking-[0.2em] uppercase mx-8">
              Maxence DETOURNIERE
            </span>
          </Marquee>
        </div>

        <About />
        <Skills />
        <Projects />
        <Experience />

        {/* Second marquee strip */}
        <div className="py-8 border-y border-[rgba(65,236,255,0.06)]">
          <Marquee speed={60} direction="right">
            <span className="text-[#6b6b7b] text-sm tracking-[0.2em] uppercase mx-8">
              Open Source • Clean Code • Performance • UX • Accessibility • Design Systems
            </span>
            <span className="text-[#7200FD] text-sm tracking-[0.2em] uppercase mx-8">
              M4xyll
            </span>
            <span className="text-[#6b6b7b] text-sm tracking-[0.2em] uppercase mx-8">
              Open Source • Clean Code • Performance • UX • Accessibility • Design Systems
            </span>
            <span className="text-[#7200FD] text-sm tracking-[0.2em] uppercase mx-8">
              Let's Build Something Great
            </span>
          </Marquee>
        </div>

        <Contact />
      </main>

      <Footer />
    </div>
  )
}

function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onFinish={() => setLoaded(true)} />}
      </AnimatePresence>
      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <AppContent />
        </motion.div>
      )}
    </>
  )
}

export default App
