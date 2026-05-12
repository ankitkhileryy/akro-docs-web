export interface NavLink {
  label: string
  href: string
}

export interface SidebarSection {
  title: string
  links: { label: string; href: string }[]
}

export const sidebarSections: SidebarSection[] = [
  {
    title: 'Getting Started',
    links: [
      { label: 'Introduction', href: '/docs/introduction' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Quick Start', href: '/docs/quick-start' },
    ],
  },
  {
    title: 'Language Guide',
    links: [
      { label: 'Variables', href: '/docs/variables' },
      { label: 'Functions', href: '/docs/functions' },
      { label: 'Control Flow', href: '/docs/control-flow' },
      { label: 'Loops', href: '/docs/loops' },
      { label: 'Arrays', href: '/docs/arrays' },
      { label: 'Maps', href: '/docs/maps' },
      { label: 'Structs', href: '/docs/structs' },
      { label: 'Enums', href: '/docs/enums' },
      { label: 'Pattern Matching', href: '/docs/pattern-matching' },
      { label: 'Error Handling', href: '/docs/error-handling' },
      { label: 'Async/Await', href: '/docs/async-await' },
      { label: 'Imports', href: '/docs/imports' },
    ],
  },
  {
    title: 'Web Development',
    links: [
      { label: 'Web Overview', href: '/docs/web' },
      { label: 'DOM', href: '/docs/web#dom' },
      { label: 'Fetch API', href: '/docs/web#fetch' },
      { label: 'Example App', href: '/docs/web#example' },
    ],
  },
  {
    title: 'Standard Library',
    links: [
      { label: 'Built-ins', href: '/docs/stdlib' },
      { label: 'Math', href: '/docs/stdlib#math' },
      { label: 'String', href: '/docs/stdlib#string' },
      { label: 'Array', href: '/docs/stdlib#array' },
      { label: 'IO', href: '/docs/stdlib#io' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { label: 'CLI Reference', href: '/docs/cli' },
      { label: 'REPL', href: '/docs/cli#repl' },
      { label: 'Transpiler', href: '/docs/cli#transpiler' },
    ],
  },
]

// Flat list for prev/next navigation
export const allDocLinks = sidebarSections.flatMap((s) =>
  s.links.filter((l) => !l.href.includes('#'))
)
