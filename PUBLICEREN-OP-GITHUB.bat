@echo off
setlocal
title LeerHelden publiceren op GitHub

set "APPDIR=C:\Users\Admin\Downloads\LeerHelden-v1.0\leerhelden-pwa"

if not exist "%APPDIR%\index.html" (
  echo FOUT: de LeerHelden-map is niet gevonden:
  echo %APPDIR%
  pause
  exit /b 1
)

where git >nul 2>nul
if not %errorlevel%==0 (
  echo Git is niet gevonden.
  echo Installeer eerst GitHub Desktop of Git for Windows.
  pause
  exit /b 1
)

cd /d "%APPDIR%"

echo.
echo Deze stap maakt lokaal een Git-repository.
echo Daarna kun je de map in GitHub Desktop publiceren.
echo.

if not exist ".git" git init
git add .
git commit -m "Publiceer LeerHelden v1.1"

echo.
echo Klaar.
echo Open nu GitHub Desktop en kies:
echo File ^> Add local repository
echo Selecteer:
echo %APPDIR%
echo.
echo Klik daarna op Publish repository.
echo Zet vervolgens GitHub Pages aan via Settings ^> Pages.
echo.
pause
