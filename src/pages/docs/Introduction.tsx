import { Link } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'

export default function Introduction() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Getting Started / Introduction</div>
      <h1>Introduction to Akro</h1>
      <p>
        Akro is a modern, statically-typed programming language designed for simplicity, speed,
        and web development. It combines the readability of Python, the performance of Go, and
        the web capabilities of JavaScript into a single, cohesive language.
      </p>

      <h2>What is Akro?</h2>
      <p>
        Akro is a compiled language that targets both native binaries and WebAssembly, making it
        suitable for everything from command-line tools to full-stack web applications. The language
        features automatic memory management, strong type inference, and a clean, minimal syntax.
      </p>

      <h2>Key Features</h2>
      <ul>
        <li><strong>Type inference</strong> — Write less, get more. Types are inferred automatically.</li>
        <li><strong>Pattern matching</strong> — Expressive control flow with <code>match</code> expressions.</li>
        <li><strong>First-class functions</strong> — Functions are values. Pass them, return them, compose them.</li>
        <li><strong>Web-native</strong> — Built-in DOM, Fetch, and async/await support.</li>
        <li><strong>Safe by default</strong> — No null pointer exceptions. Errors are explicit values.</li>
        <li><strong>Fast compilation</strong> — Incremental compilation for rapid development cycles.</li>
      </ul>

      <h2>A Taste of Akro</h2>
      <p>Here's a simple Akro program that demonstrates the core syntax:</p>

      <CodeBlock
        code={`fn greet(name) {
  return "Hello, {name}!"
}

fn main {
  // Variables use := for declaration
  message := greet("World")
  say message

  // Arrays and higher-order functions
  nums := [1, 2, 3, 4, 5]
  evens := filter(nums, fn(n) { return n % 2 == 0 })
  say evens  // [2, 4]

  // Pattern matching
  score := 85
  grade := match score {
    case 90..100 { "A" }
    case 80..89  { "B" }
    case 70..79  { "C" }
    case _       { "F" }
  }
  say "Grade: {grade}"
}`}
        language="javascript"
        showLineNumbers
      />

      <h2>Who is Akro for?</h2>
      <p>
        Akro is designed for developers who want a productive, modern language without sacrificing
        performance. Whether you're a beginner learning to code or an experienced developer building
        production systems, Akro scales with your needs.
      </p>

      <h2>Next Steps</h2>
      <p>
        Ready to get started? Head over to the{' '}
        <Link to="/docs/installation">Installation guide</Link> to set up Akro on your machine,
        then follow the <Link to="/docs/quick-start">Quick Start</Link> to write your first program.
      </p>
    </div>
  )
}
