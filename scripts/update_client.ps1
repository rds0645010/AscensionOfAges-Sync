# Fast Delta Updater for Ascension of Ages Modpack
param (
    [string]$TargetMinecraftDir = "$env:APPDATA\.minecraft"
)

$Host.UI.RawUI.WindowTitle = "Ascension of Ages - Modpack Updater"
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   Ascension of Ages - Быстрое обновление сборки (Delta Sync)" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = if (Test-Path (Join-Path $ScriptDir "client")) { $ScriptDir } else { Split-Path -Parent $ScriptDir }
$ClientSource = Join-Path $RepoRoot "client"

# 1. Check for Git updates
if (Test-Path (Join-Path $RepoRoot ".git")) {
    Write-Host "`n[1/3] Проверка обновлений с GitHub (git pull)..." -ForegroundColor Yellow
    Push-Location $RepoRoot
    try {
        git pull --rebase
    } catch {
        Write-Host "Предупреждение: Не удалось выполнить git pull. Проверьте подключение к интернету." -ForegroundColor Red
    }
    Pop-Location
} else {
    Write-Host "`n[1/3] Папка .git не найдена, обновление локальных файлов..." -ForegroundColor Gray
}

# 2. Check Target Folder
Write-Host "`n[2/3] Целевая папка Minecraft: $TargetMinecraftDir" -ForegroundColor Yellow
if (-not (Test-Path $TargetMinecraftDir)) {
    Write-Host "Ошибка: Папка $TargetMinecraftDir не найдена!" -ForegroundColor Red
    Write-Host "Убедитесь, что Minecraft установлен, или передайте путь параметром." -ForegroundColor Yellow
    Pause
    exit 1
}

# 3. Perform Smart Delta Sync
Write-Host "`n[3/3] Синхронизация файлов сборки..." -ForegroundColor Yellow

$foldersToSync = @("mods", "config", "defaultconfigs", "kubejs", "patchouli_books", "resourcepacks", "fancymenu_data")
$updatedCount = 0
$deletedCount = 0
$skippedCount = 0
$totalBytesCopied = 0

# A. Clean deleted/obsolete mods in client mods folder
$srcModsDir = Join-Path $ClientSource "mods"
$dstModsDir = Join-Path $TargetMinecraftDir "mods"
if (Test-Path $srcModsDir -and Test-Path $dstModsDir) {
    $srcJars = Get-ChildItem -Path $srcModsDir -Filter "*.jar" | Select-Object -ExpandProperty Name
    $dstJars = Get-ChildItem -Path $dstModsDir -Filter "*.jar"
    foreach ($jar in $dstJars) {
        if ($srcJars -notcontains $jar.Name) {
            Write-Host "  [-] Удаление устаревшего мода: $($jar.Name)" -ForegroundColor Red
            Remove-Item -Path $jar.FullName -Force
            $deletedCount++
        }
    }
}

# B. Copy/Update changed files
foreach ($folder in $foldersToSync) {
    $srcFolder = Join-Path $ClientSource $folder
    $dstFolder = Join-Path $TargetMinecraftDir $folder
    if (-not (Test-Path $srcFolder)) { continue }
    if (-not (Test-Path $dstFolder)) { New-Item -ItemType Directory -Path $dstFolder -Force | Out-Null }

    $srcFiles = Get-ChildItem -Path $srcFolder -Recurse -File
    foreach ($file in $srcFiles) {
        $relPath = $file.FullName.Substring($srcFolder.Length + 1)
        $targetFile = Join-Path $dstFolder $relPath
        $targetDir = Split-Path -Parent $targetFile

        $needsCopy = $false
        if (-not (Test-Path $targetFile)) {
            $needsCopy = $true
        } else {
            $targetInfo = Get-Item $targetFile
            if ($file.Length -ne $targetInfo.Length -or $file.LastWriteTime -gt $targetInfo.LastWriteTime.AddSeconds(2)) {
                $needsCopy = $true
            }
        }

        if ($needsCopy) {
            if (-not (Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force | Out-Null }
            Copy-Item -Path $file.FullName -Destination $targetFile -Force
            $updatedCount++
            $totalBytesCopied += $file.Length
            Write-Host "  [+] Обновлен: $relPath" -ForegroundColor Green
        } else {
            $skippedCount++
        }
    }
}

$mbCopied = [Math]::Round($totalBytesCopied / 1MB, 2)

Write-Host "`n================================================================" -ForegroundColor Green
Write-Host "   СИНХРОНИЗАЦИЯ УСПЕШНО ЗАВЕРШЕНА!" -ForegroundColor Green
Write-Host "   Файлов обновлено/добавлено : $updatedCount ($mbCopied MB)" -ForegroundColor White
Write-Host "   Удалено старых файлов      : $deletedCount" -ForegroundColor White
Write-Host "   Пропущено (без изменений)  : $skippedCount" -ForegroundColor Gray
Write-Host "================================================================" -ForegroundColor Green
Write-Host "Приятной игры в Ascension of Ages!" -ForegroundColor Cyan
