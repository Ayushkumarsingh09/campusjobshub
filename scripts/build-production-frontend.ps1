# Build static frontend for Hostinger deployment
# Usage: .\scripts\build-production-frontend.ps1

param(
  [string]$SiteUrl = "https://campusjobshub.com",
  [string]$ApiUrl = "https://api.campusjobshub.com",
  [string]$AuthSecret = $env:AUTH_SECRET
)

if (-not $AuthSecret) {
  Write-Host "ERROR: Set AUTH_SECRET first:" -ForegroundColor Red
  Write-Host '  $env:AUTH_SECRET = "your-32-char-secret"' -ForegroundColor Yellow
  exit 1
}

if ($ApiUrl -match 'localhost') {
  Write-Host "ERROR: ApiUrl must be your production API, not localhost." -ForegroundColor Red
  exit 1
}

$root = Split-Path $PSScriptRoot -Parent
Set-Location (Join-Path $root "frontend")

$env:STATIC_EXPORT = "true"
$env:NODE_ENV = "production"
$env:NEXT_PUBLIC_SITE_URL = $SiteUrl
$env:NEXT_PUBLIC_API_URL = $ApiUrl
$env:NEXT_PUBLIC_ENABLE_ADS = "false"
$env:AUTH_SECRET = $AuthSecret
$env:NEXTAUTH_SECRET = $AuthSecret
$env:NEXTAUTH_URL = $SiteUrl

Write-Host "Warming production API (cold start)..." -ForegroundColor Cyan
for ($i = 1; $i -le 5; $i++) {
  try {
    $health = Invoke-RestMethod -Uri "$ApiUrl/api/v1/health" -TimeoutSec 60
    if ($health.success) {
      Write-Host "  API ready (attempt $i)" -ForegroundColor Green
      break
    }
  } catch {
    Write-Host "  Attempt $i failed - retrying in 10s..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
  }
}

Write-Host "Building static export..." -ForegroundColor Cyan
Write-Host "  SITE: $SiteUrl"
Write-Host "  API:  $ApiUrl"

npm run build

if ($LASTEXITCODE -eq 0) {
  $out = Join-Path (Get-Location) "out"
  $localhostRefs = (Select-String -Path (Join-Path $out "**\*.js") -Pattern "localhost:4000" -ErrorAction SilentlyContinue).Count
  if ($localhostRefs -gt 0) {
    Write-Host "WARNING: $localhostRefs JS files still reference localhost:4000" -ForegroundColor Yellow
  }
  $logosDir = Join-Path $out "logos"
  if (-not (Test-Path $logosDir)) {
    Write-Host "WARNING: logos/ folder missing from out/ - company images will break" -ForegroundColor Yellow
  } else {
    $logoCount = (Get-ChildItem $logosDir -Filter "*.svg").Count
    Write-Host "  logos/: $logoCount SVG files" -ForegroundColor Green
  }
  $keyPages = @(
    "companies\capgemini\index.html",
    "internships\internship-000-software-development-intern-google-bangalore-2026\index.html",
    "prepare\roadmaps\dsa-placement-roadmap\index.html",
    "jobs\job-004-frontend-developer-apple-chennai-2026\index.html"
  )
  foreach ($page in $keyPages) {
    $path = Join-Path $out $page
    if (Test-Path $path) {
      Write-Host "  OK: $page" -ForegroundColor Green
    } else {
      Write-Host "  MISSING: $page" -ForegroundColor Red
    }
  }
  Write-Host ""
  Write-Host "SUCCESS - upload ALL contents of frontend/out/ to Hostinger public_html" -ForegroundColor Green
  Write-Host "  Include: _next/, logos/, .htaccess, 404.html" -ForegroundColor Green
} else {
  Write-Host "BUILD FAILED" -ForegroundColor Red
  exit 1
}
