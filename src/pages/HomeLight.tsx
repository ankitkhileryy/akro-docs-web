import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  Zap, Target, Globe, Cpu, Shield, Wrench,
  ArrowRight, ArrowDown,
  BookOpen, Code2, Lock, Layers, Star,
  Terminal, Copy, CheckCheck, Github
} from 'lucide-react'
import TypewriterCode from '../components/TypewriterCode'
import ComparisonTableLight from '../components/ComparisonTableLight'

// ── Install commands ──────────────────────────────────────────
const installTabs = [
  { label: 'curl',   cmd: 'curl -fsSL https://akro-lang.dev/install.sh | sh' },
  { label: 'npm',    cmd: 'npm install -g akro-lang' },
  { label: 'pnpm',   cmd: 'pnpm add -g akro-lang' },
  { label: 'bun',    cmd: 'bun add -g akro-lang' },
]

const features = [
  { icon: Zap,    color: '#7c6af7', title: 'Blazing Fast',    desc: 'Compiles to native code with Go-level performance. Zero runtime overhead.' },
  { icon: Target, color: '#4fc3f7', title: 'Simple Syntax',   desc: 'Python-inspired readability. Write less, do more. No semicolons, no noise.' },
  { icon: Globe,  color: '#5ba85a', title: 'Web Ready',       desc: 'First-class DOM, Fetch, and async support. Build web apps natively.' },
  { icon: Cpu,    color: '#f78c6c', title: 'Type Inference',  desc: 'Smart type inference — types are inferred automatically.' },
  { icon: Shield, color: '#d4a017', title: 'Safe by Default', desc: 'No null pointer exceptions. Errors are values. Memory is managed.' },
  { icon: Wrench, color: '#9c6fc4', title: 'Great Tooling',   desc: 'Built-in formatter, linter, REPL, and package manager from day one.' },
]

const stats = [
  { label: 'Built-in Functions', value: '40+',    icon: Code2    },
  { label: 'Examples',           value: '10+',    icon: BookOpen },
  { label: 'License',            value: 'MIT',    icon: Lock     },
  { label: 'Version',            value: 'v0.1.0', icon: Layers   },
]

