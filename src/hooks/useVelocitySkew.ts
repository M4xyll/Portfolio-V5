import { useEffect, useRef, useState } from 'react'

export function useVelocitySkew(maxSkew = 3, smoothing = 0.1) {
  const [skew, setSkew] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const currentSkew = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const update = () => {
      const now = Date.now()
      const scrollY = window.scrollY
      const dt = Math.max(now - lastTime.current, 1)
      const dy = scrollY - lastScrollY.current
      const velocity = (dy / dt) * 16 // Normalize to ~60fps

      const target = Math.max(-maxSkew, Math.min(maxSkew, velocity * 0.3))
      currentSkew.current += (target - currentSkew.current) * smoothing

      // Snap to 0 when very close
      if (Math.abs(currentSkew.current) < 0.05) {
        currentSkew.current = 0
      }

      setSkew(currentSkew.current)
      lastScrollY.current = scrollY
      lastTime.current = now
      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)

    return () => cancelAnimationFrame(rafRef.current)
  }, [maxSkew, smoothing])

  return skew
}
