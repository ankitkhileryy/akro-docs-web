import { Github, Zap, Code2, Globe, Cpu, ArrowRight, Star, Calendar, Tag, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

const stats = [
  { icon: Code2,    value: '40+',         label: 'Built-in Functions' },
  { icon: Star,     value: '10+',         label: 'Examples'           },
  { icon: FileText, value: 'MIT',         label: 'License'            },
  { icon: Calendar, value: '2026',        label: 'Year'               },
  { icon: Tag,      value: 'v0.1.0-beta', label: 'Version'            },
]

export default function About() {
  return (
    <div className="bg-black min-h-screen">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#1a1a1a] grid-bg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#7c6af7]/6 rounded-full blur-[100px] pointer-events-none z-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c6af7]/25 bg-[#7c6af7]/8 text-[#7c6af7] text-xs font-medium mb-6">
            <Zap size={10} fill="#7c6af7" />
            Open Source · MIT License
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-white mb-5 tracking-tight">
            About Akro
          </h1>
          <p className="text-lg text-[#555] max-w-xl mx-auto leading-relaxed">
            A modern programming language built for simplicity, speed, and the web.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#1a1a1a] bg-[#030303]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap justify-center gap-8">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-1.5">
                    <Icon size={13} className="text-[#7c6af7]" />
                    <span className="text-xl font-bold text-white tracking-tight font-mono">{s.value}</span>
                  </div>
                  <span className="text-xs text-[#444]">{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">

        {/* Creator card */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c6af7] to-[#4fc3f7] flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
                  <img
                    src="https://avatars.githubusercontent.com/u/ankitkhileryy"
                    alt="ankitkhileryy"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span className="absolute">AK</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7c6af7] border-2 border-black flex items-center justify-center">
                  <Zap size={9} fill="white" className="text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">Ankit Bishnoi</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#7c6af7]/12 border border-[#7c6af7]/25 text-[#7c6af7] font-medium">
                    Creator
                  </span>
                </div>
                <p className="text-sm text-[#7c6af7] font-medium mb-1">
                  Creator & Developer of Akro Programming Language
                </p>
                <p className="text-xs text-[#444] mb-1 font-mono">@ankitkhileryy · Age 19 · India</p>
                <div className="flex gap-3">
                  <a
                    href="https://github.com/ankitkhileryy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#444] hover:text-white border border-[#1a1a1a] hover:border-[#2a2a2a] px-3 py-1.5 rounded-lg transition-colors bg-[#0a0a0a]"
                  >
                    <Github size={13} /> GitHub
                  </a>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
              <blockquote className="text-base text-[#666] leading-relaxed italic border-l-2 border-[#7c6af7]/40 pl-4">
                "I built Akro because I wanted a language that was simple enough for beginners,
                fast enough for production, and web-ready out of the box."
              </blockquote>
            </div>
          </div>
        </div>

        {/* Story + Philosophy */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-6">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#7c6af7]/15 border border-[#7c6af7]/25 flex items-center justify-center">
                <Zap size={12} className="text-[#7c6af7]" />
              </span>
              The Story
            </h3>
            <p className="text-sm text-[#555] leading-relaxed">
              Akro was born out of frustration with existing languages. Python is beautiful but slow.
              Go is fast but verbose. JavaScript is everywhere but chaotic.
            </p>
            <p className="text-sm text-[#555] leading-relaxed mt-3">
              Development started in 2026 with a simple goal: a language a beginner can learn in a
              weekend, but a professional can use to ship production software.
            </p>
          </div>

          <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-6">
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#4fc3f7]/15 border border-[#4fc3f7]/25 flex items-center justify-center">
                <Star size={12} className="text-[#4fc3f7]" />
              </span>
              Design Philosophy
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Simplicity first',     desc: "If it's hard to read, it's wrong." },
                { label: 'Performance matters',  desc: 'Fast by default, not by accident.' },
                { label: 'Web is first-class',   desc: 'The web is the platform. Treat it that way.' },
              ].map((p) => (
                <li key={p.label} className="flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#7c6af7] mt-2 shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium">{p.label}</span>
                    <span className="text-sm text-[#555]"> — {p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Roadmap */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-6">
          <h3 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#c3e88d]/15 border border-[#c3e88d]/25 flex items-center justify-center">
              <ArrowRight size={12} className="text-[#c3e88d]" />
            </span>
            Roadmap
          </h3>
          <div className="space-y-3">
            {[
              { version: 'v0.1.0', label: 'Beta Release',    desc: 'Core language, stdlib, REPL',         done: true  },
              { version: 'v0.2.0', label: 'Package Manager', desc: 'Module system & package registry',    done: false },
              { version: 'v0.3.0', label: 'Native Binaries', desc: 'Compile to native executables',       done: false },
              { version: 'v0.4.0', label: 'IDE Support',     desc: 'LSP & VS Code extension',             done: false },
              { version: 'v1.0.0', label: 'Stable Release',  desc: 'Production-ready, fully documented',  done: false },
            ].map((item) => (
              <div key={item.version} className="flex items-start gap-4">
                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${item.done ? 'bg-[#7c6af7]' : 'bg-[#222] border border-[#333]'}`} />
                <div className="flex-1 flex flex-wrap items-baseline gap-2">
                  <span className="text-xs font-mono text-[#7c6af7] bg-[#7c6af7]/8 px-2 py-0.5 rounded border border-[#7c6af7]/15">
                    {item.version}
                  </span>
                  <span className={`text-sm font-medium ${item.done ? 'text-white' : 'text-[#555]'}`}>{item.label}</span>
                  <span className="text-xs text-[#333]">— {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Built With */}
        <div className="rounded-2xl border border-[#1a1a1a] bg-[#050505] p-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#f78c6c]/15 border border-[#f78c6c]/25 flex items-center justify-center">
              <Cpu size={12} className="text-[#f78c6c]" />
            </span>
            Built With
          </h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: Code2, color: '#7c6af7', name: 'NSIS',        desc: 'Installer scripting'  },
              { icon: Globe, color: '#4fc3f7', name: 'JavaScript',  desc: 'Web runtime'           },
              { icon: Cpu,   color: '#c3e88d', name: 'TypeScript',  desc: 'Type-safe tooling'     },
            ].map((tech) => {
              const Icon = tech.icon
              return (
                <div key={tech.name} className="flex items-center gap-3 p-3 rounded-xl bg-black border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors">
                  <div className="p-2 rounded-lg" style={{ background: `${tech.color}12`, border: `1px solid ${tech.color}20` }}>
                    <Icon size={15} style={{ color: tech.color }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{tech.name}</div>
                    <div className="text-xs text-[#444]">{tech.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl border border-[#7c6af7]/20 bg-[#7c6af7]/5 p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Ready to try Akro?</h3>
          <p className="text-sm text-[#555] mb-6">Get started in minutes. No setup required.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/docs/introduction"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c6af7] hover:bg-[#6a58e5] text-white font-semibold text-sm transition-all">
              Read the Docs <ArrowRight size={14} />
            </Link>
            <Link to="/playground"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2a2a2a] hover:border-[#3a3a3a] text-white font-semibold text-sm transition-all">
              Try Playground
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
