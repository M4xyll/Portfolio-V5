import { useEffect, useState, useRef } from 'react'

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

interface CounterProps {
  target: number
  trigger: boolean
  duration?: number
  suffix?: string
  className?: string
}

export default function Counter({ target, trigger, duration = 1500, suffix = '', className = '' }: CounterProps) {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!trigger || hasRun.current) return
    hasRun.current = true

    let frame = 0
    const totalFrames = Math.ceil(duration / 16)

    const animate = () => {
      frame++
      const progress = easeOutExpo(frame / totalFrames)
      setCount(Math.round(target * progress))

      if (frame < totalFrames) {
        requestAnimationFrame(animate)
      } else {
        setCount(target)
      }
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [trigger, target, duration])

  return <span className={className}>{count}{suffix}</span>
}
