import CodeBlock from '../../components/CodeBlock'

export default function PatternMatching() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Pattern Matching</div>
      <h1>Pattern Matching</h1>
      <p>
        Pattern matching in Akro is exhaustive and expressive. The <code>match</code> expression
        must cover all possible cases.
      </p>

      <h2>Basic Match</h2>
      <CodeBlock code={`status := 404

match status {
  case 200 { say "OK" }
  case 404 { say "Not Found" }
  case 500 { say "Server Error" }
  case _   { say "Unknown status" }
}`} language="javascript" />

      <h2>Multiple Patterns</h2>
      <CodeBlock code={`day := "Saturday"

match day {
  case "Saturday", "Sunday" { say "Weekend" }
  case "Monday", "Friday"   { say "Almost weekend" }
  case _                    { say "Weekday" }
}`} language="javascript" />

      <h2>Range Patterns</h2>
      <CodeBlock code={`n := 42

match n {
  case 0       { say "zero" }
  case 1..9    { say "single digit" }
  case 10..99  { say "double digit" }
  case 100..   { say "triple digit or more" }
}`} language="javascript" />

      <h2>Destructuring</h2>
      <CodeBlock code={`point := { x: 3, y: 4 }

match point {
  case { x: 0, y: 0 } { say "origin" }
  case { x: 0, y }    { say "on y-axis at {y}" }
  case { x, y: 0 }    { say "on x-axis at {x}" }
  case { x, y }       { say "at ({x}, {y})" }
}`} language="javascript" />

      <h2>Guard Clauses</h2>
      <CodeBlock code={`value := 15

match value {
  case n if n < 0   { say "negative" }
  case n if n == 0  { say "zero" }
  case n if n % 2 == 0 { say "positive even" }
  case n            { say "positive odd" }
}`} language="javascript" />

      <h2>Match as Expression</h2>
      <CodeBlock code={`score := 87

grade := match score {
  case 90..100 { "A" }
  case 80..89  { "B" }
  case 70..79  { "C" }
  case 60..69  { "D" }
  case _       { "F" }
}

say "Grade: {grade}"  // Grade: B`} language="javascript" />
    </div>
  )
}
