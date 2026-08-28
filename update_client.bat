@echo off
chcp 65001 > nul
title Ascension of Ages - Modpack Updater
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\update_client.ps1"
pause
