@echo off
chcp 65001 > nul
title Ascension of Ages - Установка NeoForge 1.21.1
echo ================================================================
echo    Установка NeoForge 1.21.1 (neoforge-21.1.248)
echo ================================================================
echo.

where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ОШИБКА] Java не найдена в системе!
    echo Для запуска NeoForge 1.21.1 требуется Java 21.
    echo Скачайте и установите Java 21: https://adoptium.net/temurin/releases/?version=21
    echo.
    pause
    exit /b 1
)

echo Запуск официального установщика NeoForge...
echo В открывшемся окне нажмите "OK" (Install Client).
echo.
java -jar "%~dp0installers\neoforge-21.1.248-installer.jar"

echo.
echo ================================================================
echo    Установка завершена!
echo    Теперь в вашем лаунчере выберите профиль: "neoforge-21.1.248"
echo ================================================================
pause
