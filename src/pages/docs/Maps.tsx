import CodeBlock from '../../components/CodeBlock'

export default function Maps() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Maps</div>
      <h1>Maps</h1>
      <p>Maps (also called dictionaries or hash maps) store key-value pairs.</p>

      <h2>Creating Maps</h2>
      <CodeBlock code={`// String keys
person := { "name": "Alice", "age": 30 }

// Shorthand (when key matches variable name)
name := "Alice"
age := 30
person := { name, age }

// Empty map
empty := {}`} language="javascript" />

      <h2>Accessing Values</h2>
      <CodeBlock code={`person := { "name": "Alice", "age": 30 }

say person["name"]  // Alice
say person.name     // Alice (dot notation)

// Safe access (returns nil if missing)
say person["email"]  // nil`} language="javascript" />

      <h2>Modifying Maps</h2>
      <CodeBlock code={`mut config := { "debug": false, "port": 8080 }

config["debug"] = true
config["host"] = "localhost"
config.remove("port")

say config  // { debug: true, host: "localhost" }`} language="javascript" />

      <h2>Checking Keys</h2>
      <CodeBlock code={`data := { "x": 1, "y": 2 }

if "x" in data {
  say "x exists: {data["x"]}"
}

if "z" not in data {
  say "z is missing"
}`} language="javascript" />

      <h2>Iterating</h2>
      <CodeBlock code={`scores := { "Alice": 95, "Bob": 87, "Carol": 92 }

for name, score in scores {
  say "{name}: {score}"
}

// Keys only
for name in scores.keys() {
  say name
}

// Values only
for score in scores.values() {
  say score
}`} language="javascript" />
    </div>
  )
}
