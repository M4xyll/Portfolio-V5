import { ArrowUp, Heart } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative py-12 px-6 bg-[#0a0a0f] border-t border-[rgba(255,255,255,0.04)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold gradient-text">
            M4xyll
          </span>
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#6b6b7b] flex items-center gap-1.5">
          Crafted with <Heart size={14} className="text-[#41ECFF] fill-[#41ECFF]" /> by Maxence DETOURNIERE
        </p>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="group flex items-center gap-2 text-sm text-[#a0a0b0] hover:text-[#41ECFF] transition-colors duration-300"
        >
          Back to top
          <div className="w-8 h-8 rounded-full border border-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:border-[rgba(65,236,255,0.4)] group-hover:bg-[rgba(65,236,255,0.08)] transition-all duration-300">
            <ArrowUp size={14} />
          </div>
        </button>
      </div>
    </footer>
  )
}
