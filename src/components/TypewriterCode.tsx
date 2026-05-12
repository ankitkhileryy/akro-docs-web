import { useEffect, useState, useRef } from 'react'

const CODE = `fn main {
  name := "World"
  say "Hello, {name}!"

  nums := [1, 2, 3, 4, 5]
  total := reduce(nums, fn(a, b) {
    return a + b
  }, 0)

  say "Sum = {total}"
}`

// Total lines in full code — box height is fixed to this
const TOTAL_LINES = CODE.split('\n').length

function highlight(line: string): { text: string; color: string }[] {
  type Token = { start: number; end: number; color: string }
  const tokens: Token[] = []

  const addTokens = (re: RegExp, color: string) => {
    let m: RegExpExecArray | null
    re.lastIndex = 0
    while ((m = re.exec(line)) !== null) {
      tokens.push({ start: m.index, end: m.index + m[0].length, color })
    }
  }

  addTokens(/\/\/.*/g,                                                          '#546e7a')
  addTokens(/"[^"]*"/g,                                                         '#c3e88d')
  addTokens(/\b\d+(\.\d+)?\b/g,                                                '#f78c6c')
  addTokens(/\b(fn|return|say|if|elif|else|for|while|in|mut|let|const|true|false|nil|and|or|not|reduce|map|filter)\b/g, '#c792ea')
  addTokens(/(:=|==|!=|<=|>=|\+|-|\*|\/|%|=|<|>)/g,                           '#89ddff')

  tokens.sort((a, b) => a.start - b.start)
  const clean: Token[] = []
  let cursor = 0
  for (const t of tokens) {
    if (t.start < cursor) continue
    clean.push(t)
    cursor = t.end
  }

  const spans: { text: string; color: string }[] = []
  let pos = 0
  for (const t of clean) {
    if (t.start > pos) spans.push({ text: line.slice(pos, t.start), color: '#9090a0' })
    spans.push({ text: line.slice(t.start, t.end), color: t.color })
    pos = t.end
  }
  if (pos < line.length) spans.push({ text: line.slice(pos), color: '#9090a0' })
  return spans
}

export default function TypewriterCode() {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const startDelay = setTimeout(() => {
      const type = () => {
        if (indexRef.current < CODE.length) {
          indexRef.current++
          setDisplayed(CODE.slice(0, indexRef.current))
          const ch = CODE[indexRef.current - 1]
          const delay = ch === '\n' ? 70 : 22
          timerRef.current = setTimeout(type, delay)
        } else {
          setDone(true)
        }
      }
      type()
    }, 500)

    return () => {
      clearTimeout(startDelay)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Split displayed into lines
  const typedLines = displayed.split('\n')

  // Pad to TOTAL_LINES so box never resizes
  const lines: string[] = []
  for (let i = 0; i < TOTAL_LINES; i++) {
    lines.push(typedLines[i] ?? '')
  }

  // Which line is currently being typed
  const activeLineIndex = typedLines.length - 1

  return (
    <div className="font-mono text-sm bg-[#050505] p-5 overflow-hidden">
      {lines.map((line, li) => {
        const isActiveLine = li === activeLineIndex && !done
        const spans = highlight(line)

        return (
          <div key={li} className="flex items-start" style={{ lineHeight: '1.75rem', minHeight: '1.75rem' }}>
            {/* Line number */}
            <span
              className="select-none shrink-0 text-right font-mono text-xs mr-5"
              style={{ color: '#2a2a3a', width: '1.2rem' }}
            >
              {li + 1}
            </span>

            {/* Code content */}
            <span className="flex-1">
              {spans.map((s, si) => (
                <span key={si} style={{ color: s.color }}>{s.text}</span>
              ))}
              {/* Blinking cursor only on active line */}
              {isActiveLine && (
                <span
                  className="inline-block align-middle ml-px"
                  style={{
                    width: '2px',
                    height: '14px',
                    background: '#7c6af7',
                    animation: 'blink 1s step-end infinite',
                  }}
                />
              )}
            </span>
          </div>
        )
      })}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
