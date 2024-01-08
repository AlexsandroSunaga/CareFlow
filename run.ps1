$root = $PSScriptRoot
$uvicorn = Join-Path $root "backend\.venv\Scripts\uvicorn.exe"
if (-not (Test-Path $uvicorn)) {
  Write-Error "Missing backend venv. From backend/: python -m venv .venv; .\.venv\Scripts\pip install -r requirements.txt pymupdf; pip install bcrypt==4.2.1"
  exit 1
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; `$env:PYTHONPATH='src'; & '$uvicorn' src.main:backend_app --reload --port 8011"
Start-Sleep -Seconds 2
Set-Location "$root\web"
npm run dev
