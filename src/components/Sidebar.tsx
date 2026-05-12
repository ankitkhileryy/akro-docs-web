import { NavLink } from 'react-router-dom'
import { sidebarSections } from '../data/navLinks'
import { ChevronRight } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  return (
    <nav className="w-full">
      {sidebarSections.map((section) => (
        <div key={section.title} className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2 px-3"
            style={{ color: 'var(--text4)' }}>
            {section.title}
          </h3>
          <ul className="space-y-0.5">
            {section.links.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                      isActive
                        ? 'text-[#7c6af7] font-medium'
                        : ''
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(124,106,247,0.1)' : 'transparent',
                    color: isActive ? '#7c6af7' : 'var(--text3)',
                    borderLeft: isActive ? '2px solid #7c6af7' : '2px solid transparent',
                  })}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && <ChevronRight size={12} className="shrink-0" />}
                      <span>{link.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
