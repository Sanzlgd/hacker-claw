# 🦞 Hacker Claw

> An elite, autonomous terminal-based AI research agent powered by Gemini & Node.js.  
> Streams markdown responses, executes deep investigations, and runs system commands — all from your terminal.

---

## ⚡ Fast Install

### Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/Sanzlgd/hacker-claw/main/install.ps1 | iex
```

### Linux / macOS / WSL (Bash)
```bash
curl -fsSL https://raw.githubusercontent.com/Sanzlgd/hacker-claw/main/install.sh | bash
```

> After installation, open a **new terminal** and type `hacker-claw` to begin.

---

## 🛠️ Manual Installation

```bash
git clone https://github.com/Sanzlgd/hacker-claw.git ~/.hacker-claw
cd ~/.hacker-claw
npm install
npm link
```

---

## 🚀 Usage

```bash
hacker-claw
```

**Commands inside the CLI:**

| Command | Action |
|---------|--------|
| `<any query>` | Run a deep AI research query |
| `clear` | Clear the terminal and reprint the header |
| `exit` | Shut down Hacker Claw |

---

## ✨ Features

- **Hacker UI** — Custom headers, status bars, and spinner animations
- **Secure Key Storage** — One-time Gemini API key prompt, stored locally with `conf`
- **Streaming Responses** — AI output is streamed character-by-character with syntax highlighting
- **Command Execution** — AI can suggest shell commands; you authorize before they run
- **Autonomous Core** — Strict system prompt keeps the AI analytical and concise

---

## 🔧 Requirements

- [Node.js](https://nodejs.org) v18+
- [Git](https://git-scm.com)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

---

## ⚙️ Powered By

`Node.js` · `@google/genai` · `Inquirer` · `Chalk` · `Ora` · `cli-highlight` · `conf`

---

## 📄 License

ISC © Sanzlgd
