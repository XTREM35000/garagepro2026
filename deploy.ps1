param(
    [switch]$Prod
)

Write-Host "=== Deployment script started ==="

# 1. Check Vercel CLI
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Vercel CLI is not installed."
    Write-Host "Run: npm install -g vercel"
    exit 1
}

# 2. Check .vercel binding
if (-not (Test-Path ".vercel")) {
    Write-Host "ERROR: This project is not linked to Vercel."
    Write-Host "Run: vercel link"
    exit 1
}

# 3. Build the project
Write-Host "Building Next.js project (npm run build)..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed. Deployment aborted."
    exit 1
}

# 4. Deploy
if ($Prod) {
    Write-Host "Deploying to PRODUCTION..."
    vercel --prod
} else {
    Write-Host "Deploying to PREVIEW..."
    vercel
}

Write-Host "=== Deployment completed successfully ==="
