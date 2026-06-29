import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show custom cursor on non-touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    let mouseX = -100
    let mouseY = -100
    let trailX = -100
    let trailY = -100
    let animationId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const handleHoverStart = (e: Event) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]')
      ) {
        setIsHovering(true)
      }
    }

    const handleHoverEnd = () => {
      setIsHovering(false)
    }

    const animate = () => {
      // Smooth trail follow
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15

      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleHoverStart)
    document.addEventListener('mouseout', handleHoverEnd)

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleHoverStart)
      document.removeEventListener('mouseout', handleHoverEnd)
      cancelAnimationFrame(animationId)
    }
  }, [isVisible])

  return (
    <>
      {/* Trail dot */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 0 : 0,
          width: isHovering ? 40 : 24,
          height: isHovering ? 40 : 24,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
        }}
      >
        <div className="w-full h-full rounded-full bg-[#41ECFF] blur-md" />
      </div>

      {/* Main cursor dot */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300"
        style={{
          opacity: isVisible ? 0 : 0,
          width: isHovering ? 48 : 8,
          height: isHovering ? 48 : 8,
          transition: 'width 0.3s ease, height 0.3s ease, opacity 0.3s ease',
        }}
      >
        <div
          className="w-full h-full rounded-full border-2 border-[#41ECFF]"
          style={{
            backgroundColor: isHovering ? 'rgba(65, 236, 255, 0.1)' : '#41ECFF',
            boxShadow: isHovering
              ? '0 0 20px rgba(65, 236, 255, 0.4), 0 0 40px rgba(65, 236, 255, 0.2)'
              : '0 0 10px rgba(65, 236, 255, 0.5)',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          }}
        />
      </div>

      {/* Hide default cursor */}
      {/* <style>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style> */}
    </>
  )
}
