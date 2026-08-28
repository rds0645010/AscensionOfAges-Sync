# Host Script: Sync Active Folders & Push to GitHub
$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Sync & Push to GitHub"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Ascension of Ages - Синхронизация и отправка на GitHub" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Test-Path (Join-Path $RepoRoot "client"))) {
    $RepoRoot = Split-Path -Parent $RepoRoot
}

$ClientSrc = "$env:APPDATA\.minecraft"
$ServerSrc = "C:\Users\tanki\OneDrive\Desktop\AscensionServer"

Write-Host "`n[1/3] Синхронизация локальных папок клиента и сервера в репозиторий..." -ForegroundColor Yellow

# 1. Sync Client
$clientFolders = @("mods", "config", "defaultconfigs", "kubejs", "patchouli_books", "resourcepacks", "fancymenu_data")
foreach ($folder in $clientFolders) {
    $src = Join-Path $ClientSrc $folder
    $dst = Join-Path $RepoRoot "client\$folder"
    if (Test-Path $src) {
        if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }
        robocopy $src $dst /MIR /R:1 /W:1 /NDL /NFL /NP /XD "logs" "crash-reports" "simplebackups" "world" | Out-Null
        Write-Host "  [+] Синхронизирован клиент: $folder" -ForegroundColor Green
    }
}

# 2. Sync Server
$serverFolders = @("mods", "config", "defaultconfigs", "configureddefaults", "kubejs", "patchouli_books", "resourcepacks")
foreach ($folder in $serverFolders) {
    $src = Join-Path $ServerSrc $folder
    $dst = Join-Path $RepoRoot "server\$folder"
    if (Test-Path $src) {
        if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst -Force | Out-Null }
        robocopy $src $dst /MIR /R:1 /W:1 /NDL /NFL /NP /XD "logs" "crash-reports" "simplebackups" "world" "tombstone" | Out-Null
        Write-Host "  [+] Синхронизирован сервер: $folder" -ForegroundColor Green
    }
}

# Copy scripts & configs
$serverFiles = @("user_jvm_args.txt", "run.bat", "run.sh", "monitor_server.ps1")
foreach ($file in $serverFiles) {
    $src = Join-Path $ServerSrc $file
    if (Test-Path $src) {
        Copy-Item -Path $src -Destination (Join-Path $RepoRoot "server\$file") -Force
    }
}

# 3. Git Commit & Push
Write-Host "`n[2/3] Подготовка коммита Git..." -ForegroundColor Yellow
Push-Location $RepoRoot
git add .
$status = git status --porcelain
if ($status) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Update modpack: $timestamp"
}

Write-Host "`n[3/3] Отправка на GitHub (git push -u origin main)..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nИзменения успешно отправлены на GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nОшибка при отправке. Проверьте окно авторизации GitHub." -ForegroundColor Red
}
Pop-Location

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   ГОТОВО!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
