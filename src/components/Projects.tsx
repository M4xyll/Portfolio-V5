import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Code2, ArrowUpRight } from 'lucide-react'
import TextScramble from './TextScramble'
import TextReveal from './TextReveal'
import SpotlightCard from './SpotlightCard'

const projects = [
  {
    title: 'Nicolas4Tech',
    description: 'My very own Hosting Company with only one objective: Make hosting affordable and accessible to everyone. I built this project to learn more about web hosting, server management, and cloud computing.',
    tags: ['React', 'TypeScript', 'Linux', 'Node.js'],
    liveUrl: 'https://nicolas4tech.fr',
    githubUrl: null,
    color: '#41ECFF',
  },
  {
    title: 'Photon Panel',
    description: 'A french hosting control panel for managing web hosting, game hosting, as well as VPS Hosting via Proxmox. It features a modern UI, real-time server monitoring, and a powerful API for developers.',
    tags: ['Next.js', 'Go', 'PostgreSQL', 'Figma'],
    liveUrl: null,
    githubUrl: 'https://github.com/PhotonProjects',
    color: '#7200FD',
  },
  {
    title: 'Atacq',
    description: 'A security audit tool that automatically monitors and scans your servers for vulnerabilities and misconfigurations. It provides detailed reports and recommendations to improve your server security.',
    tags: ['TypeScript', 'GraphQL', 'AI', 'Docker'],
    liveUrl: 'https://atacq.fr',
    githubUrl: null,
    color: '#7200FD',
  },
]

export default function Projects() {
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
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="projects"
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
          <TextScramble
            text="Projects"
            trigger={isVisible}
            className="text-[#41ECFF] text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
          />
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#f0f0f5] mb-6">
            Things I've <span className="gradient-text-shimmer">built</span>
          </h2>
          <div className="max-w-2xl">
            <TextReveal className="text-[#a0a0b0]" type="words" delay={0.1}>
              A selection of projects that showcase my skills and passion for building great software.
            </TextReveal>
          </div>
        </motion.div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
            >
              <SpotlightCard className="group relative rounded-2xl p-6">
              {/* Top accent line */}
              <div
                className="absolute -top-6 -inset-x-6 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: project.color }}
              />

              {/* Content */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f0f0f5] group-hover:text-[#41ECFF] transition-colors duration-300">
                    {project.title}
                  </h3>
                  <ArrowUpRight
                    size={20}
                    className="text-[#6b6b7b] group-hover:text-[#41ECFF] transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <p className="text-[#a0a0b0] text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-[rgba(65,236,255,0.06)] text-[#a0a0b0] border border-[rgba(65,236,255,0.08)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-4 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#41ECFF] transition-colors duration-300"
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-[#6b6b7b] cursor-not-allowed">
                    <ExternalLink size={14} />
                    Live Demo
                  </span>
                )}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#41ECFF] transition-colors duration-300"
                  >
                    <Code2 size={14} />
                    Source
                  </a>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-[#6b6b7b] cursor-not-allowed">
                    <Code2 size={14} />
                    Source
                  </span>
                )}
              </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 line-gradient" />
    </section>
  )
}
