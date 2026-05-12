import { useState, useRef, useCallback } from 'react'
import { Play, Trash2, Copy, CheckCheck, ChevronDown, Terminal } from 'lucide-react'
import { runAkro, OutputLine } from '../interpreter/run'
import { examples } from '../data/examples'

const DEFAULT_CODE = `fn main {
  name := "World"
  say "Hello, {name}!"

  nums := [1, 2, 3, 4, 5]
  total := reduce(nums, fn(a, b) {
    return a + b
  }, 0)

  say "Sum = {total}"

  for i in 0..5 {
    say "i = {i}"
  }
}`

function highlight(code: string): string {
  const keywords = ['fn','return','say','if','elif','else','for','while','in','mut','let','const','true','false','nil','and','or','not','reduce','map','filter','match','case','struct','enum','throw','try','catch','finally','async','await','break','continue','loop','print']
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Comments
  result = result.replace(/(\/\/.*)/g, '<span style="color:#546e7a;font-style:italic">$1</span>')
  // Strings
  result = result.replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#c3e88d">$1</span>')
  // Numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span style="color:#f78c6c">$1</span>')
  // Keywords
  const kwRe = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
  result = result.replace(kwRe, '<span style="color:#c792ea">$1</span>')
  // Operators
  result = result.replace(/(:=|==|!=|&lt;=|&gt;=|[+\-*/%=&lt;&gt;])/g, '<span style="color:#89ddff">$1</span>')

  return result
}

export default function Playground() {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState<OutputLine[]>([])
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  const run = useCallback(() => {
    setRunning(true)
    setRan(false)
    setTimeout(() => {
      const result = runAkro(code)
      setOutput(result)
      setRunning(false)
      setRan(true)
      setTimeout(() => outputRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 50)
    }, 80)
  }, [code])

  const clear = () => { setCode(''); setOutput([]); setRan(false); textareaRef.current?.focus() }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); return }
    // Tab indent
    if (e.key === 'Tab') {
      e.preventDefault()
      const ta = e.currentTarget
      const start = ta.selectionStart, end = ta.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 2 }, 0)
    }
  }

  const loadExample = (exCode: string) => {
    setCode(exCode)
    setOutput([])
    setRan(false)
    setShowExamples(false)
  }

  const lineCount = code.split('\n').length

  return (
    <div className="min-h-screen bg-black flex flex-col">

      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#050505] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <Terminal size={18} className="text-[#7c6af7]" />
              Playground
            </h1>
            <p className="text-xs text-[#444] mt-0.5">Run Akro code in your browser — no install needed</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#333]">
            <kbd className="px-1.5 py-0.5 rounded bg-[#111] border border-[#1a1a1a] text-[#444]">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-1.5 py-0.5 rounded bg-[#111] border border-[#1a1a1a] text-[#444]">Enter</kbd>
            <span className="text-[#333]">to run</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-[#1a1a1a] bg-[#080808] px-4 sm:px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 flex-wrap">
          {/* Run */}
          <button
            onClick={run}
            disabled={running}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              running
                ? 'bg-[#7c6af7]/50 text-white/50 cursor-not-allowed'
                : 'bg-[#7c6af7] hover:bg-[#6a58e5] text-white shadow-lg shadow-[#7c6af7]/20'
            }`}
          >
            <Play size={14} className={running ? 'animate-pulse' : ''} fill="currentColor" />
            {running ? 'Running...' : 'Run'}
          </button>

          {/* Clear */}
          <button
            onClick={clear}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
          >
            <Trash2 size={13} />
            Clear
          </button>

          {/* Copy */}
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
          >
            {copied ? <CheckCheck size={13} className="text-[#7c6af7]" /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>

          {/* Examples dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#555] hover:text-white border border-[#1a1a1a] hover:border-[#2a2a2a] transition-colors"
            >
              Examples
              <ChevronDown size={13} className={`transition-transform ${showExamples ? 'rotate-180' : ''}`} />
            </button>
            {showExamples && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl shadow-2xl z-50 overflow-hidden">
                {examples.map(ex => (
                  <button
                    key={ex.id}
                    onClick={() => loadExample(ex.code)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#7c6af7]/10 transition-colors flex items-center justify-between gap-2"
                  >
                    <span className="text-[#e8e8f0] truncate">{ex.title}</span>
                    <span className="text-xs text-[#444] shrink-0">{ex.category}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 0 }}>

        {/* Editor */}
        <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-[#1a1a1a] min-h-[300px] lg:min-h-0">
          <div className="flex items-center justify-between px-4 py-2 bg-[#080808] border-b border-[#1a1a1a]">
            <span className="text-xs font-mono text-[#444]">main.akro</span>
            <span className="text-xs text-[#333]">{lineCount} lines</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            {/* Line numbers */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#050505] border-r border-[#111] overflow-hidden pointer-events-none z-10">
              <div className="pt-4 pb-4">
                {Array.from({ length: lineCount }, (_, i) => (
                  <div key={i} className="text-right pr-2 text-xs font-mono text-[#2a2a2a] leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-[#050505] text-[#e8e8f0] font-mono text-sm leading-6 resize-none outline-none pl-14 pr-4 pt-4 pb-4 caret-[#7c6af7]"
              style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
              placeholder="// Write Akro code here..."
            />
          </div>
        </div>

        {/* Output */}
        <div className="flex-1 flex flex-col min-h-[200px] lg:min-h-0 lg:max-w-[45%]">
          <div className="flex items-center justify-between px-4 py-2 bg-[#080808] border-b border-[#1a1a1a]">
            <span className="text-xs font-mono text-[#444]">output</span>
            {ran && (
              <span className={`text-xs font-mono ${output.some(o => o.type === 'error') ? 'text-[#f78c6c]' : 'text-[#c3e88d]'}`}>
                {output.some(o => o.type === 'error') ? '✗ error' : `✓ ${output.length} line${output.length !== 1 ? 's' : ''}`}
              </span>
            )}
          </div>
          <div
            ref={outputRef}
            className="flex-1 overflow-y-auto bg-black p-4 font-mono text-sm"
          >
            {!ran && !running && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-[#222]">
                <Play size={32} className="text-[#1a1a1a]" />
                <span className="text-xs">Press Run or Ctrl+Enter</span>
              </div>
            )}
            {running && (
              <div className="flex items-center gap-2 text-[#555]">
                <div className="w-2 h-2 rounded-full bg-[#7c6af7] animate-pulse" />
                <span className="text-xs font-mono">Running...</span>
              </div>
            )}
            {ran && output.length === 0 && (
              <span className="text-[#333] text-xs">// No output</span>
            )}
            {ran && output.map((line, i) => (
              <div
                key={i}
                className={`leading-7 ${
                  line.type === 'error'
                    ? 'text-[#f78c6c]'
                    : line.type === 'info'
                    ? 'text-[#4fc3f7]'
                    : 'text-[#00ff88]'
                }`}
                style={{ animation: `fadeIn 0.15s ease ${i * 30}ms both` }}
              >
                <span className="text-[#333] select-none mr-2">&gt;</span>
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
