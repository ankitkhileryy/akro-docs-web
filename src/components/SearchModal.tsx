import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, FileText, ArrowRight } from 'lucide-react'
import { sidebarSections } from '../data/navLinks'

interface SearchItem {
  label: string
  href: string
  section: string
}

const allItems: SearchItem[] = sidebarSections.flatMap(s =>
  s.links.map(l => ({ label: l.label, href: l.href, section: s.title }))
)

interface Props {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const results = query.trim()
    ? allItems.filter(i =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.section.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 8)

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        open ? onClose() : null
      }
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setSelected(s => Math.min(s + 1, results.length - 1))
      if (e.key === 'ArrowUp') setSelected(s => Math.max(s - 1, 0))
      if (e.key === 'Enter' && results[selected]) {
        navigate(results[selected].href)
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, results, selected, navigate, onClose])

  useEffect(() => { setSelected(0) }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-[#0a0a0a] border border-[#2a2a2a] rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a]">
          <Search size={16} className="text-[#555] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search docs..."
            className="flex-1 bg-transparent text-[#e8e8f0] placeholder-[#444] outline-none text-sm"
          />
          <button onClick={onClose} className="text-[#444] hover:text-[#888] transition-colors">
            <X size={15} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[#444]">No results for "{query}"</div>
          ) : (
            results.map((item, i) => (
              <button
                key={item.href}
                onClick={() => { navigate(item.href); onClose() }}
                onMouseEnter={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  i === selected ? 'bg-[#7c6af7]/10' : 'hover:bg-[#ffffff05]'
                }`}
              >
                <FileText size={14} className="text-[#555] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-[#e8e8f0] truncate">{item.label}</div>
                  <div className="text-xs text-[#444]">{item.section}</div>
                </div>
                {i === selected && <ArrowRight size={13} className="text-[#7c6af7] shrink-0" />}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#1a1a1a] flex items-center gap-4 text-xs text-[#333]">
          <span><kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#555]">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#555]">↵</kbd> open</span>
          <span><kbd className="px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[#555]">esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
