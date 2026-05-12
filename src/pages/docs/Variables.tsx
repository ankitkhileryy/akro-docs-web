import CodeBlock from '../../components/CodeBlock'

export default function Variables() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Variables</div>
      <h1>Variables</h1>
      <p>
        Akro uses type inference, so you rarely need to specify types explicitly.
        Variables are declared with <code>:=</code> and are immutable by default.
      </p>

      <h2>Declaration</h2>
      <CodeBlock code={`// Immutable variable (default)
name := "Akro"
version := 1
pi := 3.14159
is_fast := true

// Mutable variable
mut counter := 0
counter = counter + 1`} language="javascript" />

      <h2>Types</h2>
      <p>Akro has the following built-in types:</p>
      <CodeBlock code={`// String
greeting := "Hello, World!"
multiline := """
  This is a
  multiline string
"""

// Integer
age := 25
big := 1_000_000  // underscores for readability

// Float
price := 9.99
scientific := 1.5e10

// Boolean
active := true
disabled := false

// Nil
nothing := nil`} language="javascript" />

      <h2>String Interpolation</h2>
      <CodeBlock code={`name := "World"
greeting := "Hello, {name}!"
say greeting  // Hello, World!

x := 42
say "The answer is {x * 2}"  // The answer is 84`} language="javascript" />

      <h2>Constants</h2>
      <CodeBlock code={`const MAX_SIZE := 100
const PI := 3.14159
const APP_NAME := "Akro"`} language="javascript" />

      <h2>Type Annotations</h2>
      <p>You can optionally annotate types explicitly:</p>
      <CodeBlock code={`name: string := "Akro"
count: int := 0
ratio: float := 0.5
flag: bool := true`} language="javascript" />

      <h2>Multiple Assignment</h2>
      <CodeBlock code={`// Swap values
a := 1
b := 2
a, b = b, a
say a  // 2
say b  // 1

// Destructuring
x, y, z := [1, 2, 3]`} language="javascript" />
    </div>
  )
}
