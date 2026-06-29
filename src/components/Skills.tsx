import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Counter from './Counter'
import TextScramble from './TextScramble'
import TextReveal from './TextReveal'
import SpotlightCard from './SpotlightCard'

const skillCategories = [
  {
    title: 'Frontend',
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Framer Motion', level: 80 },
    ],
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'Python', level: 85 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'GraphQL', level: 75 },
    ],
  },
  {
    title: 'DevOps & Tools',
    skills: [
      { name: 'Docker', level: 78 },
      { name: 'Git / GitHub', level: 92 },
      { name: 'Linux', level: 85 },
      { name: 'Figma', level: 35 },
    ],
  },
]

const tools = [
  'VS Code', 'AWS', 'Postman', 'Vercel', 'Supabase',
  'Prisma', 'Redux', 'Vite', 'Firebase', 'GitHub Actions',
]

export default function Skills() {
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
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative py-32 px-6 bg-[#0d0d14]"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TextScramble
            text="Skills"
            trigger={isVisible}
            className="text-[#41ECFF] text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
          />
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#f0f0f5] mb-6">
            Tech I <span className="gradient-text-shimmer">work with</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <TextReveal className="text-[#a0a0b0]" type="words" delay={0.1}>
              My stack is constantly evolving. Here are the technologies I've been deep into lately.
            </TextReveal>
          </div>
        </motion.div>

        {/* Skill categories */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: catIndex * 0.15 }}
            >
              <SpotlightCard className="rounded-2xl p-8">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f0f0f5] mb-6">
                {category.title}
              </h3>
              <div className="space-y-5">
                {category.skills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#a0a0b0]">{skill.name}</span>
                      <span className="text-sm text-[#41ECFF] font-medium">
                        <Counter target={skill.level} trigger={isVisible} duration={1500} suffix="%" />
                      </span>
                    </div>
                    <div className="h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#41ECFF] to-[#7200FD] transition-all duration-1000 ease-out"
                        style={{
                          width: isVisible ? `${skill.level}%` : '0%',
                          transitionDelay: `${400 + catIndex * 150}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Tools cloud */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          <h3 className="font-[family-name:var(--font-heading)] text-lg font-medium text-[#f0f0f5] mb-6">
            Also using
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tools.map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 rounded-full bg-[rgba(65,236,255,0.05)] border border-[rgba(65,236,255,0.1)] text-sm text-[#a0a0b0] hover:text-[#41ECFF] hover:border-[rgba(65,236,255,0.3)] transition-all duration-300 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 line-gradient" />
    </section>
  )
}
