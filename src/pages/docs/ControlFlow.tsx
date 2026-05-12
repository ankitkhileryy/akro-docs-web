import CodeBlock from '../../components/CodeBlock'

export default function ControlFlow() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Control Flow</div>
      <h1>Control Flow</h1>

      <h2>if / elif / else</h2>
      <CodeBlock code={`score := 85

if score >= 90 {
  say "A"
} elif score >= 80 {
  say "B"
} elif score >= 70 {
  say "C"
} else {
  say "F"
}`} language="javascript" />

      <h2>Inline if</h2>
      <CodeBlock code={`x := 10
label := if x > 0 { "positive" } else { "non-positive" }
say label  // positive`} language="javascript" />

      <h2>match</h2>
      <p>Pattern matching with <code>match</code> is more powerful than switch statements:</p>
      <CodeBlock code={`day := "Monday"

match day {
  case "Saturday", "Sunday" {
    say "Weekend!"
  }
  case "Monday" {
    say "Start of the week"
  }
  case _ {
    say "Weekday"
  }
}`} language="javascript" />

      <h2>Range matching</h2>
      <CodeBlock code={`age := 25

match age {
  case 0..12   { say "Child" }
  case 13..17  { say "Teenager" }
  case 18..64  { say "Adult" }
  case 65..120 { say "Senior" }
  case _       { say "Invalid age" }
}`} language="javascript" />

      <h2>Guard clauses</h2>
      <CodeBlock code={`value := 42

match value {
  case n if n < 0  { say "Negative: {n}" }
  case n if n == 0 { say "Zero" }
  case n if n > 0  { say "Positive: {n}" }
}`} language="javascript" />
    </div>
  )
}
