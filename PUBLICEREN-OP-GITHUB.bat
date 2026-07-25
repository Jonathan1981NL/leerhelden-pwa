@echo off
setlocal
cd /d "%~dp0"
title LevelUp Leren publiceren

echo.
echo Repositorynaam: levelup-leren
echo.
where gh >nul 2>nul
if %errorlevel%==0 (
  echo GitHub CLI gevonden. GitHub kan nu om inloggen vragen.
  if not exist ".git" git init
  git branch -M main
  git add .
  git commit -m "Publiceer LevelUp Leren 3.0"
  gh repo create levelup-leren --public --source=. --remote=origin --push
  for /f %%O in ('gh api user --jq .login') do set "GHOWNER=%%O"
  gh api -X POST repos/%GHOWNER%/levelup-leren/pages -f build_type=workflow >nul 2>nul
  start "" "https://github.com"
  echo Klaar. Controleer de Actions- en Pages-tab op GitHub.
  pause
  exit /b
)

echo GitHub CLI is niet gevonden.
echo Open GitHub Desktop, voeg deze map toe als Local Repository en publiceer hem als:
echo levelup-leren
echo.
start "" "https://github.com/new"
pause
