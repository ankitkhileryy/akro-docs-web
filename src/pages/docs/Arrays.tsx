import CodeBlock from '../../components/CodeBlock'

export default function Arrays() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Arrays</div>
      <h1>Arrays</h1>

      <h2>Creating Arrays</h2>
      <CodeBlock code={`nums := [1, 2, 3, 4, 5]
names := ["Alice", "Bob", "Carol"]
mixed := [1, "two", true, nil]
empty := []`} language="javascript" />

      <h2>Accessing Elements</h2>
      <CodeBlock code={`nums := [10, 20, 30, 40, 50]
say nums[0]   // 10
say nums[-1]  // 50 (last element)
say nums[1..3]  // [20, 30] (slice)`} language="javascript" />

      <h2>Modifying Arrays</h2>
      <CodeBlock code={`mut nums := [1, 2, 3]
nums.push(4)       // [1, 2, 3, 4]
nums.pop()         // [1, 2, 3]
nums.insert(1, 99) // [1, 99, 2, 3]
nums.remove(1)     // [1, 2, 3]`} language="javascript" />

      <h2>Built-in Array Functions</h2>
      <CodeBlock code={`nums := [3, 1, 4, 1, 5, 9, 2, 6]

// map — transform each element
doubled := map(nums, fn(x) { return x * 2 })

// filter — keep matching elements
evens := filter(nums, fn(x) { return x % 2 == 0 })

// reduce — fold to single value
total := reduce(nums, fn(a, b) { return a + b }, 0)

// sort
sorted := sort(nums)

// reverse
rev := reverse(nums)

say len(nums)    // 8
say sum(nums)    // 31
say min(nums)    // 1
say max(nums)    // 9`} language="javascript" />

      <h2>Spread Operator</h2>
      <CodeBlock code={`a := [1, 2, 3]
b := [4, 5, 6]
combined := [...a, ...b]  // [1, 2, 3, 4, 5, 6]`} language="javascript" />
    </div>
  )
}
