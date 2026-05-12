import CodeBlock from '../../components/CodeBlock'

export default function QuickStart() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Getting Started / Quick Start</div>
      <h1>Quick Start</h1>
      <p>Let's write your first Akro program in under 5 minutes.</p>

      <h2>Create a Project</h2>
      <CodeBlock code={`akro new hello-world
cd hello-world`} language="bash" />

      <p>This creates the following structure:</p>
      <CodeBlock code={`hello-world/
├── src/
│   └── main.akro
├── akro.toml
└── .gitignore`} language="bash" />

      <h2>Your First Program</h2>
      <p>Open <code>src/main.akro</code> — it already contains:</p>
      <CodeBlock code={`fn main {
  say "Hello, World!"
}`} language="javascript" filename="src/main.akro" />

      <h2>Run It</h2>
      <CodeBlock code={`akro run
# Hello, World!`} language="bash" />

      <h2>Let's Do More</h2>
      <p>Replace the contents of <code>main.akro</code> with:</p>
      <CodeBlock code={`fn fibonacci(n) {
  if n <= 1 {
    return n
  }
  return fibonacci(n - 1) + fibonacci(n - 2)
}

fn main {
  say "Fibonacci sequence:"
  for i in 0..10 {
    say "{i}: {fibonacci(i)}"
  }
}`} language="javascript" filename="src/main.akro" showLineNumbers />

      <CodeBlock code={`akro run
# Fibonacci sequence:
# 0: 0
# 1: 1
# 2: 1
# 3: 2
# 4: 3
# 5: 5
# 6: 8
# 7: 13
# 8: 21
# 9: 34`} language="bash" />

      <h2>Build for Production</h2>
      <CodeBlock code={`akro build --release
./target/release/hello-world`} language="bash" />

      <h2>What's Next?</h2>
      <p>You're up and running! Here's where to go next:</p>
      <ul>
        <li>Learn about <a href="/docs/variables">Variables & Types</a></li>
        <li>Explore <a href="/docs/functions">Functions</a></li>
        <li>Check out the <a href="/examples">Examples</a> page</li>
      </ul>
    </div>
  )
}
