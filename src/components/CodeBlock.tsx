import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { Copy, Check } from 'lucide-react'

// Custom Akro theme
const akroTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: '#e8e8f0',
    background: '#050505',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    fontSize: '0.875rem',
    lineHeight: '1.7',
  },
  'pre[class*="language-"]': {
    color: '#e8e8f0',
    background: '#050505',
    padding: '1.25rem',
    borderRadius: '8px',
    overflow: 'auto',
    margin: 0,
  },
  comment: { color: '#546e7a', fontStyle: 'italic' },
  prolog: { color: '#546e7a' },
  doctype: { color: '#546e7a' },
  cdata: { color: '#546e7a' },
  punctuation: { color: '#89ddff' },
  property: { color: '#82aaff' },
  tag: { color: '#f07178' },
  boolean: { color: '#c792ea' },
  number: { color: '#f78c6c' },
  constant: { color: '#c792ea' },
  symbol: { color: '#c3e88d' },
  deleted: { color: '#f07178' },
  selector: { color: '#c3e88d' },
  'attr-name': { color: '#ffcb6b' },
  string: { color: '#c3e88d' },
  char: { color: '#c3e88d' },
  builtin: { color: '#82aaff' },
  inserted: { color: '#c3e88d' },
  operator: { color: '#89ddff' },
  entity: { color: '#ffcb6b', cursor: 'help' },
  url: { color: '#89ddff' },
  variable: { color: '#e8e8f0' },
  atrule: { color: '#c792ea' },
  'attr-value': { color: '#c3e88d' },
  function: { color: '#82aaff' },
  'class-name': { color: '#ffcb6b' },
  keyword: { color: '#c792ea' },
  regex: { color: '#f78c6c' },
  important: { color: '#c792ea', fontWeight: 'bold' },
  bold: { fontWeight: 'bold' },
  italic: { fontStyle: 'italic' },
}

interface CodeBlockProps {
  code: string
  language?: string
  showLineNumbers?: boolean
  filename?: string
}

export default function CodeBlock({
  code,
  language = 'javascript',
  showLineNumbers = false,
  filename,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden border border-[#1a1a1a] my-4">
      {filename && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#080808] border-b border-[#1a1a1a]">
          <span className="text-xs text-[#888] font-mono">{filename}</span>
        </div>
      )}
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-3 right-3 z-10 p-1.5 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#555] hover:text-[#e8e8f0] transition-colors"
          title="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
        <SyntaxHighlighter
          language={language}
          style={akroTheme}
          showLineNumbers={showLineNumbers}
          lineNumberStyle={{ color: '#3a3a4a', minWidth: '2.5em' }}
          customStyle={{ margin: 0, borderRadius: filename ? '0 0 8px 8px' : '8px' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}