// ── Install tab component ─────────────────────────────────────
function InstallCommand() {
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(installTabs[active].cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-xl">
      {/* Tabs */}
      <div className="flex gap-0 mb-0 border-b border-[#e5e5e5]">
        {installTabs.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`px-4 py-2 text-xs font-mono font-medium transition-colors border-b-2 -mb-px ${
              active === i
                ? 'text-[#7c6af7] border-[#7c6af7]'
                : 'text-[#999] border-transparent hover:text-[#555]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Command */}
      <div className="flex items-center gap-3 bg-[#f5f5f5] border border-[#e5e5e5] border-t-0 rounded-b-xl px-4 py-3">
        <span className="text-[#999] font-mono text-sm select-none">$</span>
        <span className="flex-1 font-mono text-sm text-[#1a1a1a] truncate">
          {installTabs[active].cmd}
        </span>
        <button
          onClick={copy}
          className="shrink-0 text-[#aaa] hover:text-[#555] transition-colors"
        >
          {copied ? <CheckCheck size={14} className="text-[#7c6af7]" /> : <Copy size={14} />}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────
export default function HomeLight() {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div className="bg-white">

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#7c6af7]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7c6af7]/25 bg-[#7c6af7]/8 text-[#7c6af7] text-xs font-medium mb-10"
            style={{ animation: 'heroFadeUp 0.6s ease forwards', opacity: 0 }}
          >
            <Star size={10} fill="#7c6af7" />
            v0.1.0-beta — Now Available
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#0a0a0a] leading-tight tracking-tight mb-6 max-w-3xl"
            style={{ animation: 'heroFadeUp 0.6s ease 0.15s forwards', opacity: 0 }}
          >
            There are many languages,<br />
            <span className="text-[#7c6af7]">but this one is yours.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg sm:text-xl text-[#666] max-w-xl leading-relaxed mb-4"
            style={{ animation: 'heroFadeUp 0.6s ease 0.3s forwards', opacity: 0 }}
          >
            Akro is a minimal, fast programming language.
            <br />
            Adapt Akro to your workflows, not the other way around.
          </p>

          {/* Install */}
          <div
            className="mb-10 w-full flex justify-center"
            style={{ animation: 'heroFadeUp 0.6s ease 0.45s forwards', opacity: 0 }}
          >
            <InstallCommand />
          </div>

          {/* CTAs */}
          <div
            className="flex flex-wrap gap-3 justify-center mb-16"
            style={{ animation: 'heroFadeUp 0.6s ease 0.6s forwards', opacity: 0 }}
          >
            <Link
              to="/docs/introduction"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-black bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
            >
              Get Started
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/examples"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-black text-black font-semibold text-sm hover:bg-gray-100 transition-colors"
            >
              <Terminal size={15} />
              View Examples
            </Link>
          </div>

          {/* Scroll hint */}
          <button
            onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-2 text-[#bbb] hover:text-[#888] transition-colors"
            style={{ animation: 'heroFadeUp 0.6s ease 0.75s forwards', opacity: 0 }}
          >
            <span className="text-xs font-mono tracking-widest uppercase">$ scroll to continue</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ══ CODE PREVIEW ══════════════════════════════════════ */}
      <section ref={scrollRef} className="py-24 border-t border-[#e5e5e5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-mono text-[#7c6af7] uppercase tracking-widest mb-4">Simple by design</p>
              <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4 leading-tight">
                Write less.<br />Do more.
              </h2>
              <p className="text-[#666] leading-relaxed mb-6">
                Akro's syntax is clean and minimal. No semicolons, no boilerplate,
                no noise. Just your logic — expressed clearly.
              </p>
              <Link
                to="/docs/quick-start"
                className="inline-flex items-center gap-2 text-sm text-[#7c6af7] hover:text-[#4fc3f7] transition-colors"
              >
                Quick Start guide <ArrowRight size={13} />
              </Link>
            </div>

            {/* Code window */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-br from-[#7c6af7]/8 to-[#4fc3f7]/5 rounded-2xl blur-xl" />
              <div className="relative rounded-xl border border-[#e5e5e5] overflow-hidden bg-[#f8f8f8]">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f0f0f0] border-b border-[#e5e5e5]">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="ml-2 text-xs text-[#999] font-mono">main.akro</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7c6af7] animate-pulse" />
                    <span className="text-xs text-[#999] font-mono">akro run</span>
                  </div>
                </div>
                <TypewriterCode />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS ═════════════════════════════════════════════ */}
      <section className="border-y border-[#e5e5e5] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#e5e5e5]">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex flex-col items-center gap-1 px-6 py-2">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className="text-[#7c6af7]" />
                    <span className="text-xl font-bold text-[#0a0a0a] tracking-tight font-mono">{s.value}</span>
                  </div>
                  <span className="text-xs text-[#999] text-center">{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#7c6af7] uppercase tracking-widest mb-3 text-center">Why Akro?</p>
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center tracking-tight">
            Primitives, not features.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#e5e5e5]">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="p-6 bg-white hover:bg-[#f5f5f5] transition-colors group"
                >
                  <div
                    className="inline-flex p-2 rounded-lg mb-4"
                    style={{ background: `${f.color}10`, border: `1px solid ${f.color}30` }}
                  >
                    <Icon size={16} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold text-[#0a0a0a] mb-2 text-sm">{f.title}</h3>
                  <p className="text-xs text-[#666] leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ COMPARISON ════════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f5f5] border-t border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#7c6af7] uppercase tracking-widest mb-3 text-center">Comparison</p>
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center tracking-tight">
            How Akro compares.
          </h2>
          <ComparisonTableLight />
        </div>
      </section>

      {/* ══ WHAT WE DIDN'T BUILD ══════════════════════════════ */}
      <section className="py-24 bg-white border-t border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#7c6af7] uppercase tracking-widest mb-3 text-center">Philosophy</p>
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-4 text-center tracking-tight">
            What we didn't build.
          </h2>
          <p className="text-[#666] text-center mb-12 max-w-xl mx-auto">
            Akro is aggressively minimal so it doesn't dictate your workflow.
            Features that other languages bake in, you can build yourself.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'No runtime bloat.',     desc: 'Compiles to lean native binaries. No VM, no garbage pauses.' },
              { title: 'No magic imports.',     desc: 'Explicit imports only. You always know where things come from.' },
              { title: 'No hidden allocations.',desc: 'Memory model is predictable. What you write is what runs.' },
              { title: 'No framework lock-in.', desc: 'Akro works with any web framework or none at all.' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 p-5 border border-[#e5e5e5] rounded-xl bg-[#f5f5f5] hover:border-[#d0d0d0] transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-[#7c6af7] mt-2 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#0a0a0a] mb-1">{item.title}</div>
                  <div className="text-xs text-[#666] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GET INVOLVED ══════════════════════════════════════ */}
      <section className="py-24 bg-[#f5f5f5] border-t border-[#e5e5e5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono text-[#7c6af7] uppercase tracking-widest mb-3 text-center">Community</p>
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-12 text-center tracking-tight">Get involved.</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              {
                icon: <Github size={22} className="text-[#1a1a1a]" />,
                title: 'GitHub',
                desc: 'Star the repo, report bugs, submit PRs.',
                href: 'https://github.com',
                label: 'View on GitHub'
              },
              {
                icon: <BookOpen size={22} className="text-[#7c6af7]" />,
                title: 'Docs',
                desc: 'Read the full documentation and guides.',
                href: '/docs/introduction',
                label: 'Read Docs'
              },
            ].map(item => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="flex flex-col gap-3 p-5 border border-[#e5e5e5] rounded-xl bg-white hover:border-[#d0d0d0] transition-colors group"
              >
                <span>{item.icon}</span>
                <div>
                  <div className="text-sm font-semibold text-[#0a0a0a] mb-1">{item.title}</div>
                  <div className="text-xs text-[#666] leading-relaxed mb-3">{item.desc}</div>
                  <span className="text-xs text-[#7c6af7] group-hover:text-[#4fc3f7] transition-colors flex items-center gap-1">
                    {item.label} <ArrowRight size={11} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER CTA ════════════════════════════════════════ */}
      <section className="py-20 border-t border-[#e5e5e5] bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0a0a0a] mb-3 tracking-tight">
            Start building with Akro.
          </h2>
          <p className="text-[#666] mb-8">Install in seconds. No setup required.</p>
          <div className="flex justify-center mb-8">
            <InstallCommand />
          </div>
          <Link
            to="/docs/introduction"
            className="inline-flex items-center gap-2 text-sm text-[#7c6af7] hover:text-[#4fc3f7] transition-colors"
          >
            Read the docs <ArrowRight size={13} />
          </Link>
        </div>
      </section>

    </div>
  )
}
