import CodeBlock from '../../components/CodeBlock'

export default function Cli() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Tools / CLI Reference</div>
      <h1>CLI Reference</h1>

      <h2>Commands</h2>
      <CodeBlock code={`akro new <name>      # Create new project
akro run             # Run current project
akro build           # Build for production
akro build --release # Optimized release build
akro check           # Type-check without running
akro fmt             # Format all .akro files
akro lint            # Lint the project
akro test            # Run tests
akro add <package>   # Add a dependency
akro remove <pkg>    # Remove a dependency
akro self-update     # Update Akro itself`} language="bash" />

      <h2>akro run</h2>
      <CodeBlock code={`# Run main.akro
akro run

# Run specific file
akro run src/server.akro

# Pass arguments
akro run -- --port 8080

# Watch mode (re-run on save)
akro run --watch`} language="bash" />

      <h2>akro build</h2>
      <CodeBlock code={`# Build native binary
akro build

# Build for WebAssembly
akro build --target wasm

# Build with optimizations
akro build --release

# Output to specific directory
akro build --out ./dist`} language="bash" />

      <h2 id="repl">REPL</h2>
      <p>The Akro REPL lets you run code interactively:</p>
      <CodeBlock code={`akro repl

# Inside REPL:
> x := 42
> say x * 2
84
> fn double(n) { return n * 2 }
> double(21)
42
> :help    # show commands
> :quit    # exit`} language="bash" />

      <h2 id="transpiler">Transpiler</h2>
      <p>Transpile Akro to JavaScript:</p>
      <CodeBlock code={`# Transpile to JavaScript
akro transpile src/main.akro

# Output to file
akro transpile src/main.akro --out dist/main.js

# Transpile entire project
akro transpile --all

# Watch and transpile
akro transpile --watch`} language="bash" />

      <h2>akro.toml</h2>
      <p>Project configuration file:</p>
      <CodeBlock code={`[package]
name = "my-app"
version = "0.1.0"
author = "ST"

[build]
target = "native"   # native | wasm | js
entry = "src/main.akro"
out = "dist"

[dependencies]
http = "1.0.0"
json = "2.1.0"`} language="toml" />
    </div>
  )
}
