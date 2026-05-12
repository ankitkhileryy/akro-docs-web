import CodeBlock from '../../components/CodeBlock'

export default function Functions() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Functions</div>
      <h1>Functions</h1>
      <p>
        Functions in Akro are first-class values. They can be passed as arguments,
        returned from other functions, and stored in variables.
      </p>

      <h2>Basic Functions</h2>
      <CodeBlock code={`fn greet(name) {
  return "Hello, {name}!"
}

fn add(a, b) {
  return a + b
}

say greet("World")  // Hello, World!
say add(3, 4)       // 7`} language="javascript" />

      <h2>Default Parameters</h2>
      <CodeBlock code={`fn greet(name, greeting = "Hello") {
  return "{greeting}, {name}!"
}

say greet("Alice")           // Hello, Alice!
say greet("Bob", "Hi")       // Hi, Bob!`} language="javascript" />

      <h2>Multiple Return Values</h2>
      <CodeBlock code={`fn min_max(nums) {
  return min(nums), max(nums)
}

lo, hi := min_max([3, 1, 4, 1, 5, 9])
say lo  // 1
say hi  // 9`} language="javascript" />

      <h2>Anonymous Functions</h2>
      <CodeBlock code={`// Inline lambda
double := fn(x) { return x * 2 }
say double(5)  // 10

// Passed as argument
nums := [1, 2, 3, 4, 5]
doubled := map(nums, fn(x) { return x * 2 })
say doubled  // [2, 4, 6, 8, 10]`} language="javascript" />

      <h2>Closures</h2>
      <CodeBlock code={`fn make_counter() {
  mut count := 0
  return fn() {
    count = count + 1
    return count
  }
}

counter := make_counter()
say counter()  // 1
say counter()  // 2
say counter()  // 3`} language="javascript" />

      <h2>Variadic Functions</h2>
      <CodeBlock code={`fn sum(...nums) {
  total := 0
  for n in nums {
    total = total + n
  }
  return total
}

say sum(1, 2, 3)        // 6
say sum(1, 2, 3, 4, 5)  // 15`} language="javascript" />

      <h2>Higher-Order Functions</h2>
      <CodeBlock code={`fn apply_twice(f, x) {
  return f(f(x))
}

double := fn(x) { return x * 2 }
say apply_twice(double, 3)  // 12`} language="javascript" />
    </div>
  )
}
