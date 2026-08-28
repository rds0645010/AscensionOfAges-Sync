# Ultra Fast Delta Updater for Friends
param (
    [string]$TargetMinecraftDir = "$env:APPDATA\.minecraft"
)

$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Fast Updater"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Ascension of Ages - Сверхбыстрое обновление (Delta Sync)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$sw = [System.Diagnostics.Stopwatch]::StartNew()
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = if (Test-Path (Join-Path $ScriptDir "client")) { $ScriptDir } else { Split-Path -Parent $ScriptDir }
$ClientSource = Join-Path $RepoRoot "client"

# 1. Fast Git Pull
if (Test-Path (Join-Path $RepoRoot ".git")) {
    Write-Host "`n[1/2] Проверка обновлений с GitHub (git pull)..." -ForegroundColor Yellow
    Push-Location $RepoRoot
    try {
        git pull --rebase --autostash
    } catch {
        Write-Host "Предупреждение: Не удалось проверить GitHub. Проверьте интернет." -ForegroundColor Red
    }
    Pop-Location
}

# 2. Check Target Folder
if (-not (Test-Path $TargetMinecraftDir)) {
    Write-Host "Ошибка: Папка $TargetMinecraftDir не найдена!" -ForegroundColor Red
    Pause
    exit 1
}

# 3. 16-Thread Native Fast Delta Sync
Write-Host "`n[2/2] Синхронизация файлов игры (16 потоков)..." -ForegroundColor Yellow

$foldersToSync = @("mods", "config", "defaultconfigs", "kubejs", "patchouli_books", "resourcepacks", "fancymenu_data")
foreach ($folder in $foldersToSync) {
    $src = Join-Path $ClientSource $folder
    $dst = Join-Path $TargetMinecraftDir $folder
    if (Test-Path $src) {
        robocopy $src $dst /MIR /FFT /R:1 /W:1 /NDL /NFL /NJH /NJS /MT:16 | Out-Null
    }
}

$sw.Stop()
$sec = [Math]::Round($sw.ElapsedMilliseconds / 1000, 2)
$modCount = (Get-ChildItem (Join-Path $TargetMinecraftDir "mods") -Filter "*.jar" -ErrorAction SilentlyContinue).Count
$repoModCount = (Get-ChildItem (Join-Path $ClientSource "mods") -Filter "*.jar" -ErrorAction SilentlyContinue).Count

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   СИНХРОНИЗАЦИЯ УСПЕШНО ЗАВЕРШЕНА ЗА $sec СЕК!" -ForegroundColor Green
Write-Host "   Модов в игре: $modCount (в репозитории: $repoModCount)" -ForegroundColor White
Write-Host "   Все конфиги, KubeJS и текстуры синхронизированы 1 к 1." -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Green
Write-Host "Приятной игры!" -ForegroundColor Cyan
