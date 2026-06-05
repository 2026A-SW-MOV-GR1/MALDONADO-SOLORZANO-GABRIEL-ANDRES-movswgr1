#!/bin/bash

# Script para instalar dependencias y configurar el proyecto

echo "🚀 Inicializando proyecto examen01..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

echo "✓ Node.js encontrado: $(node --version)"
echo "✓ npm encontrado: $(npm --version)"
echo ""

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencias instaladas exitosamente"
else
    echo "❌ Error instalando dependencias"
    exit 1
fi

echo ""
echo "✅ Proyecto configurado correctamente"
echo ""
echo "Para ejecutar el proyecto:"
echo "  npm start        - Inicia Expo (escanear QR con Expo Go)"
echo "  npm run web      - Abre en navegador web"
echo "  npm test         - Ejecuta pruebas"
echo ""
