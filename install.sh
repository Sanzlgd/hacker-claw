#!/bin/bash

# ============================================================
#  🦞 Hacker Claw — One-Line Installer (Linux / macOS / WSL)
# ============================================================

REPO_URL="https://github.com/Sanzlgd/hacker-claw.git"
INSTALL_DIR="$HOME/.hacker-claw"

echo ""
echo "🦞 Installing Hacker Claw..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# --- Check Node.js ---
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "  → Install it from: https://nodejs.org"
    exit 1
fi

echo "[✓] Node.js found: $(node --version)"

# --- Check npm ---
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed. Please re-install Node.js."
    exit 1
fi

# --- Check git ---
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed."
    echo "  → Install it from: https://git-scm.com"
    exit 1
fi

echo "[✓] npm found: $(npm --version)"
echo "[✓] git found: $(git --version)"
echo ""

# --- Clone or update repo ---
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "[*] Hacker Claw already cloned. Pulling latest changes..."
    git -C "$INSTALL_DIR" pull
else
    echo "[*] Cloning repository to $INSTALL_DIR..."
    git clone "$REPO_URL" "$INSTALL_DIR"
fi

echo ""
echo "[*] Installing dependencies..."
npm install --prefix "$INSTALL_DIR" --silent

echo "[*] Linking CLI globally (may require sudo on some systems)..."
npm link --prefix "$INSTALL_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🦞 Hacker Claw installed! Type 'hacker-claw' to begin."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
