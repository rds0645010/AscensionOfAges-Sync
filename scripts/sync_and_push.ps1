# Ultra Fast Host Sync & Push
$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Fast Push to GitHub"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Ascension of Ages - Сверхбыстрая отправка на GitHub" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $RepoRoot "client"))) { $RepoRoot = Split-Path -Parent $RepoRoot }

$ClientSrc = "$env:APPDATA\.minecraft"
$ServerSrc = "C:\Users\tanki\OneDrive\Desktop\AscensionServer"

Write-Host "`n[1/3] Быстрая синхронизация локальных файлов (16 потоков)..." -ForegroundColor Yellow

$clientFolders = @("mods", "config", "defaultconfigs", "kubejs", "patchouli_books", "resourcepacks", "fancymenu_data")
foreach ($folder in $clientFolders) {
    $src = Join-Path $ClientSrc $folder
    $dst = Join-Path $RepoRoot "client\$folder"
    if (Test-Path $src) {
        robocopy $src $dst /MIR /FFT /R:1 /W:1 /NDL /NFL /NJH /NJS /MT:16 /XD "logs" "crash-reports" "simplebackups" "world" | Out-Null
    }
}

$serverFolders = @("mods", "config", "defaultconfigs", "configureddefaults", "kubejs", "patchouli_books", "resourcepacks")
foreach ($folder in $serverFolders) {
    $src = Join-Path $ServerSrc $folder
    $dst = Join-Path $RepoRoot "server\$folder"
    if (Test-Path $src) {
        robocopy $src $dst /MIR /FFT /R:1 /W:1 /NDL /NFL /NJH /NJS /MT:16 /XD "logs" "crash-reports" "simplebackups" "world" "tombstone" | Out-Null
    }
}

$serverFiles = @("user_jvm_args.txt", "run.bat", "run.sh", "monitor_server.ps1")
foreach ($file in $serverFiles) {
    $src = Join-Path $ServerSrc $file
    if (Test-Path $src) { Copy-Item -Path $src -Destination (Join-Path $RepoRoot "server\$file") -Force }
}

Write-Host "[2/3] Проверка изменений Git..." -ForegroundColor Yellow
Push-Location $RepoRoot
git add .
$status = git status --porcelain

if (-not $status) {
    Write-Host "Все файлы уже синхронизированы! Изменений нет." -ForegroundColor Green
} else {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Update: $timestamp"
    Write-Host "[3/3] Отправка обновлений на GitHub..." -ForegroundColor Yellow
    git push origin main
    Write-Host "Успешно отправлено на GitHub!" -ForegroundColor Green
}
Pop-Location

$sw.Stop()
$sec = [Math]::Round($sw.ElapsedMilliseconds / 1000, 2)
Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   ГОТОВО ЗА $sec СЕК!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
