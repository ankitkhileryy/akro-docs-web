import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { allDocLinks } from '../data/navLinks'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DocsLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const currentIndex = allDocLinks.findIndex((l) => l.href === location.pathname)
  const prev = currentIndex > 0 ? allDocLinks[currentIndex - 1] : null
  const next = currentIndex < allDocLinks.length - 1 ? allDocLinks[currentIndex + 1] : null

  return (
    <div className="min-h-screen flex relative">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — desktop sticky, mobile slide-in */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto
          bg-[#050505] border-r border-[#1a1a1a]
          transition-transform duration-300 ease-in-out
          md:sticky md:top-0 md:h-screen md:translate-x-0 md:shrink-0 md:w-64
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a1a1a] md:hidden">
          <span className="text-sm font-medium text-[#888]">Documentation</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-[#555] hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 pt-6">
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#050505] sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#1a1a1a] text-[#888] hover:text-white hover:border-[#2a2a2a] transition-colors text-sm"
          >
            <Menu size={15} />
            Menu
          </button>
          {/* Breadcrumb */}
          {currentIndex >= 0 && (
            <span className="text-xs text-[#444] truncate">
              {allDocLinks[currentIndex]?.label}
            </span>
          )}
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <Outlet />

          {/* Prev / Next */}
          {(prev || next) && (
            <div className="mt-12 pt-6 border-t border-[#1a1a1a] flex justify-between gap-4">
              {prev ? (
                <Link
                  to={prev.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1a1a1a] hover:border-[#7c6af7]/40 hover:bg-[#080808] transition-colors group max-w-[45%]"
                >
                  <ChevronLeft size={16} className="text-[#444] group-hover:text-[#7c6af7] shrink-0" />
                  <div className="text-right min-w-0">
                    <div className="text-xs text-[#444] mb-0.5">Previous</div>
                    <div className="text-sm font-medium text-[#e8e8f0] truncate">{prev.label}</div>
                  </div>
                </Link>
              ) : <div />}
              {next ? (
                <Link
                  to={next.href}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#1a1a1a] hover:border-[#7c6af7]/40 hover:bg-[#080808] transition-colors group max-w-[45%] ml-auto"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-[#444] mb-0.5">Next</div>
                    <div className="text-sm font-medium text-[#e8e8f0] truncate">{next.label}</div>
                  </div>
                  <ChevronRight size={16} className="text-[#444] group-hover:text-[#7c6af7] shrink-0" />
                </Link>
              ) : <div />}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
