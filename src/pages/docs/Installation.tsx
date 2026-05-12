import CodeBlock from '../../components/CodeBlock'

export default function Installation() {
  return (
    <div className="prose">
      <div className="text-xs text-[#555] mb-4">Getting Started / Installation</div>
      <h1>Installation</h1>
      <p>
        Akro can be installed on Windows, macOS, and Linux. Choose the method that works best for you.
      </p>

      <h2>Windows</h2>
      <p>Run the following command in PowerShell:</p>
      <CodeBlock code={`curl -L https://akro-lang.dev/install.ps1 | powershell`} language="bash" />
      <p>Or download the installer from the <a href="https://github.com">releases page</a>.</p>

      <h2>macOS</h2>
      <CodeBlock code={`# Using Homebrew
brew install akro-lang/tap/akro

# Or using the install script
curl -fsSL https://akro-lang.dev/install.sh | bash`} language="bash" />

      <h2>Linux</h2>
      <CodeBlock code={`# Debian/Ubuntu
curl -fsSL https://akro-lang.dev/install.sh | bash

# Arch Linux (AUR)
yay -S akro-lang

# From tarball
wget https://akro-lang.dev/releases/akro-linux-x64.tar.gz
tar -xzf akro-linux-x64.tar.gz
sudo mv akro /usr/local/bin/`} language="bash" />

      <h2>From Source</h2>
      <p>To build Akro from source, you'll need Rust 1.75+ installed.</p>
      <CodeBlock code={`git clone https://github.com/akro-lang/akro
cd akro
cargo build --release
sudo cp target/release/akro /usr/local/bin/`} language="bash" />

      <h2>Verify Installation</h2>
      <CodeBlock code={`akro --version
# akro v0.1.0-beta (2026-01-01)`} language="bash" />

      <h2>Editor Support</h2>
      <p>Akro has extensions for popular editors:</p>
      <ul>
        <li><strong>VS Code</strong> — Search "Akro Language" in the marketplace</li>
        <li><strong>Neovim</strong> — Available via <code>nvim-treesitter</code></li>
        <li><strong>JetBrains IDEs</strong> — Plugin available in the marketplace</li>
      </ul>

      <h2>Updating Akro</h2>
      <CodeBlock code={`akro self-update`} language="bash" />
    </div>
  )
}
