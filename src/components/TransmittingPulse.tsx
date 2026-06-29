import { motion } from 'framer-motion'

export default function TransmittingPulse() {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#7200FD]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          boxShadow: '0 0 8px rgba(114, 0, 253, 0.6)',
        }}
      />

      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-[#7200FD]"
          initial={{ width: 8, height: 8, opacity: 0.5 }}
          animate={{
            width: [8, 28, 28],
            height: [8, 28, 28],
            opacity: [0.5, 0.1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}
