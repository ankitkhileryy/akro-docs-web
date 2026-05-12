import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-[#e8e8f0] mb-3">
              <Zap size={20} className="text-[#7c6af7]" fill="#7c6af7" />
              <span>Akro</span>
            </Link>
            <p className="text-sm text-[#444] leading-relaxed">Fast. Simple. Web-Ready.</p>
          </div>

          {[
            { title: 'Learn', links: [
              { to: '/docs/introduction', label: 'Introduction' },
              { to: '/docs/installation', label: 'Installation' },
              { to: '/docs/quick-start',  label: 'Quick Start' },
              { to: '/examples',          label: 'Examples' },
            ]},
            { title: 'Tools', links: [
              { to: '/docs/cli',    label: 'CLI Reference' },
              { to: '/playground',  label: 'Playground' },
              { to: '/docs/stdlib', label: 'Standard Library' },
            ]},
            { title: 'Community', links: [
              { to: 'https://github.com', label: 'GitHub', external: true },
              { to: '/about',             label: 'About' },
            ]},
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-[#e8e8f0] mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l.label}>
                    {(l as { external?: boolean }).external ? (
                      <a href={l.to} target="_blank" rel="noopener noreferrer"
                        className="text-sm text-[#444] hover:text-[#7c6af7] transition-colors">{l.label}</a>
                    ) : (
                      <Link to={l.to} className="text-sm text-[#444] hover:text-[#7c6af7] transition-colors">{l.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#333]">© 2026 ST — Creator of Akro | MIT License</p>
          <p className="text-xs text-[#333]">Built with ⚡ Akro</p>
        </div>
      </div>
    </footer>
  )
}
