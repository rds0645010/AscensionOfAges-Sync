# Incident Monitor & Auto-Logger for Ascension of Ages Server
param (
    [switch]$Watch,
    [switch]$AnalyzeNow
)

$ServerDir = $PSScriptRoot
$LogsDir = Join-Path $ServerDir "logs"
$IncidentsDir = Join-Path $LogsDir "incidents"
$LatestLog = Join-Path $LogsDir "latest.log"
$CrashReportsDir = Join-Path $ServerDir "crash-reports"

if (-not (Test-Path $IncidentsDir)) {
    New-Item -ItemType Directory -Path $IncidentsDir -Force | Out-Null
}

function New-IncidentReport {
    param (
        [string]$Type,
        [string]$Title,
        [string]$Details,
        [string]$StackTrace,
        [string]$CulpritMod
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $filename = "incident_${timestamp}_${Type}.txt"
    $filePath = Join-Path $IncidentsDir $filename

    $report = @"
================================================================================
INCIDENT REPORT: $Title
Type: $Type
Timestamp: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Culprit / Source: $(if ($CulpritMod) { $CulpritMod } else { "Unknown / Engine" })
================================================================================

SUMMARY:
$Details

$(if ($StackTrace) { "STACK TRACE / DETAILS:`n$StackTrace`n" })
--------------------------------------------------------------------------------
AI DIAGNOSTIC INSTRUCTIONS:
This incident file is automatically prepared for Antigravity AI analysis.
You can ask Antigravity: 'Проверь последний инцидент в logs\incidents'
================================================================================
"@

    Set-Content -Path $filePath -Value $report -Encoding UTF8
    
    # Also maintain latest_incident.txt for instant quick access
    $latestPath = Join-Path $IncidentsDir "latest_incident.txt"
    Set-Content -Path $latestPath -Value $report -Encoding UTF8
    
    # Append to incident history summary
    $summaryPath = Join-Path $IncidentsDir "incidents_summary.log"
    $summaryLine = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] [$Type] $Title | Culprit: $CulpritMod | File: $filename"
    Add-Content -Path $summaryPath -Value $summaryLine -Encoding UTF8

    Write-Host "[INCIDENT LOGGER] Recorded incident: $Title -> $filename" -ForegroundColor Red
}

function Scan-LatestLog {
    if (-not (Test-Path $LatestLog)) { return }

    # 1. Check for crashes in crash-reports first
    if (Test-Path $CrashReportsDir) {
        $recentCrashes = Get-ChildItem -Path $CrashReportsDir -Filter "*.txt" | Where-Object { 
            $_.LastWriteTime -gt (Get-Date).AddMinutes(-60) 
        } | Sort-Object LastWriteTime -Descending
        
        foreach ($crash in $recentCrashes) {
            $incidentMarker = Join-Path $IncidentsDir "processed_$($crash.Name)"
            if (-not (Test-Path $incidentMarker)) {
                $crashContent = Get-Content -Path $crash.FullName -Encoding UTF8 -Raw
                $culprit = "Unknown"
                if ($crashContent -match 'Mod file: (.*?)\r?\n\s*Failure message: (.*?)\r?\n') {
                    $culprit = "$($matches[1]) - $($matches[2])"
                } elseif ($crashContent -match 'Caused by 0: (.*?)\r?\n') {
                    $culprit = $matches[1]
                }
                New-IncidentReport -Type "CRASH" -Title "Server Crash: $($crash.Name)" -Details $culprit -StackTrace ($crashContent.Substring(0, [Math]::Min(4000, $crashContent.Length))) -CulpritMod $culprit
                Set-Content -Path $incidentMarker -Value "PROCESSED"
            }
        }
    }

    # 2. Check for severe errors in latest.log
    $lines = Get-Content -Path $LatestLog -Encoding UTF8 -Tail 2000 -ErrorAction SilentlyContinue
    if (-not $lines) { return }

    $errorBlocks = @()

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        
        # Check for OutOfMemory
        if ($line -match "java.lang.OutOfMemoryError") {
            $hash = "OOM_" + $i
            $marker = Join-Path $IncidentsDir "err_${hash}.marker"
            if (-not (Test-Path $marker)) {
                New-IncidentReport -Type "OUT_OF_MEMORY" -Title "Server Ran Out of Memory!" -Details "OutOfMemoryError encountered in latest.log" -StackTrace $line -CulpritMod "RAM Allocation / Memory Leak"
                Set-Content -Path $marker -Value (Get-Date).ToString()
            }
        }

        # Check for massive tick lag (> 10000ms behind)
        if ($line -match "Running (\d+)ms or \d+ ticks behind") {
            $msBehind = [int]$matches[1]
            if ($msBehind -gt 15000) {
                $hash = "LAG_" + [Math]::Round($msBehind / 5000)
                $marker = Join-Path $IncidentsDir "err_${hash}.marker"
                if (-not (Test-Path $marker)) {
                    New-IncidentReport -Type "TICK_FREEZE" -Title "Server Freeze Detected ($msBehind ms behind)" -Details "Server overloaded or worldgen stall" -StackTrace $line -CulpritMod "Tick Loop Stall"
                    Set-Content -Path $marker -Value (Get-Date).ToString()
                }
            }
        }

        # Check for standard ERROR / FATAL exceptions
        if ($line -match '\[(.*?)\]\s*\[.*?/(FATAL|ERROR)\]:\s*(.*)') {
            $time = $matches[1]
            $level = $matches[2]
            $msg = $matches[3]

            # Filter out harmless benign known recipe errors and formatting quirks
            if ($msg -notmatch "Couldn't parse element|Parsing error loading recipe|Missing trade item|Missing function|Failed to scan recipe") {
                $trace = @($line)
                $j = $i + 1
                while ($j -lt $lines.Count -and ($lines[$j] -match '^\s+at\s+' -or $lines[$j] -match '^Caused by:' -or $lines[$j] -match '^\t')) {
                    $trace += $lines[$j]
                    $j++
                }
                
                $errorBlocks += [PSCustomObject]@{
                    Time = $time
                    Level = $level
                    Message = $msg
                    StackTrace = ($trace -join "`n")
                }
            }
        }
    }

    # Record significant errors
    foreach ($err in $errorBlocks) {
        $hash = [Math]::Abs(($err.Message).GetHashCode()).ToString()
        $marker = Join-Path $IncidentsDir "err_${hash}.marker"
        if (-not (Test-Path $marker)) {
            New-IncidentReport -Type $err.Level -Title $err.Message -Details "Captured from server latest.log" -StackTrace $err.StackTrace -CulpritMod "See stack trace"
            Set-Content -Path $marker -Value (Get-Date).ToString()
        }
    }
}

Write-Host "[INCIDENT LOGGER] Scanning server logs and crashes..." -ForegroundColor Cyan
Scan-LatestLog
Write-Host "[INCIDENT LOGGER] Incident logging active. Incidents folder: $IncidentsDir" -ForegroundColor Green
