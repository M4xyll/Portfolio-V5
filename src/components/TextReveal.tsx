import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'

interface TextRevealProps {
  children: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  delay?: number
  once?: boolean
  type?: 'words' | 'lines'
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const wordVariants: Variants = {
  hidden: {
    y: '110%',
    opacity: 0,
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.65,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

const lineVariants: Variants = {
  hidden: {
    clipPath: 'inset(0% 100% 0% 0%)',
    opacity: 0,
  },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function TextReveal({
  children,
  className = '',
  as: Tag = 'div',
  delay = 0,
  once = true,
  type = 'words',
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: 0.3 })

  if (type === 'lines') {
    const lines = children.split('\n').filter(Boolean)
    return (
      <Tag className={className} ref={ref as React.Ref<HTMLDivElement>}>
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
          transition={{ delayChildren: delay }}
        >
          {lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <motion.div
                variants={lineVariants}
                transition={{ delay: delay + i * 0.12 }}
              >
                {line}
              </motion.div>
            </div>
          ))}
        </motion.div>
      </Tag>
    )
  }

  const words = children.split(' ')

  return (
    <Tag className={className} ref={ref as React.Ref<HTMLDivElement>}>
      <motion.span
        className="inline-flex flex-wrap"
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        transition={{ delayChildren: delay }}
      >
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block mr-[0.25em] pb-[0.15em]">
            <motion.span
              className="inline-block"
              variants={wordVariants}
              transition={{ delay: delay + i * 0.04 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}
