import CodeBlock from '../../components/CodeBlock'

export default function Enums() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Enums</div>
      <h1>Enums</h1>
      <p>Enums define a type with a fixed set of variants.</p>

      <h2>Basic Enum</h2>
      <CodeBlock code={`enum Direction {
  North
  South
  East
  West
}

dir := Direction.North
say dir  // North`} language="javascript" />

      <h2>Enum with Data</h2>
      <CodeBlock code={`enum Shape {
  Circle(radius: float)
  Rectangle(width: float, height: float)
  Triangle(base: float, height: float)
}

circle := Shape.Circle(radius: 5.0)
rect := Shape.Rectangle(width: 4.0, height: 6.0)`} language="javascript" />

      <h2>Pattern Matching on Enums</h2>
      <CodeBlock code={`fn area(shape) {
  match shape {
    case Shape.Circle(r)       { return PI * r * r }
    case Shape.Rectangle(w, h) { return w * h }
    case Shape.Triangle(b, h)  { return 0.5 * b * h }
  }
}

say area(Shape.Circle(radius: 5.0))           // 78.54
say area(Shape.Rectangle(width: 4.0, height: 6.0))  // 24.0`} language="javascript" />

      <h2>Option Type</h2>
      <CodeBlock code={`// Built-in Option enum
enum Option {
  Some(value)
  None
}

fn find_user(id) {
  if id == 1 {
    return Option.Some("Alice")
  }
  return Option.None
}

result := find_user(1)
match result {
  case Option.Some(name) { say "Found: {name}" }
  case Option.None       { say "Not found" }
}`} language="javascript" />
    </div>
  )
}
