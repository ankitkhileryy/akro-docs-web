import CodeBlock from '../../components/CodeBlock'

export default function Web() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Web Development / Web Overview</div>
      <h1>Web Development</h1>
      <p>Akro compiles to WebAssembly and has built-in bindings for browser APIs.</p>

      <h2 id="dom">DOM Manipulation</h2>
      <CodeBlock code={`import web

fn main {
  // Get element
  btn := web.get_element("my-button")

  // Set text
  btn.text = "Click me!"

  // Add event listener
  btn.on("click", fn(event) {
    say "Button clicked!"
    btn.text = "Clicked!"
  })

  // Create element
  div := web.create("div")
  div.class = "card"
  div.text = "Hello from Akro!"
  web.body.append(div)
}`} language="javascript" />

      <h2 id="fetch">Fetch API</h2>
      <CodeBlock code={`import web

async fn load_users() {
  try {
    res := await web.fetch("https://jsonplaceholder.typicode.com/users")
    users := await res.json()
    for user in users {
      say "{user.name} — {user.email}"
    }
  } catch err {
    say "Error: {err}"
  }
}

async fn post_data(data) {
  res := await web.fetch("https://api.example.com/data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: json.stringify(data)
  })
  return await res.json()
}`} language="javascript" />

      <h2 id="example">Example App</h2>
      <CodeBlock code={`import web

struct Todo {
  id: int
  text: string
  done: bool
}

mut todos := []
mut next_id := 1

fn render() {
  list := web.get_element("todo-list")
  list.clear()
  for todo in todos {
    item := web.create("li")
    item.text = todo.text
    if todo.done { item.class = "done" }
    item.on("click", fn() {
      todo.done = not todo.done
      render()
    })
    list.append(item)
  }
}

fn main {
  input := web.get_element("todo-input")
  btn := web.get_element("add-btn")

  btn.on("click", fn() {
    text := input.value.trim()
    if len(text) > 0 {
      todos.push(Todo { id: next_id, text: text, done: false })
      next_id = next_id + 1
      input.value = ""
      render()
    }
  })
}`} language="javascript" />
    </div>
  )
}
