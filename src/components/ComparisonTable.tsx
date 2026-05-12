import { useEffect, useRef, useState } from 'react'
import { Check, X, Zap } from 'lucide-react'

const comparison = [
  { feature: 'Simple Syntax',      akro: true,  python: true,  js: false, go: false },
  { feature: 'Fast Compilation',   akro: true,  python: false, js: false, go: true  },
  { feature: 'Web Native',         akro: true,  python: false, js: true,  go: false },
  { feature: 'Type Inference',     akro: true,  python: false, js: false, go: true  },
  { feature: 'Built-in Formatter', akro: true,  python: false, js: false, go: true  },
  { feature: 'Pattern Matching',   akro: true,  python: true,  js: false, go: false },
  { feature: 'Async/Await',        akro: true,  python: true,  js: true,  go: false },
  { feature: 'Zero Config',        akro: true,  python: false, js: false, go: true  },
]

const langs = [
  { key: 'akro',   label: 'Akro',   color: '#7c6af7', accent: true  },
  { key: 'python', label: 'Python', color: '#4fc3f7', accent: false },
  { key: 'js',     label: 'JS',     color: '#ffcb6b', accent: false },
  { key: 'go',     label: 'Go',     color: '#c3e88d', accent: false },
]

export default function ComparisonTable() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [animatedRows, setAnimatedRows] = useState<number[]>([])

  // Trigger when section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Stagger rows one by one
  useEffect(() => {
    if (!visible) return
    comparison.forEach((_, i) => {
      setTimeout(() => setAnimatedRows(prev => [...prev, i]), i * 80)
    })
  }, [visible])

  // Score per language (count of trues)
  const scores = langs.map(l => ({
    ...l,
    score: comparison.filter(r => r[l.key as keyof typeof r]).length,
    total: comparison.length,
  }))

  return (
    <div ref={ref} className="w-full">

      {/* ── Score bars ── */}
      <div className="grid grid-cols-4 gap-3 mb-10">
        {scores.map((l, li) => {
          const pct = visible ? Math.round((l.score / l.total) * 100) : 0
          return (
            <div key={l.key} className={`p-4 rounded-xl border ${l.accent ? 'border-[#7c6af7]/30 bg-[#7c6af7]/5' : 'border-[#111] bg-[#030303]'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-mono font-semibold ${l.accent ? 'text-[#7c6af7]' : 'text-[#555]'}`}>
                  {l.accent && <Zap size={10} className="inline mr-1" fill="#7c6af7" />}
                  {l.label}
                </span>
                <span className="text-xs font-mono text-[#333]">{l.score}/{l.total}</span>
              </div>
              <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: l.color, transitionDelay: `${li * 100}ms` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Rows ── */}
      <div className="space-y-1">
        {comparison.map((row, i) => {
          const isAnimated = animatedRows.includes(i)
          return (
            <div key={row.feature}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                isAnimated ? 'opacity-100 translate-y-0 border-[#111] bg-[#030303]' : 'opacity-0 translate-y-3 border-transparent bg-transparent'
              }`}
              style={{ transitionDelay: `${i * 60}ms` }}>
              {/* Feature name */}
              <span className="flex-1 text-sm font-mono text-[#555] min-w-0 truncate">
                {row.feature}
              </span>

              {/* Lang columns */}
              {langs.map(l => {
                const val = row[l.key as keyof typeof row] as boolean
                return (
                  <div
                    key={l.key}
                    className={`w-16 flex items-center justify-center shrink-0`}
                  >
                    {val ? (
                      <div
                        className="flex items-center justify-center w-6 h-6 rounded-full"
                        style={{ background: `${l.color}15`, border: `1px solid ${l.color}30` }}
                      >
                        <Check size={11} style={{ color: l.color }} strokeWidth={2.5} />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0a0a0a] border border-[#1a1a1a]">
                        <X size={10} className="text-[#222]" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* ── Column headers (bottom) ── */}
      <div className="flex items-center gap-3 px-4 mt-3">
        <span className="flex-1" />
        {langs.map(l => (
          <div key={l.key} className="w-16 text-center">
            <span className={`text-xs font-mono ${l.accent ? 'text-[#7c6af7]' : 'text-[#333]'}`}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
