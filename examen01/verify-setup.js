#!/usr/bin/env node

/**
 * Script de verificación del proyecto
 * Valida que todo esté configurado correctamente para Expo Web
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  'package.json',
  'app.json',
  'tsconfig.json',
  'babel.config.js',
  'jest.config.js',
  'metro.config.js',
  'index.js',
  '.eslintrc.json',
  '.gitignore',
  'src/App.tsx',
  'src/types/index.ts',
  'src/services/logger.ts',
  'src/services/dualStorageService.ts',
  'src/context/DualStorageContext.tsx',
  'src/components/StorageSwitch.tsx',
  'src/components/CRUDForm.tsx',
  'src/components/CRUDList.tsx',
  'src/persistence/sqlite/storage.ts',
  'src/persistence/watermelon/storage.ts',
];

const REQUIRED_DIRS = [
  'src',
  'src/types',
  'src/services',
  'src/persistence',
  'src/persistence/sqlite',
  'src/persistence/watermelon',
  'src/context',
  'src/components',
  '__tests__',
];

console.log('🔍 Verificando configuración del proyecto...\n');

let allGood = true;

// Verificar directorios
console.log('📁 Verificando directorios:');
REQUIRED_DIRS.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${dir}`);
  } else {
    console.log(`   ❌ ${dir} - NO ENCONTRADO`);
    allGood = false;
  }
});

console.log('\n📄 Verificando archivos:');
REQUIRED_FILES.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - NO ENCONTRADO`);
    allGood = false;
  }
});

// Verificar package.json
console.log('\n📦 Verificando package.json:');
try {
  const pkgJson = require('./package.json');
  
  const requiredScripts = ['start', 'web', 'test', 'build'];
  requiredScripts.forEach(script => {
    if (pkgJson.scripts && pkgJson.scripts[script]) {
      console.log(`   ✅ Script "${script}" configurado`);
    } else {
      console.log(`   ❌ Script "${script}" NO configurado`);
      allGood = false;
    }
  });

  const requiredDeps = ['expo', 'react', 'react-native'];
  requiredDeps.forEach(dep => {
    if (pkgJson.dependencies && pkgJson.dependencies[dep]) {
      console.log(`   ✅ Dependencia "${dep}" instalada`);
    } else {
      console.log(`   ⚠️  Dependencia "${dep}" NO instalada (instala con: npm install)`);
    }
  });
} catch (error) {
  console.log(`   ❌ Error leyendo package.json: ${error.message}`);
  allGood = false;
}

// Verificar app.json
console.log('\n⚙️  Verificando app.json:');
try {
  const appJson = require('./app.json');
  if (appJson.expo) {
    console.log(`   ✅ Configuración expo encontrada`);
    if (appJson.expo.web) {
      console.log(`   ✅ Configuración web encontrada`);
    } else {
      console.log(`   ⚠️  Configuración web no especificada`);
    }
  } else {
    console.log(`   ❌ Configuración expo NO encontrada`);
    allGood = false;
  }
} catch (error) {
  console.log(`   ❌ Error leyendo app.json: ${error.message}`);
  allGood = false;
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ VERIFICACIÓN COMPLETADA EXITOSAMENTE\n');
  console.log('El proyecto está listo para ejecutar:');
  console.log('  npm run web   - Abre en navegador');
  console.log('  npm start     - Inicia Expo\n');
  process.exit(0);
} else {
  console.log('❌ VERIFICACIÓN FALLÓ\n');
  console.log('Por favor instala las dependencias faltantes:');
  console.log('  npm install\n');
  process.exit(1);
}
