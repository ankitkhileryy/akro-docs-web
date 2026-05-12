import CodeBlock from '../../components/CodeBlock'

export default function Stdlib() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Standard Library / Built-ins</div>
      <h1>Standard Library</h1>

      <h2>Built-in Functions</h2>
      <CodeBlock code={`// Output
say "Hello"          // print with newline
print "no newline"   // print without newline

// Type conversion
int("42")     // 42
float("3.14") // 3.14
str(42)       // "42"
bool(1)       // true

// Type checking
type(42)      // "int"
type("hi")    // "string"
type([])      // "array"

// Length
len("hello")  // 5
len([1,2,3])  // 3
len({a:1})    // 1`} language="javascript" />

      <h2 id="math">Math</h2>
      <CodeBlock code={`import math

math.sqrt(16)      // 4.0
math.pow(2, 10)    // 1024.0
math.abs(-5)       // 5
math.floor(3.7)    // 3
math.ceil(3.2)     // 4
math.round(3.5)    // 4
math.min(3, 1, 4)  // 1
math.max(3, 1, 4)  // 4
math.PI            // 3.14159265...
math.E             // 2.71828...
math.sin(0)        // 0.0
math.cos(0)        // 1.0
math.log(math.E)   // 1.0
math.rand()        // random float 0..1
math.rand(1, 100)  // random int 1..100`} language="javascript" />

      <h2 id="string">String</h2>
      <CodeBlock code={`import string

s := "Hello, World!"

string.upper(s)          // "HELLO, WORLD!"
string.lower(s)          // "hello, world!"
string.trim("  hi  ")    // "hi"
string.split(s, ", ")    // ["Hello", "World!"]
string.join(["a","b"], "-") // "a-b"
string.replace(s, "World", "Akro")  // "Hello, Akro!"
string.contains(s, "World")  // true
string.starts_with(s, "Hello")  // true
string.ends_with(s, "!")  // true
string.len(s)            // 13
string.reverse(s)        // "!dlroW ,olleH"
string.repeat("ab", 3)  // "ababab"`} language="javascript" />

      <h2 id="array">Array</h2>
      <CodeBlock code={`nums := [3, 1, 4, 1, 5, 9]

len(nums)                          // 6
sum(nums)                          // 23
min(nums)                          // 1
max(nums)                          // 9
sort(nums)                         // [1, 1, 3, 4, 5, 9]
reverse(nums)                      // [9, 5, 4, 1, 3, 1] (wait, reversed)
map(nums, fn(x) { return x * 2 }) // [6, 2, 8, 2, 10, 18]
filter(nums, fn(x) { return x > 3 }) // [4, 5, 9]
reduce(nums, fn(a,b) { return a+b }, 0) // 23
contains(nums, 5)                  // true
range(5)                           // [0, 1, 2, 3, 4]
range(1, 6)                        // [1, 2, 3, 4, 5]`} language="javascript" />

      <h2 id="io">IO</h2>
      <CodeBlock code={`import io

// Read from stdin
name := io.input("Enter your name: ")
say "Hello, {name}!"

// File operations
content := io.read_file("data.txt")
io.write_file("output.txt", "Hello!")
io.append_file("log.txt", "New entry\n")

// Check if file exists
if io.exists("config.json") {
  config := io.read_file("config.json")
}`} language="javascript" />
    </div>
  )
}
