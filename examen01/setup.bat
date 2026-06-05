@echo off
REM Script para instalar dependencias y configurar el proyecto en Windows

echo 🚀 Inicializando proyecto examen01...
echo.

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js primero.
    exit /b 1
)

echo ✓ Node.js encontrado
for /f "tokens=*" %%i in ('node --version') do echo   %%i
for /f "tokens=*" %%i in ('npm --version') do echo ✓ npm encontrado: %%i

echo.

REM Instalar dependencias
echo 📦 Instalando dependencias...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✓ Dependencias instaladas exitosamente
) else (
    echo ❌ Error instalando dependencias
    exit /b 1
)

echo.
echo ✅ Proyecto configurado correctamente
echo.
echo Para ejecutar el proyecto:
echo   npm start        - Inicia Expo (escanear QR con Expo Go)
echo   npm run web      - Abre en navegador web
echo   npm test         - Ejecuta pruebas
echo.

pause
