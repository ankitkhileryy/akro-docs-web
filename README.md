# ⚡ Akro Programming Language

> A minimal, fast, web-ready programming language — named after its creator's initials **AK** (@ankitkhileryy).

[![License: MIT](https://img.shields.io/badge/License-MIT-7c6af7.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-v0.1.0--beta-4fc3f7.svg)](https://akro-lang.dev)
[![Made by](https://img.shields.io/badge/made%20by-ankitkhileryy-c792ea.svg)](https://github.com/ankitkhileryy)

---

## What is Akro?

Akro is an open-source programming language that combines:

- 🐍 **Python's** simplicity and readability
- ⚡ **Go's** speed and structure
- 🌐 **JavaScript's** web capabilities

The name **"Akro"** comes from the initials **AK** of its creator — **Ankit Bishnoi** ([@ankitkhileryy](https://github.com/ankitkhileryy)).

---

## Quick Look

```akro
fn main {
  name := "World"
  say "Hello, {name}!"

  nums := [1, 2, 3, 4, 5]
  total := reduce(nums, fn(a, b) {
    return a + b
  }, 0)

  say "Sum = {total}"
}
```

---

## Try It Now

**No install needed** — run Akro in your browser:

👉 **[akro-lang.dev/playground](https://akro-lang.dev/playground)**

---

## Features

| Feature | Example |
|---------|---------|
| Variable declaration | `name := "Akro"` |
| Type inference | automatic |
| String interpolation | `"Hello, {name}!"` |
| Pattern matching | `match score { case 90..100 { "A" } }` |
| Functions | `fn add(a, b) { return a + b }` |
| Error handling | `try { ... } catch err { ... }` |
| Async/Await | `async fn fetch() { await ... }` |
| Built-ins | `map`, `filter`, `reduce`, `sort`, `len`, `range` + 40 more |

---

## Key Design Decisions

- `:=` for all variable declarations — no `var`, `let`, or `const` noise
- No semicolons required
- `say` instead of `print` — clean and minimal
- String interpolation supports full expressions: `"double is {x * 2}"`
- Pattern matching with range patterns: `case 80..89`

---

## Installation

```bash
# Coming soon — native installer
curl -fsSL https://akro-lang.dev/install.sh | sh

# Verify
akro --version
```

> Currently in **v0.1.0-beta** — browser interpreter available now, native compilation on roadmap.

---

## Roadmap

| Version | Feature | Status |
|---------|---------|--------|
| v0.1.0 | Browser interpreter | ✅ Done |
| v0.2.0 | Package manager & modules | 🔜 Planned |
| v0.3.0 | Native binary compilation | 🔜 Planned |
| v0.4.0 | VS Code extension + LSP | 🔜 Planned |
| v1.0.0 | Stable release | 🔜 Planned |

---

## Tech Stack

- **Interpreter** — TypeScript (~800 lines, zero dependencies)
- **Website** — React + Vite + Tailwind CSS
- **Playground** — Monaco-style editor with live execution

---

## Links

- 🌐 Website: [akro-lang.dev](https://akro-lang.dev)
- ▶️ Playground: [akro-lang.dev/playground](https://akro-lang.dev/playground)
- 📖 Docs: [akro-lang.dev/docs/introduction](https://akro-lang.dev/docs/introduction)
- 💬 GitHub: [github.com/ankitkhileryy](https://github.com/ankitkhileryy)

---

## Creator

**Ankit Bishnoi** ([@ankitkhileryy](https://github.com/ankitkhileryy))  
19 years old · India  
Skills: JavaScript, TypeScript, React, Python, HTML/CSS, MongoDB, SQL, Ethical Hacking

---

## License

MIT License — see [LICENSE](LICENSE) for details.

© 2026 Ankit Bishnoi (@ankitkhileryy)
