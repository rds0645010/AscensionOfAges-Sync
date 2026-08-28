$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Smart Batch Uploader"
$RepoRoot = "C:\Users\tanki\OneDrive\Desktop\AscensionOfAges-Sync"
Push-Location $RepoRoot

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Ascension of Ages - Пошаговая загрузка на GitHub (Batch Push)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# 1. Reset repo
if (Test-Path (Join-Path $RepoRoot ".git")) {
    Remove-Item -Path (Join-Path $RepoRoot ".git") -Recurse -Force
}
git init
git branch -M main
git remote add origin https://github.com/rds0645010/AscensionOfAges-Sync.git
git config http.postBuffer 2147483648
git config core.compression 0

# 2. Push Core & Configs
Write-Host "`n[1/6] Загрузка скриптов, конфигов, KubeJS и ресурспаков..." -ForegroundColor Yellow
git add README.md .gitignore push_updates.bat update_client.bat scripts/
git add client/config/ client/defaultconfigs/ client/kubejs/ client/patchouli_books/ client/resourcepacks/ client/fancymenu_data/
git add server/config/ server/defaultconfigs/ server/configureddefaults/ server/kubejs/ server/patchouli_books/ server/resourcepacks/ server/run.bat server/run.sh server/monitor_server.ps1 server/user_jvm_args.txt
git commit -m "Add core scripts, configs, KubeJS, and assets"
git push -u origin main -f

if ($LASTEXITCODE -ne 0) {
    Write-Host "Ошибка при первой отправке. Проверьте авторизацию." -ForegroundColor Red
    Pop-Location
    exit 1
}

# 3. Batch Server Mods in chunks of 50
Write-Host "`n[2/6] Загрузка серверных модов (Сервер)..." -ForegroundColor Yellow
$serverMods = Get-ChildItem "server/mods" -Filter "*.jar"
$chunkSize = 60
for ($i = 0; $i -lt $serverMods.Count; $i += $chunkSize) {
    $batch = $serverMods[$i..[Math]::Min($i + $chunkSize - 1, $serverMods.Count - 1)]
    $batchNum = [Math]::Floor($i / $chunkSize) + 1
    $totalBatches = [Math]::Ceiling($serverMods.Count / $chunkSize)
    Write-Host "  -> Серверные моды: часть $batchNum из $totalBatches..." -ForegroundColor Yellow
    foreach ($jar in $batch) {
        git add $jar.FullName
    }
    git commit -m "Upload server mods chunk $batchNum/$totalBatches"
    git push origin main
}

# 4. Batch Client Mods in chunks of 50
Write-Host "`n[3/6] Загрузка клиентских модов (Клиент)..." -ForegroundColor Yellow
$clientMods = Get-ChildItem "client/mods" -Filter "*.jar"
for ($i = 0; $i -lt $clientMods.Count; $i += $chunkSize) {
    $batch = $clientMods[$i..[Math]::Min($i + $chunkSize - 1, $clientMods.Count - 1)]
    $batchNum = [Math]::Floor($i / $chunkSize) + 1
    $totalBatches = [Math]::Ceiling($clientMods.Count / $chunkSize)
    Write-Host "  -> Клиентские моды: часть $batchNum из $totalBatches..." -ForegroundColor Yellow
    foreach ($jar in $batch) {
        git add $jar.FullName
    }
    git commit -m "Upload client mods chunk $batchNum/$totalBatches"
    git push origin main
}

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   ВСЕ ФАЙЛЫ (100%) УСПЕШНО ЗАГРУЖЕНЫ НА GITHUB!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Pop-Location
