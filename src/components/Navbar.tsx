import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Github, Menu, X, BookOpen, Code2, Info, Play } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
      isActive
        ? 'text-white bg-[#ffffff12]'
        : 'text-[#777] hover:text-white hover:bg-[#ffffff08]'
    }`

  return (
    <div className="sticky top-0 z-50 px-4 pt-4 pb-2 bg-black">
      <header className="max-w-6xl mx-auto rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] shadow-xl shadow-black/80">
        <div className="px-5 sm:px-6">
          <div className="flex items-center justify-between h-14">

            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity shrink-0">
              <img src="/akro-logo.svg" alt="Akro" className="h-8 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-0.5">
              <NavLink to="/docs/introduction" className={linkClass}>
                <BookOpen size={13} /> Docs
              </NavLink>
              <NavLink to="/examples" className={linkClass}>
                <Code2 size={13} /> Examples
              </NavLink>
              <NavLink to="/playground" className={linkClass}>
                <Play size={13} /> Playground
              </NavLink>
              <NavLink to="/about" className={linkClass}>
                <Info size={13} /> About
              </NavLink>
            </nav>

            <div className="hidden md:flex items-center gap-2 shrink-0">
              <span className="text-xs px-2.5 py-1 rounded-full border border-[#7c6af7]/30 bg-[#7c6af7]/8 text-[#7c6af7] font-mono font-medium">
                v0.1.0-beta
              </span>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="p-2 rounded-lg text-[#555] hover:text-white hover:bg-[#ffffff08] transition-colors">
                <Github size={16} />
              </a>
            </div>

            <button className="md:hidden p-2 rounded-lg text-[#555] hover:text-white hover:bg-[#ffffff08] transition-colors"
              onClick={() => setOpen(!open)}>
              {open ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="md:hidden max-w-6xl mx-auto mt-1.5 rounded-2xl border border-[#2a2a2a] bg-[#0a0a0a] shadow-xl shadow-black/80 overflow-hidden">
          <div className="p-2 space-y-0.5">
            <NavLink to="/docs/introduction" className={linkClass} onClick={() => setOpen(false)}>
              <BookOpen size={13} /> Docs
            </NavLink>
            <NavLink to="/examples" className={linkClass} onClick={() => setOpen(false)}>
              <Code2 size={13} /> Examples
            </NavLink>
            <NavLink to="/playground" className={linkClass} onClick={() => setOpen(false)}>
              <Play size={13} /> Playground
            </NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>
              <Info size={13} /> About
            </NavLink>
          </div>
          <div className="px-4 py-3 border-t border-[#1a1a1a] flex items-center justify-between">
            <span className="text-xs px-2.5 py-1 rounded-full border border-[#7c6af7]/30 bg-[#7c6af7]/8 text-[#7c6af7] font-mono">
              v0.1.0-beta
            </span>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#555] hover:text-white transition-colors">
              <Github size={14} /> GitHub
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
