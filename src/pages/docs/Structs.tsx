import CodeBlock from '../../components/CodeBlock'

export default function Structs() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Structs</div>
      <h1>Structs</h1>
      <p>Structs are custom data types that group related fields together.</p>

      <h2>Defining a Struct</h2>
      <CodeBlock code={`struct Point {
  x: float
  y: float
}`} language="javascript" />

      <h2>Creating Instances</h2>
      <CodeBlock code={`p := Point { x: 3.0, y: 4.0 }
say p.x  // 3.0
say p.y  // 4.0`} language="javascript" />

      <h2>Methods</h2>
      <CodeBlock code={`struct Point {
  x: float
  y: float

  fn distance(other) {
    dx := self.x - other.x
    dy := self.y - other.y
    return sqrt(dx*dx + dy*dy)
  }

  fn to_string() {
    return "({self.x}, {self.y})"
  }
}

p1 := Point { x: 0.0, y: 0.0 }
p2 := Point { x: 3.0, y: 4.0 }
say p1.distance(p2)   // 5.0
say p2.to_string()    // (3.0, 4.0)`} language="javascript" />

      <h2>Struct Update Syntax</h2>
      <CodeBlock code={`original := Point { x: 1.0, y: 2.0 }
moved := Point { x: 5.0, ...original }  // y is copied from original`} language="javascript" />

      <h2>Nested Structs</h2>
      <CodeBlock code={`struct Address {
  street: string
  city: string
}

struct Person {
  name: string
  age: int
  address: Address
}

alice := Person {
  name: "Alice",
  age: 30,
  address: Address {
    street: "123 Main St",
    city: "Springfield"
  }
}

say alice.address.city  // Springfield`} language="javascript" />
    </div>
  )
}
