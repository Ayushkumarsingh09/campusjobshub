# Push schema + seed production Supabase (run from project root)
$ErrorActionPreference = "Stop"

if (-not $env:DATABASE_URL -or -not $env:DIRECT_URL) {
  Write-Host "Set production DB URLs first:" -ForegroundColor Red
  Write-Host '  $env:DATABASE_URL = "postgresql://...pooler...:6543/postgres?pgbouncer=true"' -ForegroundColor Yellow
  Write-Host '  $env:DIRECT_URL   = "postgresql://...:5432/postgres"' -ForegroundColor Yellow
  exit 1
}

if ($env:DATABASE_URL -notmatch 'pgbouncer=true') {
  Write-Host "WARNING: DATABASE_URL should include ?pgbouncer=true for Supabase pooler (port 6543)" -ForegroundColor Yellow
}

Write-Host "Pushing schema to production..." -ForegroundColor Cyan
npm run db:push
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Seeding production data..." -ForegroundColor Cyan
npm run db:seed
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Generating company logos..." -ForegroundColor Cyan
npm run logos:generate

Write-Host ""
Write-Host "Done. Verify:" -ForegroundColor Green
Write-Host "  https://api.campusjobshub.com/api/v1/jobs?page=1&limit=3"
Write-Host "  https://api.campusjobshub.com/api/v1/companies?page=1&limit=3"
