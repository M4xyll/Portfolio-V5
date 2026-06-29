import { useEffect, useRef } from 'react'

export default function MorphingGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let isInView = true
    const dpr = window.devicePixelRatio || 1

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    if (canvas.parentElement) ro.observe(canvas.parentElement)

    const observer = new IntersectionObserver(
      ([entry]) => { isInView = entry.isIntersecting },
      { threshold: 0 }
    )
    if (wrapperRef.current) observer.observe(wrapperRef.current)

    // Blob parameters
    const blobs = [
      { x: 0.3, y: 0.4, r: 0.35, color: [65, 236, 255], speed: 0.0004, phase: 0 },
      { x: 0.7, y: 0.5, r: 0.3, color: [26, 90, 185], speed: 0.0005, phase: 2 },
      { x: 0.5, y: 0.6, r: 0.28, color: [114, 0, 253], speed: 0.0003, phase: 4 },
      { x: 0.2, y: 0.7, r: 0.22, color: [65, 236, 255], speed: 0.0006, phase: 1 },
    ]

    const animate = (time: number) => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      if (!isInView) {
        animationId = requestAnimationFrame(animate)
        return
      }
      ctx.clearRect(0, 0, w, h)

      // Draw each blob as a soft radial gradient
      blobs.forEach((blob) => {
        const cx = w * (blob.x + Math.sin(time * blob.speed + blob.phase) * 0.08)
        const cy = h * (blob.y + Math.cos(time * blob.speed * 1.3 + blob.phase) * 0.06)
        const r = Math.min(w, h) * (blob.r + Math.sin(time * blob.speed * 0.7) * 0.03)

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.15)`)
        gradient.addColorStop(0.4, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0.06)`)
        gradient.addColorStop(1, `rgba(${blob.color[0]}, ${blob.color[1]}, ${blob.color[2]}, 0)`)

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, w, h)
      })

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ opacity: 0.7, mixBlendMode: 'screen' }}
        aria-hidden="true"
      />
    </div>
  )
}
