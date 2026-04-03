# ============================================================
#  🦞 Hacker Claw — One-Line Installer (Windows PowerShell)
# ============================================================

$REPO_URL  = "https://github.com/SanzIgd/hacker-claw.git"
$INSTALL_DIR = "$HOME\.hacker-claw"

Write-Host ""
Write-Host "🦞 Installing Hacker Claw..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray

# --- Check Node.js ---
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed." -ForegroundColor Red
    Write-Host "  → Install it from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "[✓] Node.js found: $(node --version)" -ForegroundColor Green

# --- Check npm ---
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is not installed. Please re-install Node.js." -ForegroundColor Red
    exit 1
}
Write-Host "[✓] npm found: $(npm --version)" -ForegroundColor Green

# --- Check git ---
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed." -ForegroundColor Red
    Write-Host "  → Install it from: https://git-scm.com" -ForegroundColor Yellow
    exit 1
}
Write-Host "[✓] git found" -ForegroundColor Green
Write-Host ""

# --- Clone or update repo ---
if (Test-Path "$INSTALL_DIR\.git") {
    Write-Host "[*] Hacker Claw already cloned. Pulling latest changes..." -ForegroundColor Cyan
    git -C $INSTALL_DIR pull
} else {
    Write-Host "[*] Cloning repository to $INSTALL_DIR..." -ForegroundColor Cyan
    git clone $REPO_URL $INSTALL_DIR
}

Write-Host ""
Write-Host "[*] Installing dependencies..." -ForegroundColor Cyan
npm install --prefix $INSTALL_DIR --silent

Write-Host "[*] Linking CLI globally..." -ForegroundColor Cyan
npm link --prefix $INSTALL_DIR

# --- Ensure npm global bin is in PATH ---
$npmGlobalBin = (npm bin -g 2>$null)
if (!$npmGlobalBin) {
    # Fallback for newer npm versions
    $npmGlobalBin = "$env:APPDATA\npm"
}

$currentPath = [System.Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$npmGlobalBin*") {
    Write-Host ""
    Write-Host "[*] Adding npm global bin to your PATH: $npmGlobalBin" -ForegroundColor Yellow
    [System.Environment]::SetEnvironmentVariable(
        "PATH",
        "$currentPath;$npmGlobalBin",
        "User"
    )
    # Also update current session
    $env:PATH = "$env:PATH;$npmGlobalBin"
    Write-Host "[✓] PATH updated. Restart your terminal to apply." -ForegroundColor Green
} else {
    Write-Host "[✓] npm global bin already in PATH." -ForegroundColor Green
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "🦞 Hacker Claw installed! Type 'hacker-claw' to begin." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
