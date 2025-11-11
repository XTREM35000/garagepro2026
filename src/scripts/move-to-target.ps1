<#
Move the current project folder to C:\axe\saas-manager (mirror copy).
Usage (PowerShell, run from repository root):
  .\scripts\move-to-target.ps1

The script uses robocopy (built-in on Windows) to mirror the current directory to the destination.
It excludes common heavy/OS-specific folders: node_modules, .git, .venv, dist, .next
#>
param(
  [string]$Destination = 'C:\axe\saas-manager',
  [switch]$Really = $false
)

if (-not (Get-Command robocopy -ErrorAction SilentlyContinue)) {
  Write-Error "robocopy not found on this system. robocopy is required."
  exit 1
}

$pwdPath = (Get-Location).Path
Write-Host "Source: $pwdPath"
Write-Host "Destination: $Destination"

if (-not $Really) {
  Write-Host "This will copy the current project to the destination (mirror)."
  Write-Host "Run the script with -Really to perform the operation (e.g. .\scripts\move-to-target.ps1 -Really)."
  exit 0
}

# Create destination folder if missing
if (-not (Test-Path $Destination)) {
  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

# Build exclude directories list
$excludeDirs = @('node_modules', '.git', '.venv', '.next', 'dist')
$excludeArgs = @()
foreach ($d in $excludeDirs) { $excludeArgs += '/XD'; $excludeArgs += $d }

# Mirror copy with robocopy
# /MIR mirrors, /Z copy in restartable mode, /R:2 retry twice, /W:2 wait 2s between retries, /NFL /NDL reduce log
$robocopyCmd = @('robocopy', '"' + $pwdPath + '"', '"' + $Destination + '"', '/MIR', '/Z', '/R:2', '/W:2', '/NFL', '/NDL') + $excludeArgs

Write-Host "Running: $($robocopyCmd -join ' ')"
$proc = Start-Process -FilePath robocopy -ArgumentList $robocopyCmd[1..($robocopyCmd.Length-1)] -NoNewWindow -Wait -PassThru

if ($proc.ExitCode -ge 8) {
  Write-Error "robocopy failed with exit code $($proc.ExitCode). See robocopy docs for exit codes."
  exit $proc.ExitCode
}

Write-Host "Copy completed. Destination is $Destination"
Write-Host "If you want to remove the source files afterwards, review the destination first then delete manually."
