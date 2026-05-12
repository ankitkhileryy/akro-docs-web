import CodeBlock from '../../components/CodeBlock'

export default function ErrorHandling() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Error Handling</div>
      <h1>Error Handling</h1>
      <p>Akro treats errors as values. Use <code>try/catch</code> for recoverable errors and <code>throw</code> to raise them.</p>

      <h2>try / catch</h2>
      <CodeBlock code={`fn divide(a, b) {
  if b == 0 {
    throw "DivisionByZero: cannot divide by zero"
  }
  return a / b
}

fn main {
  try {
    result := divide(10, 2)
    say "10 / 2 = {result}"
    bad := divide(5, 0)
    say bad
  } catch err {
    say "Caught: {err}"
  }
}`} language="javascript" />

      <h2>throw</h2>
      <CodeBlock code={`fn parse_age(s) {
  n := int(s)
  if n < 0 or n > 150 {
    throw "InvalidAge: {s} is not a valid age"
  }
  return n
}

try {
  age := parse_age("25")
  say "Age: {age}"
  bad := parse_age("-5")
} catch err {
  say err
}`} language="javascript" />

      <h2>Result Type Pattern</h2>
      <CodeBlock code={`fn safe_divide(a, b) {
  if b == 0 {
    return { ok: false, error: "division by zero" }
  }
  return { ok: true, value: a / b }
}

res := safe_divide(10, 2)
if res.ok {
  say "Result: {res.value}"
} else {
  say "Error: {res.error}"
}`} language="javascript" />

      <h2>finally</h2>
      <CodeBlock code={`try {
  risky_operation()
} catch err {
  say "Error: {err}"
} finally {
  say "This always runs"
  cleanup()
}`} language="javascript" />
    </div>
  )
}
