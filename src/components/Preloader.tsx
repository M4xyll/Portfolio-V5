import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const TEXT = 'M4xyll'
const COLORS = ['#41ECFF', '#7200FD', '#a855f7', '#38bdf8']

function getTextPoints(txt: string, maxW: number, maxH: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = []
  const cvs = document.createElement('canvas')
  cvs.width = maxW
  cvs.height = maxH
  const ctx = cvs.getContext('2d')
  if (!ctx) return points
  const fs = Math.min(maxW * 0.22, 180)
  ctx.font = `900 ${fs}px 'Space Grotesk', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '0.15em'
  ctx.fillStyle = '#fff'
  ctx.fillText(txt, maxW / 2, maxH / 2)
  const img = ctx.getImageData(0, 0, maxW, maxH)
  const gap = 10
  for (let y = 0; y < maxH; y += gap) {
    for (let x = 0; x < maxW; x += gap) {
      const idx = (y * maxW + x) * 4
      if (img.data[idx] > 128) {
        points.push({ x, y })
      }
    }
  }
  return points
}

export default function Preloader({ onFinish }: { onFinish: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) { onFinish(); return }

    const cw = window.innerWidth
    const ch = window.innerHeight
    canvas.width = cw
    canvas.height = ch

    const targets = getTextPoints(TEXT, cw, ch)
    if (targets.length === 0) { onFinish(); return }

    const particles = targets.map(t => ({
      x: Math.random() * cw,
      y: Math.random() * ch,
      tx: t.x, ty: t.y,
      sz: Math.random() * 2.5 + 1.5,
      bs: Math.random() * 2.5 + 1.5,
      a: 0, sp: 0.02 + Math.random() * 0.02,
      clr: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      ph: Math.random() * Math.PI * 2,
    }))

    const start = Date.now()
    let phase = 0
    const phases = [
      { name: 'float', dur: 2000 },
      { name: 'go', dur: 3500 },
      { name: 'hold', dur: 1200 },
      { name: 'out', dur: 2500 },
    ]
    let raf = 0

    const anim = () => {
      try {
        const now = Date.now()
        const elapsed = now - start

        let acc = 0
        for (let i = 0; i <= phase; i++) acc += phases[i].dur
        if (elapsed > acc && phase < phases.length - 1) phase++

        ctx.clearRect(0, 0, cw, ch)
        const pname = phases[phase].name

        for (const p of particles) {
          if (pname === 'float') {
            p.a = Math.min(p.a + 0.02, 0.5)
            p.x += p.vx; p.y += p.vy
            p.sz = p.bs + Math.sin(p.ph) * 0.5
            p.ph += 0.04
            if (p.x < 0 || p.x > cw) p.vx *= -1
            if (p.y < 0 || p.y > ch) p.vy *= -1
          } else if (pname === 'go') {
            const dx = p.tx - p.x
            const dy = p.ty - p.y
            if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
              p.x += dx * p.sp
              p.y += dy * p.sp
            } else {
              p.x = p.tx; p.y = p.ty
            }
            p.a = Math.min(p.a + 0.04, 1)
            p.sz = p.bs
          } else if (pname === 'hold') {
            p.a = Math.min(p.a + 0.02, 1)
            p.sz = p.bs + Math.sin(p.ph) * 0.3
            p.ph += 0.02
          } else if (pname === 'out') {
            const a = Math.atan2(p.y - ch / 2, p.x - cw / 2)
            p.x += Math.cos(a) * 7
            p.y += Math.sin(a) * 7
            p.a = Math.max(p.a - 0.04, 0)
          }

          ctx.globalAlpha = p.a
          ctx.fillStyle = p.clr
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.globalAlpha = 1

        if (pname === 'out' && !particles.some(p => p.a > 0.01)) {
          onFinish(); return
        }
        if (elapsed > 14000) { onFinish(); return }
      } catch {}

      raf = requestAnimationFrame(anim)
    }

    raf = requestAnimationFrame(anim)
    return () => cancelAnimationFrame(raf)
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0f]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <canvas ref={canvasRef} className="block" style={{ width: '100vw', height: '100vh' }} />

      <motion.p
        className="fixed bottom-12 left-1/2 -translate-x-1/2 text-[#6b6b7b] text-xs tracking-[0.3em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Initializing
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ...
        </motion.span>
      </motion.p>
    </motion.div>
  )
}
