@echo off

:: Default to Antigravity
set "USE_EDITOR=C:\Users\dan\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"

:: 1. Try Auto-detection (Look for 'cursor' or 'Antigravity' in VS Code related env vars)
echo %VSCODE_GIT_ASKPASS_NODE% | findstr /I "cursor" >nul
if %ERRORLEVEL%==0 set "USE_EDITOR=C:\Users\Dan\AppData\Local\Programs\cursor\Cursor.exe"

echo %VSCODE_GIT_ASKPASS_NODE% | findstr /I "Antigravity" >nul
if %ERRORLEVEL%==0 set "USE_EDITOR=C:\Users\dan\AppData\Local\Programs\Antigravity IDE\Antigravity IDE.exe"

:: 2. Manual Override via JS_EDITOR environment variable (from npm scripts)
echo "%JS_EDITOR%" | findstr /I "cursor" >nul
if %ERRORLEVEL%==0 set "USE_EDITOR=C:\Users\Dan\AppData\Local\Programs\cursor\Cursor.exe"

start "" "%USE_EDITOR%" -g "%1:%2:%3"
