import CodeBlock from '../../components/CodeBlock'

export default function Loops() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Loops</div>
      <h1>Loops</h1>

      <h2>for...in (range)</h2>
      <CodeBlock code={`// Range loop
for i in 0..5 {
  say i  // 0, 1, 2, 3, 4
}

// Inclusive range
for i in 1..=5 {
  say i  // 1, 2, 3, 4, 5
}`} language="javascript" />

      <h2>for...in (array)</h2>
      <CodeBlock code={`fruits := ["apple", "banana", "cherry"]

for fruit in fruits {
  say fruit
}

// With index
for i, fruit in fruits {
  say "{i}: {fruit}"
}`} language="javascript" />

      <h2>for...in (map)</h2>
      <CodeBlock code={`scores := { "Alice": 95, "Bob": 87 }

for name, score in scores {
  say "{name} scored {score}"
}`} language="javascript" />

      <h2>while</h2>
      <CodeBlock code={`mut n := 1

while n < 100 {
  n = n * 2
}

say n  // 128`} language="javascript" />

      <h2>loop (infinite)</h2>
      <CodeBlock code={`mut count := 0

loop {
  count = count + 1
  if count >= 5 {
    break
  }
}

say count  // 5`} language="javascript" />

      <h2>break and continue</h2>
      <CodeBlock code={`for i in 0..10 {
  if i % 2 == 0 {
    continue  // skip even numbers
  }
  if i > 7 {
    break     // stop at 7
  }
  say i  // 1, 3, 5, 7
}`} language="javascript" />
    </div>
  )
}
