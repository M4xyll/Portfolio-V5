import { useEffect, useRef } from 'react'

interface Shape {
  type: 'circle' | 'triangle' | 'hexagon'
  x: number
  y: number
  size: number
  color: string
  opacity: number
  blur: number
  duration: number
  delay: number
  yOffset: number
}

const shapes: Shape[] = [
  { type: 'circle', x: 10, y: 20, size: 120, color: '#41ECFF', opacity: 0.04, blur: 80, duration: 20, delay: 0, yOffset: 30 },
  { type: 'circle', x: 85, y: 60, size: 180, color: '#7200FD', opacity: 0.03, blur: 100, duration: 25, delay: 2, yOffset: -40 },
  { type: 'circle', x: 70, y: 15, size: 100, color: '#7200FD', opacity: 0.03, blur: 60, duration: 18, delay: 4, yOffset: 25 },
  { type: 'triangle', x: 25, y: 70, size: 80, color: '#41ECFF', opacity: 0.02, blur: 40, duration: 22, delay: 1, yOffset: -20 },
  { type: 'hexagon', x: 50, y: 40, size: 60, color: '#7200FD', opacity: 0.025, blur: 50, duration: 24, delay: 3, yOffset: 35 },
  { type: 'circle', x: 40, y: 85, size: 140, color: '#7200FD', opacity: 0.02, blur: 90, duration: 28, delay: 5, yOffset: -30 },
  { type: 'triangle', x: 90, y: 30, size: 50, color: '#41ECFF', opacity: 0.02, blur: 30, duration: 19, delay: 6, yOffset: 20 },
]

function ShapeSVG({ shape }: { shape: Shape }) {
  const s = shape.size

  if (shape.type === 'circle') {
    return (
      <div
        className="rounded-full"
        style={{
          width: s,
          height: s,
          backgroundColor: shape.color,
          filter: `blur(${shape.blur}px)`,
          opacity: shape.opacity,
        }}
      />
    )
  }

  if (shape.type === 'triangle') {
    return (
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: `${s / 2}px solid transparent`,
          borderRight: `${s / 2}px solid transparent`,
          borderBottom: `${s}px solid ${shape.color}`,
          filter: `blur(${shape.blur}px)`,
          opacity: shape.opacity,
        }}
      />
    )
  }

  // Hexagon
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: `blur(${shape.blur}px)`, opacity: shape.opacity }}>
      <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill={shape.color} />
    </svg>
  )
}

export default function FloatingShapes() {
  const itemsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const items = itemsRef.current
    if (items.length === 0) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      items.forEach((el, i) => {
        if (!el) return
        const speed = 0.02 + (i % 3) * 0.015
        el.style.transform = `translateY(${scrollY * speed}px)`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {shapes.map((shape, i) => (
        <div
          key={i}
          ref={(el) => { if (el) itemsRef.current[i] = el }}
          className="absolute will-change-transform"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
        >
          <div
            style={{
              animation: `float ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
            }}
          >
            <div
              style={{
                animation: `float-y ${shape.duration * 0.7}s ease-in-out ${shape.delay}s infinite`,
              }}
            >
              <ShapeSVG shape={shape} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
