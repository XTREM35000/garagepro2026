Write-Host "=== Starting FAST DEPLOY (no local build) ==="

# Check Vercel CLI
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Vercel CLI is not installed."
    exit 1
}

# Check .vercel
if (-not (Test-Path ".vercel")) {
    Write-Host "ERROR: Project is not linked. Run: vercel link"
    exit 1
}

Write-Host "Deploying without local build..."
vercel --prebuilt

Write-Host "=== FAST deployment completed ==="
