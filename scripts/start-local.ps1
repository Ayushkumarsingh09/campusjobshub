# Start CampusJobsHub locally (Docker DB + API + frontend)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

Write-Host "CampusJobsHub — Local Start" -ForegroundColor Cyan

# Ensure STATIC_EXPORT does not leak into dev
Remove-Item Env:STATIC_EXPORT -ErrorAction SilentlyContinue

# Start Docker Desktop if not running
$dockerOk = $false
try {
  docker info 2>$null | Out-Null
  $dockerOk = $true
} catch {
  $dockerExe = "${env:ProgramFiles}\Docker\Docker\Docker Desktop.exe"
  if (Test-Path $dockerExe) {
    Write-Host "Starting Docker Desktop..." -ForegroundColor Yellow
    Start-Process $dockerExe
    $retries = 0
    while ($retries -lt 30) {
      Start-Sleep -Seconds 4
      try { docker info 2>$null | Out-Null; $dockerOk = $true; break } catch { $retries++ }
    }
  }
}

if ($dockerOk) {
  Write-Host "Starting Postgres..." -ForegroundColor Green
  docker compose up -d
  Start-Sleep -Seconds 5
  npm run db:push
  npm run db:seed
} else {
  Write-Host "WARNING: Docker not running — API will return 500 until DB is available." -ForegroundColor Red
  Write-Host "  Start Docker Desktop, then run: docker compose up -d && npm run db:seed" -ForegroundColor Yellow
}

Write-Host "Starting dev servers (http://localhost:3000 + http://localhost:4000)..." -ForegroundColor Green
npm run dev
