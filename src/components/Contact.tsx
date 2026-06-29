import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react'
import TextScramble from './TextScramble'
import TextReveal from './TextReveal'
import MagneticButton from './MagneticButton'
import TransmittingPulse from './TransmittingPulse'

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/M4xyll',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/maxence-detourniere',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/maxence_detourniere',
    svg: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
]

type SubmitState = 'idle' | 'sending' | 'success' | 'error'

const WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitState, setSubmitState] = useState<SubmitState>('idle')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!WEBHOOK_URL) {
      setSubmitState('error')
      return
    }

    setSubmitState('sending')

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = (await response.json()) as { transmitted?: string }

      if (data.transmitted === 'yes') {
        setSubmitState('success')
        setFormState({ name: '', email: '', message: '' })
      } else {
        throw new Error('Message was not transmitted. Please try again.')
      }
    } catch {
      setSubmitState('error')
    }

    setTimeout(() => {
      setSubmitState('idle')
    }, 4000)
  }

  const isDisabled = submitState === 'sending' || submitState === 'success'

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 px-6"
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
            text="Contact"
            trigger={isVisible}
            className="text-[#41ECFF] text-sm font-medium tracking-[0.2em] uppercase mb-4 block"
          />
          <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold text-[#f0f0f5] mb-6">
            Let's work <span className="gradient-text-shimmer">together</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <TextReveal className="text-[#a0a0b0]" type="words" delay={0.1}>
              Have a project in mind or just want to chat? I'm always open to new opportunities and interesting conversations.
            </TextReveal>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <div className="mb-10">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f0f0f5] mb-4">
                Email me
              </h3>
              <a
                href="mailto:m4xyll.dev@proton.me"
                className="group flex items-center gap-3 text-[#a0a0b0] hover:text-[#41ECFF] transition-colors duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(65,236,255,0.08)] flex items-center justify-center group-hover:bg-[rgba(65,236,255,0.15)] transition-colors duration-300">
                  <Mail size={18} className="text-[#41ECFF]" />
                </div>
                <span className="text-lg">m4xyll.dev@proton.me</span>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>

            <div className="mb-10">
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[#f0f0f5] mb-4">
                Socials
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-12 h-12 rounded-xl glass flex items-center justify-center hover:border-[rgba(65,236,255,0.3)] transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <div className="text-[#a0a0b0] group-hover:text-[#41ECFF] transition-colors duration-300">
                      {social.svg}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-6 border-l-2 border-[#41ECFF]">
              <p className="text-[#a0a0b0] text-sm leading-relaxed italic">
                "I'm currently open to freelance projects and full-time opportunities. If you think I'd be a good fit for your team, don't hesitate to reach out."
              </p>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#a0a0b0] mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    required
                    disabled={isDisabled}
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#f0f0f5] placeholder-[#6b6b7b] focus:outline-none focus:border-[rgba(65,236,255,0.4)] focus:ring-1 focus:ring-[rgba(65,236,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#a0a0b0] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    required
                    disabled={isDisabled}
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#f0f0f5] placeholder-[#6b6b7b] focus:outline-none focus:border-[rgba(65,236,255,0.4)] focus:ring-1 focus:ring-[rgba(65,236,255,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#a0a0b0] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    required
                    disabled={isDisabled}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] text-[#f0f0f5] placeholder-[#6b6b7b] focus:outline-none focus:border-[rgba(65,236,255,0.4)] focus:ring-1 focus:ring-[rgba(65,236,255,0.2)] transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <MagneticButton
                  type="submit"
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${
                    submitState === 'success'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : submitState === 'error'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-gradient-to-r from-[#41ECFF] to-[#7200FD] text-[#0a0a0f] hover:shadow-[0_0_30px_rgba(65,236,255,0.25)]'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {submitState === 'sending' && (
                      <motion.div
                        key="sending"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-3"
                      >
                        <TransmittingPulse />
                        <span className="text-[#7200FD] font-medium">Transmitting...</span>
                      </motion.div>
                    )}
                    {submitState === 'success' && (
                      <motion.span
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Transmitted!
                      </motion.span>
                    )}
                    {submitState === 'idle' && (
                      <motion.span
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Send size={16} />
                        Send Message
                      </motion.span>
                    )}
                    {submitState === 'error' && (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <AlertCircle size={16} />
                        Retry
                      </motion.span>
                    )}
                  </AnimatePresence>
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 line-gradient" />
    </section>
  )
}
