import CodeBlock from '../../components/CodeBlock'

export default function AsyncAwait() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Language Guide / Async/Await</div>
      <h1>Async / Await</h1>
      <p>Akro has first-class async support. Mark functions with <code>async</code> and use <code>await</code> to pause execution.</p>

      <h2>Basic Async Function</h2>
      <CodeBlock code={`async fn fetch_user(id) {
  response := await fetch("https://api.example.com/users/{id}")
  return await response.json()
}

async fn main {
  user := await fetch_user(1)
  say user.name
}`} language="javascript" />

      <h2>Parallel Execution</h2>
      <CodeBlock code={`async fn main {
  // Run both requests in parallel
  users, posts := await all([
    fetch_user(1),
    fetch_posts(1)
  ])
  say users.name
  say len(posts)
}`} language="javascript" />

      <h2>Async with Error Handling</h2>
      <CodeBlock code={`async fn get_data(url) {
  try {
    res := await fetch(url)
    if res.status != 200 {
      throw "HTTP {res.status}"
    }
    return await res.json()
  } catch err {
    say "Fetch failed: {err}"
    return nil
  }
}`} language="javascript" />

      <h2>Async Loops</h2>
      <CodeBlock code={`async fn main {
  ids := [1, 2, 3, 4, 5]
  for id in ids {
    user := await fetch_user(id)
    say user.name
  }
}`} language="javascript" />
    </div>
  )
}
