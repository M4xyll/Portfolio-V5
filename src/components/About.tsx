import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Coffee, Code2, Music } from 'lucide-react'
import heroImage from '../assets/hero.png'
import TextScramble from './TextScramble'
import TextReveal from './TextReveal'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'Years Coding', value: '8+' },
    { label: 'Projects Built', value: '15+' },
    { label: 'Coffees Consumed', value: '∞' },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[#41ECFF] text-sm font-medium tracking-[0.2em] uppercase mb-4 block">
            <TextScramble text="About Me" trigger={isVisible} delay={0} />
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#f0f0f5]">
            The person behind <span className="gradient-text-shimmer">the code</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image placeholder with gradient border */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Gradient border */}
              <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-br from-[#41ECFF] to-[#7200FD] opacity-60" />
              
              {/* Inner content */}
              <div className="relative h-full rounded-2xl bg-[#111118] overflow-hidden flex items-center justify-center">
                <img
                  src={heroImage}
                  alt="Maxence DETOURNIERE"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -bottom-4 -right-4 glass px-4 py-2 rounded-full flex items-center gap-2">
                <MapPin size={14} className="text-[#41ECFF]" />
                <span className="text-xs text-[#a0a0b0]">France</span>
              </div>
            </div>
          </motion.div>

          {/* Right: Bio */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="space-y-6 text-[#a0a0b0] leading-relaxed text-lg">
              <TextReveal type="words" delay={0.3}>
                Hey, I'm Maxence — but most people know me as M4xyll. I'm a full stack developer who gets genuinely excited about turning complex problems into elegant, performant solutions.
              </TextReveal>
              <TextReveal type="words" delay={0.5}>
                I started coding because I wanted to build things that matter. Today, I work across the entire stack — from crafting responsive frontends with React to architecting scalable backends and databases. I believe great software sits at the intersection of clean code and thoughtful design.
              </TextReveal>
              <TextReveal type="words" delay={0.7}>
                When I'm not debugging at 2 AM, you'll find me exploring new tech, contributing to open source, or hunting for the perfect cup of coffee.
              </TextReveal>
            </div>

            {/* Quick facts */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                >
                  <div className="font-[family-name:var(--font-heading)] text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#6b6b7b] uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Interests */}
            <motion.div
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {[
                { icon: Code2, label: 'Open Source' },
                { icon: Coffee, label: 'Coffee Addict' },
                { icon: Music, label: 'Lo-Fi Beats' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(65,236,255,0.06)] border border-[rgba(65,236,255,0.1)] text-sm text-[#a0a0b0]"
                >
                  <item.icon size={14} className="text-[#41ECFF]" />
                  {item.label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 line-gradient" />
    </section>
  )
}
