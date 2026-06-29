import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MagneticButton from './MagneticButton'
import MorphingGradient from './MorphingGradient'
import TextReveal from './TextReveal'

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [textRevealed, setTextRevealed] = useState(false)
  const [hoveredLetter, setHoveredLetter] = useState<number | null>(null)
  const [scrambled, setScrambled] = useState<string[]>([])
  const SURNAME = 'DETOURNIERE'

  // 3D mouse parallax
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), springConfig)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // Scramble on hover
  useEffect(() => {
    if (hoveredLetter === null) {
      setScrambled(SURNAME.split(''))
      return
    }

    const order = SURNAME.split('').map((_, i) => ({
      idx: i,
      dist: Math.abs(i - hoveredLetter),
    }))
    order.sort((a, b) => a.dist - b.dist)

    const totalFrames = 18
    const revealFrame: number[] = []
    order.forEach((o, rank) => {
      revealFrame[o.idx] = Math.round((rank / order.length) * totalFrames)
    })

    let frame = 0
    let rafId = 0

    const animate = () => {
      const chars = SURNAME.split('').map((char, i) =>
        frame >= revealFrame[i] ? char : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      )
      setScrambled(chars)
      frame++
      if (frame <= totalFrames) rafId = requestAnimationFrame(animate)
    }
    animate()

    return () => cancelAnimationFrame(rafId)
  }, [hoveredLetter])

  useEffect(() => {
    const timer = setTimeout(() => setTextRevealed(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const dpr = window.devicePixelRatio || 1
    const mouse = { x: -9999, y: -9999 }
    const section = sectionRef.current

    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!animationId) animate()
        } else {
          if (animationId) {
            cancelAnimationFrame(animationId)
            animationId = 0
          }
        }
      },
      { threshold: 0 }
    )
    if (section) sectionObserver.observe(section)

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    // Create particles
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.clientWidth,
        y: Math.random() * canvas.clientHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.15,
      })
    }

    let isVisible = true
    const visibilityHandler = () => {
      isVisible = document.visibilityState === 'visible'
      if (isVisible && !animationId) {
        animate()
      }
    }
    document.addEventListener('visibilitychange', visibilityHandler)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      if (!isVisible) {
        animationId = 0
        return
      }

      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      particles.forEach((p) => {
        // Mouse avoidance / attraction zone
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mouseRadius = 120

        if (dist < mouseRadius && dist > 0) {
          const force = (mouseRadius - dist) / mouseRadius
          p.vx -= (dx / dist) * force * 0.8
          p.vy -= (dy / dist) * force * 0.8
        }

        // Apply slight friction to prevent runaway velocity
        p.vx *= 0.98
        p.vy *= 0.98

        // Keep minimum movement
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.05
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.05

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = canvas.clientWidth + 10
        if (p.x > canvas.clientWidth + 10) p.x = -10
        if (p.y < -10) p.y = canvas.clientHeight + 10
        if (p.y > canvas.clientHeight + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(65, 236, 255, ${p.opacity})`
        ctx.fill()
      })

      // Draw connections with mouse proximity boost
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 180) {
            // Check if mouse is nearby to boost connection opacity
            const midX = (p1.x + p2.x) / 2
            const midY = (p1.y + p2.y) / 2
            const mouseDx = mouse.x - midX
            const mouseDy = mouse.y - midY
            const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)
            const mouseBoost = mouseDist < 150 ? 1 + (1 - mouseDist / 150) * 2 : 1

            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            const baseAlpha = 0.06 * (1 - dist / 180) * mouseBoost
            ctx.strokeStyle = `rgba(65, 236, 255, ${Math.min(baseAlpha, 0.25)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      })

      // Draw mouse connection glow
      if (mouse.x > -1000) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x
          const dy = mouse.y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 200) {
            ctx.beginPath()
            ctx.moveTo(mouse.x, mouse.y)
            ctx.lineTo(p.x, p.y)
            ctx.strokeStyle = `rgba(114, 0, 253, ${0.12 * (1 - dist / 200)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        })
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
      sectionObserver.disconnect()
      document.removeEventListener('visibilitychange', visibilityHandler)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full"
        style={{ opacity: 0.6 }}
        aria-hidden="true"
      />

      {/* Morphing gradient background */}
      <MorphingGradient />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-4xl mx-auto"
        style={{
          perspective: 1000,
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`mb-6 inline-block transition-all duration-700 ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-[#41ECFF] text-sm font-medium tracking-[0.3em] uppercase border border-[rgba(65,236,255,0.2)] px-4 py-2 rounded-full">
            Full Stack Developer
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-heading)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1]">
          <span className={`block text-[#f0f0f5] transition-all duration-700 delay-150 ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {'Maxence'.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  transitionDelay: `${150 + i * 40}ms`,
                  opacity: textRevealed ? 1 : 0,
                  transform: textRevealed ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {char}
              </span>
            ))}
          </span>
          <span
            className={`block mt-2 transition-all duration-700 delay-300 cursor-default select-none ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            onMouseLeave={() => setHoveredLetter(null)}
          >
            {SURNAME.split('').map((char, i) => (
              <span
                key={i}
                className="inline-block gradient-text transition-all duration-200"
                onMouseEnter={() => setHoveredLetter(i)}
                style={{
                  opacity: scrambled[i] === char || hoveredLetter === null ? 1 : 0.4,
                }}
              >
                {scrambled[i] ?? char}
              </span>
            ))}
          </span>
        </h1>

        <div className="max-w-2xl mx-auto mb-10">
          <TextReveal
            className="text-[#a0a0b0] text-lg md:text-xl leading-relaxed"
            delay={0.5}
            type="words"
          >
            I craft digital experiences that merge performance with aesthetics. Building the web, one pixel at a time.
          </TextReveal>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-700 ${textRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <MagneticButton
            className="group relative px-8 py-4 bg-gradient-to-r from-[#41ECFF] to-[#7200FD] text-[#0a0a0f] font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(65,236,255,0.3)]"
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="relative z-10">View My Work</span>
          </MagneticButton>
          <MagneticButton
            className="px-8 py-4 border border-[rgba(65,236,255,0.3)] text-[#41ECFF] font-semibold rounded-full transition-all duration-300 hover:bg-[rgba(65,236,255,0.08)] hover:border-[rgba(65,236,255,0.5)]"
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </MagneticButton>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#a0a0b0] hover:text-[#41ECFF] transition-colors duration-300 animate-bounce"
        aria-label="Scroll down"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  )
}
