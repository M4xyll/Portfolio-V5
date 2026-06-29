import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      targetRef.current = docHeight > 0 ? scrollTop / docHeight : 0

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      currentRef.current = lerp(currentRef.current, targetRef.current, 0.12)

      // Snap to target when very close to avoid micro-jitter
      if (Math.abs(targetRef.current - currentRef.current) < 0.001) {
        currentRef.current = targetRef.current
      }

      if (barRef.current) {
        barRef.current.style.width = `${currentRef.current * 100}%`
      }

      // Pause loop when settled to save battery
      if (currentRef.current !== targetRef.current) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        rafRef.current = 0
      }
    }

    // Set initial position so bar reflects current scroll on load/refresh
    handleScroll()
    currentRef.current = targetRef.current
    if (barRef.current) {
      barRef.current.style.width = `${currentRef.current * 100}%`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-[#41ECFF] to-[#7200FD] shadow-[0_0_10px_rgba(65,236,255,0.5)]"
        style={{ width: '0%' }}
      />
    </div>
  )
}
