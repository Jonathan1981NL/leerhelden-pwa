@echo off
setlocal
cd /d "%~dp0"
title LevelUp Leren 4.0 naar GitHub

echo.
echo Alle bestanden worden klaargezet voor de bestaande repository levelup-leren.
echo.
where git >nul 2>nul
if errorlevel 1 (
  echo Git is niet gevonden. Gebruik GitHub Desktop en commit alle gewijzigde bestanden.
  pause
  exit /b 1
)

if not exist ".git" (
  echo Deze map is nog geen lokale Git-repository.
  echo Open de map in GitHub Desktop als bestaande repository of clone levelup-leren eerst.
  pause
  exit /b 1
)

git add -A
git diff --cached --quiet
if not errorlevel 1 (
  echo Er zijn geen nieuwe wijzigingen om te publiceren.
  pause
  exit /b 0
)

git commit -m "LevelUp Leren 4.0"
git push origin main
if errorlevel 1 (
  echo Upload mislukt. Open GitHub Desktop voor de foutmelding.
  pause
  exit /b 1
)

echo.
echo LevelUp Leren 4.0 is naar GitHub gestuurd.
start "" "https://jonathan1981nl.github.io/levelup-leren/"
pause
