import CodeBlock from '../../components/CodeBlock'

export default function Imports() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Imports</div>
      <h1>Imports</h1>

      <h2>Importing Modules</h2>
      <CodeBlock code={`import math
import string
import io

say math.sqrt(16)   // 4.0
say string.upper("hello")  // HELLO`} language="javascript" />

      <h2>Named Imports</h2>
      <CodeBlock code={`import { sqrt, pow, PI } from math
import { upper, lower, trim } from string

say sqrt(25)   // 5.0
say PI         // 3.14159...`} language="javascript" />

      <h2>Aliased Imports</h2>
      <CodeBlock code={`import math as m
import string as str

say m.sqrt(9)
say str.upper("akro")`} language="javascript" />

      <h2>Local Imports</h2>
      <CodeBlock code={`// Import from local file
import { greet } from "./utils"
import config from "./config"

say greet("World")
say config.port`} language="javascript" />

      <h2>Exporting</h2>
      <CodeBlock code={`// utils.akro
export fn greet(name) {
  return "Hello, {name}!"
}

export const VERSION := "1.0.0"

export struct Config {
  host: string
  port: int
}`} language="javascript" />
    </div>
  )
}
