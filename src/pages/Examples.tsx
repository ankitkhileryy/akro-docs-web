import { useState } from 'react'
import { examples } from '../data/examples'
import CodeBlock from '../components/CodeBlock'

const categories = ['All', 'Basics', 'Algorithms', 'Data Structures', 'OOP', 'Control Flow', 'Advanced', 'Games']

const categoryColors: Record<string, string> = {
  Basics: 'bg-[#7c6af7]/10 text-[#7c6af7] border-[#7c6af7]/20',
  Algorithms: 'bg-[#4fc3f7]/10 text-[#4fc3f7] border-[#4fc3f7]/20',
  'Data Structures': 'bg-[#c3e88d]/10 text-[#c3e88d] border-[#c3e88d]/20',
  OOP: 'bg-[#ffcb6b]/10 text-[#ffcb6b] border-[#ffcb6b]/20',
  'Control Flow': 'bg-[#f78c6c]/10 text-[#f78c6c] border-[#f78c6c]/20',
  Advanced: 'bg-[#c792ea]/10 text-[#c792ea] border-[#c792ea]/20',
  Games: 'bg-[#89ddff]/10 text-[#89ddff] border-[#89ddff]/20',
}

export default function Examples() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = activeCategory === 'All'
    ? examples
    : examples.filter((e) => e.category === activeCategory)

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-[#e8e8f0] mb-3">Examples</h1>
          <p className="text-[#666] text-lg max-w-2xl">
            Explore real Akro code. From hello world to advanced patterns — learn by example.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-[#7c6af7] border-[#7c6af7] text-white'
                  : 'border-[#2a2a3a] text-[#888] hover:border-[#7c6af7]/40 hover:text-[#e8e8f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ex) => (
            <div
              key={ex.id}
              className="rounded-xl border border-[#1a1a1a] bg-[#050505] overflow-hidden hover:border-[#7c6af7]/30 transition-colors flex flex-col"
            >
              {/* Card header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-[#e8e8f0]">{ex.title}</h3>
                  <span
                    className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium ${
                      categoryColors[ex.category] || 'bg-[#2a2a3a] text-[#888] border-[#3a3a4a]'
                    }`}
                  >
                    {ex.category}
                  </span>
                </div>
                <p className="text-sm text-[#666]">{ex.description}</p>
              </div>

              {/* Code preview */}
              <div className="px-5 pb-3 flex-1">
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    expanded === ex.id ? 'max-h-[600px]' : 'max-h-40'
                  }`}
                >
                  <CodeBlock code={ex.code} language="javascript" />
                </div>
              </div>

              {/* Toggle */}
              <div className="px-5 pb-4">
                <button
                  onClick={() => setExpanded(expanded === ex.id ? null : ex.id)}
                  className="text-xs text-[#7c6af7] hover:text-[#4fc3f7] transition-colors font-medium"
                >
                  {expanded === ex.id ? '▲ Show less' : '▼ Show full code'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
