@echo off
chcp 65001 > nul
title Ascension of Ages - Host Sync & Push
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\sync_and_push.ps1"
pause
