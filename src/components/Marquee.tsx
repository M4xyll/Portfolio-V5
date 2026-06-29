import { useRef, useEffect } from 'react'

interface MarqueeProps {
  children: React.ReactNode
  speed?: number
  direction?: 'left' | 'right'
  className?: string
  pauseOnHover?: boolean
}

export default function Marquee({
  children,
  speed = 60,
  direction = 'left',
  className = '',
  pauseOnHover = false,
}: MarqueeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const track = trackRef.current
    if (!wrapper || !track) return

    const content = track.firstElementChild as HTMLElement | null
    if (!content) return

    const contentW = content.scrollWidth
    if (contentW === 0) return

    // Set track width to exactly 2x content (2 copies)
    track.style.width = `${contentW * 2}px`

    let lastTime = 0
    const dir = direction === 'left' ? -1 : 1

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time
      const dt = (time - lastTime) / 1000
      lastTime = time

      if (!pausedRef.current) {
        posRef.current += dir * (speed * 0.5) * dt

        // Wrap position seamlessly
        if (posRef.current < -contentW) posRef.current += contentW
        if (posRef.current > 0) posRef.current -= contentW

        track.style.transform = `translateX(${posRef.current}px)`
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    if (pauseOnHover) {
      const onEnter = () => { pausedRef.current = true }
      const onLeave = () => { pausedRef.current = false }
      wrapper.addEventListener('mouseenter', onEnter)
      wrapper.addEventListener('mouseleave', onLeave)
      return () => {
        cancelAnimationFrame(rafRef.current)
        wrapper.removeEventListener('mouseenter', onEnter)
        wrapper.removeEventListener('mouseleave', onLeave)
      }
    }

    return () => cancelAnimationFrame(rafRef.current)
  }, [children, speed, direction, pauseOnHover])

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
      }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap">
        <div className="flex items-center shrink-0">{children}</div>
        <div className="flex items-center shrink-0" aria-hidden="true">{children}</div>
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
