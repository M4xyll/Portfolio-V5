import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import TextScramble from './TextScramble'
import TextReveal from './TextReveal'

const experiences = [
  {
    type: 'work',
    title: 'Founder',
    company: 'Atacq',
    period: '2026 — Present',
    description: 'Founder of Atacq, a security audit tool that automatically monitors and scans servers for vulnerabilities and misconfigurations. Provides detailed reports and recommendations to improve server security.',
    skills: ['React', 'Next.js', 'TypeScript', 'PostgreSQL'],
  },
  {
    type: 'work',
    title: 'Founder',
    company: 'Nicolas4Tech',
    period: '2025 - Present',
    description: 'Founder of Nicolas4Tech, a hosting company focused on providing affordable and accessible web hosting solutions. Built the platform to learn more about web hosting, server management, and cloud computing.',
    skills: ['JavaScript', 'React', 'CSS', 'REST APIs'],
  },
  {
    type: 'work',
    title: 'Full Stack Developer',
    company: 'M4xyll',
    period: '2021 — Present',
    description: 'Built custom web applications for clients across fintech and e-commerce. Implemented CI/CD pipelines and mentored junior developers.',
    skills: ['Node.js', 'Vue.js', 'MongoDB', 'Docker'],
  },

  {
    type: 'education',
    title: 'Software Engineering Degree',
    company: 'ESIEA',
    period: '2025 - 2030',
    description: 'Specialized in software engineering and distributed systems.',
    skills: ['Algorithms', 'System Design', 'Cloud Computing'],
  },
  {
    type: 'education',
    title: 'High School',
    company: 'French International School of Bangkok',
    period: '2015 - 2025',
    description: 'Foundation in programming, databases, and software development lifecycle.',
    skills: ['HTML', 'CSS', 'JS', 'PHP', "NodeJS"],
  },
]

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [svgPath, setSvgPath] = useState('')
  const [pathLength, setPathLength] = useState(0)
  const [drawn, setDrawn] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Calculate SVG path for the timeline
  const calculatePath = () => {
    if (!timelineRef.current) return ''
    const items = timelineRef.current.querySelectorAll('.timeline-item')
    if (items.length === 0) return ''

    const containerRect = timelineRef.current.getBoundingClientRect()
    const isDesktop = window.innerWidth >= 768
    const centerX = isDesktop ? containerRect.width / 2 : 24

    let path = ''

    items.forEach((item, i) => {
      const dot = item.querySelector('.timeline-dot') as HTMLElement
      if (!dot) return
      const dotRect = dot.getBoundingClientRect()
      const y = dotRect.top - containerRect.top + dotRect.height / 2

      if (i === 0) {
        path = `M ${centerX} ${y - 40}`
      } else if (i > 0) {
        const prevItem = items[i - 1]
        const prevDot = prevItem.querySelector('.timeline-dot') as HTMLElement
        if (prevDot) {
          const prevRect = prevDot.getBoundingClientRect()
          const prevY = prevRect.top - containerRect.top + prevRect.height / 2
          const midY = (prevY + y) / 2
          path += ` C ${centerX} ${midY}, ${centerX} ${midY}, ${centerX} ${y}`
        }
      }
    })

    return path
  }

  // Measure path and trigger draw animation
  useEffect(() => {
    const update = () => {
      const path = calculatePath()
      setSvgPath(path)

      // Need a frame for the path to render before measuring
      requestAnimationFrame(() => {
        if (pathRef.current) {
          const len = pathRef.current.getTotalLength()
          setPathLength(len)
          setReady(true)
          // Trigger the draw on next frame so React has applied the length
          requestAnimationFrame(() => setDrawn(true))
        }
      })
    }

    update()
    window.addEventListener('resize', update)
    const timeout = setTimeout(update, 200)

    return () => {
      window.removeEventListener('resize', update)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-32 px-6 bg-[#0d0d14]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TextScramble
            text="Experience"
            trigger={isVisible}
            className="text-[#41ECFF] text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
          />
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#f0f0f5] mb-6">
            Where I've <span className="gradient-text-shimmer">worked</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <TextReveal className="text-[#a0a0b0]" type="words" delay={0.1}>
              My journey so far — from writing my first line of code to leading technical projects.
            </TextReveal>
          </div>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* SVG animated path */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#41ECFF" />
                <stop offset="100%" stopColor="#7200FD" />
              </linearGradient>
            </defs>
            {/* Background path (dim) */}
            <path
              d={svgPath}
              fill="none"
              stroke="rgba(65, 236, 255, 0.06)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Animated foreground path */}
            <path
              ref={pathRef}
              d={svgPath}
              fill="none"
              stroke="url(#timelineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={pathLength || 1}
              strokeDashoffset={drawn ? 0 : pathLength || 1}
              style={{
                opacity: ready ? 1 : 0,
                filter: 'drop-shadow(0 0 6px rgba(65, 236, 255, 0.4))',
                transition: 'stroke-dashoffset 2.2s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.1s ease',
              }}
            />

          </svg>

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.title}
              className="timeline-item relative flex items-start gap-6 mb-12 last:mb-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.12 }}
            >
              {/* Timeline dot */}
              <div className="timeline-dot relative z-10 flex-shrink-0">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    exp.type === 'work'
                      ? 'border-[#41ECFF] bg-[rgba(65,236,255,0.1)]'
                      : 'border-[#7200FD] bg-[rgba(114,0,253,0.1)]'
                  }`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  {exp.type === 'work' ? (
                    <Briefcase size={18} className="text-[#41ECFF]" />
                  ) : (
                    <GraduationCap size={18} className="text-[#7200FD]" />
                  )}
                </motion.div>
              </div>

              {/* Content card */}
              <motion.div
                className={`flex-1 glass rounded-xl p-6 md:p-8 ${
                  index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'
                } md:w-[calc(50%-2rem)]`}
                initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                    exp.type === 'work'
                      ? 'bg-[rgba(65,236,255,0.1)] text-[#41ECFF]'
                      : 'bg-[rgba(114,0,253,0.1)] text-[#7200FD]'
                  }`}>
                    {exp.type === 'work' ? 'Work' : 'Education'}
                  </span>
                  <span className="text-xs text-[#6b6b7b]">{exp.period}</span>
                </div>

                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-[#f0f0f5] mb-1">
                  {exp.title}
                </h3>
                <p className="text-[#41ECFF] text-sm font-medium mb-3">
                  {exp.company}
                </p>
                <p className="text-[#a0a0b0] text-sm leading-relaxed mb-4">
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-md bg-[rgba(255,255,255,0.04)] text-[#6b6b7b] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(65,236,255,0.2)] hover:text-[#a0a0b0] transition-all duration-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 line-gradient" />
    </section>
  )
}
