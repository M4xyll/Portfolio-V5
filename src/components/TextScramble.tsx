import { useEffect, useRef, useState } from 'react'

const CHARS = '!<>-_\\/[]{}—=+*^?#________'

interface TextScrambleProps {
  text: string
  trigger: boolean
  className?: string
  delay?: number
}

export default function TextScramble({ text, trigger, className = '', delay = 0 }: TextScrambleProps) {
  const [display, setDisplay] = useState(text)
  const hasRun = useRef(false)
  const frameRef = useRef(0)
  const queueRef = useRef<Array<{ from: string; to: string; start: number; end: number; char?: string }>>([])

  useEffect(() => {
    if (!trigger || hasRun.current) return

    const timeout = setTimeout(() => {
      hasRun.current = true
      const length = text.length
      const queue: Array<{ from: string; to: string; start: number; end: number; char?: string }> = []

      for (let i = 0; i < length; i++) {
        queue.push({
          from: text[i],
          to: text[i],
          start: Math.floor(Math.random() * 20),
          end: Math.floor(Math.random() * 20) + 20,
        })
      }
      queueRef.current = queue

      let frame = 0
      const totalFrames = 40

      const update = () => {
        let output = ''
        let complete = 0

        for (let i = 0; i < queue.length; i++) {
          const { from, to, start, end } = queue[i]
          let char = queue[i].char

          if (frame >= end) {
            complete++
            output += to
          } else if (frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = CHARS[Math.floor(Math.random() * CHARS.length)]
              queue[i].char = char
            }
            output += `<span class="text-[#41ECFF]">${char}</span>`
          } else {
            output += from
          }
        }

        setDisplay(output)
        frame++
        frameRef.current = frame

        if (complete < queue.length && frame < totalFrames + 20) {
          requestAnimationFrame(update)
        } else {
          setDisplay(text)
        }
      }

      requestAnimationFrame(update)
    }, delay)

    return () => clearTimeout(timeout)
  }, [trigger, text, delay])

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: display }}
    />
  )
}
