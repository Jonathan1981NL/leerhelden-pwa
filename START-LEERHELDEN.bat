@echo off
setlocal
title LeerHelden starten

set "APPDIR=C:\Users\Admin\Downloads\LeerHelden-v1.0\leerhelden-pwa"
set "PORT=8080"

if not exist "%APPDIR%\index.html" (
  echo.
  echo FOUT: index.html is niet gevonden in:
  echo %APPDIR%
  echo.
  echo Controleer of de map exact op deze plek staat.
  pause
  exit /b 1
)

cd /d "%APPDIR%"

echo.
echo ==========================================
echo          LEERHELDEN WORDT GESTART
echo ==========================================
echo.
echo Map: %APPDIR%
echo Website: http://localhost:%PORT%
echo.

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  py -m http.server %PORT%
  exit /b
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  python -m http.server %PORT%
  exit /b
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  npx --yes serve -l %PORT% .
  exit /b
)

echo Python of Node.js is niet gevonden.
echo.
echo Installeer Python via Microsoft Store of python.org.
echo Start daarna dit bestand opnieuw.
echo.
pause
