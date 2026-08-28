$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Chunked Push"
$RepoRoot = "C:\Users\tanki\OneDrive\Desktop\AscensionOfAges-Sync"
Push-Location $RepoRoot

Write-Host "=== RESETTING REPO FOR CHUNKED PUSH ===" -ForegroundColor Cyan
Remove-Item -Path (Join-Path $RepoRoot ".git") -Recurse -Force
git init
git branch -M main
git remote add origin https://github.com/rds0645010/AscensionOfAges-Sync.git
git config http.postBuffer 2147483648
git config core.compression 0
git config http.version HTTP/1.1

# Step 1: Base & Server
Write-Host "`n[1/4] Коммит и отправка: Базовые файлы и Сервер..." -ForegroundColor Yellow
git add README.md .gitignore push_updates.bat update_client.bat scripts/ server/
git commit -m "Step 1: Core scripts and server files"
git push -u origin main -f

# Step 2: Client Configs & Assets
Write-Host "`n[2/4] Коммит и отправка: Конфиги и скрипты клиента..." -ForegroundColor Yellow
git add client/config/ client/defaultconfigs/ client/kubejs/ client/patchouli_books/ client/resourcepacks/ client/fancymenu_data/
git commit -m "Step 2: Client configs, KubeJS, and assets"
git push -u origin main

# Step 3: Client Mods (A - M)
Write-Host "`n[3/4] Коммит и отправка: Моды клиента (A - M)..." -ForegroundColor Yellow
$aToM = Get-ChildItem "client/mods" | Where-Object { $_.Name -match "^[a-mA-M0-9_]" }
foreach ($file in $aToM) {
    git add $file.FullName
}
git commit -m "Step 3: Client mods (A - M)"
git push -u origin main

# Step 4: Client Mods (N - Z)
Write-Host "`n[4/4] Коммит и отправка: Моды клиента (N - Z)..." -ForegroundColor Yellow
git add client/mods/
git commit -m "Step 4: Client mods (N - Z)"
git push -u origin main

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   ВСЕ ФАЙЛЫ УСПЕШНО ЗАГРУЖЕНЫ НА GITHUB!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Pop-Location

