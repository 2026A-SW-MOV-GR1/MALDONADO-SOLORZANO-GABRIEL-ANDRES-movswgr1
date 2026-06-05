# 📱 Persistencia Dual - Aplicación Expo Web

Una aplicación React Native ejecutada en **Expo Web** que demuestra persistencia dual entre **SQLite** (relacional) y **WatermelonDB** (NoSQL).

## 🎯 Características

✨ **Conmutación Instantánea**
- Cambiar entre SQLite y WatermelonDB sin perder datos
- Cambios reflejados en tiempo real
- Almacenamiento completamente separado para cada base de datos

🔄 **Operaciones CRUD Completas**
- Crear items con título y descripción
- Listar todos los items
- Eliminar items
- Interfaz reactiva

📊 **Almacenamiento en Web**
- SQLite: Emulado usando localStorage
- WatermelonDB: Emulado usando localStorage
- Persistencia entre sesiones del navegador

🎨 **Interfaz Reactiva**
- Componentes en React Native (compatible web)
- Indicador visual del almacenamiento activo
- Carga de datos instantánea

🔍 **Sistema de Logging Completo**
- Logs detallados de todas las operaciones
- Consola con debug, info, warn, error
- Trazas de ejecución

## 🚀 Inicio Rápido

### 1. Instalación

```bash
cd examen01

# Instalar dependencias
npm install
```

O ejecuta el script de instalación:

**En Windows:**
```cmd
setup.bat
```

**En Linux/Mac:**
```bash
./setup.sh
```

### 2. Ejecutar la Aplicación

```bash
# Abrir en navegador web
npm run web
```

Esto abrirá automáticamente: `http://localhost:19006`

### 3. ¡Usar la Aplicación!

1. **Crear Items**: Rellena el formulario y haz clic en "Crear Item"
2. **Ver Items**: Los items aparecerán en la lista debajo
3. **Cambiar Almacenamiento**: Haz clic en "Alternar Almacenamiento"
4. **Eliminar Items**: Haz clic en el botón "Eliminar" en cada item

## 📋 Comandos Disponibles

```bash
npm start              # Inicia Expo (por defecto)
npm run web           # Abre en navegador web (http://localhost:19006)
npm run android       # Para Android (requiere Expo Go)
npm run ios           # Para iOS (requiere Expo Go)
npm test              # Ejecuta pruebas unitarias
npm test:coverage     # Pruebas con reporte de cobertura
npm run build         # Compila TypeScript a JavaScript
npm run lint          # Ejecuta verificación de código (ESLint)
```

## 🏗️ Estructura del Proyecto

```
examen01/
├── src/
│   ├── App.tsx                 # Aplicación principal
│   ├── types/
│   │   └── index.ts            # Tipos TypeScript
│   ├── services/
│   │   ├── logger.ts           # Sistema de logging
│   │   └── dualStorageService.ts # Orquestación CRUD
│   ├── context/
│   │   └── DualStorageContext.tsx # Estado global (Context API)
│   ├── components/
│   │   ├── StorageSwitch.tsx   # Selector de almacenamiento
│   │   ├── CRUDForm.tsx        # Formulario de creación
│   │   └── CRUDList.tsx        # Lista de items
│   └── persistence/
│       ├── sqlite/
│       │   └── storage.ts      # Capa SQLite
│       └── watermelon/
│           └── storage.ts      # Capa WatermelonDB
├── __tests__/                  # Pruebas unitarias
├── package.json                # Dependencias y scripts
├── app.json                    # Configuración de Expo
├── tsconfig.json               # Configuración TypeScript
├── jest.config.js              # Configuración de pruebas
├── babel.config.js             # Configuración de Babel
├── metro.config.js             # Configuración del bundler
├── index.js                    # Punto de entrada
└── SETUP.md                    # Guía de instalación

```

## 📚 Cómo Funciona

### Arquitectura

```
┌─────────────────────────────────────┐
│         App.tsx                     │
│  (Interfaz de Usuario)              │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   DualStorageContext (Estado)       │
│   (Context API)                     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   DualStorageService                │
│   (Lógica de CRUD)                  │
└──────────┬──────────────────────────┘
           │
      ┌────┴────┐
      ▼         ▼
 ┌────────┐ ┌──────────┐
 │ SQLite │ │Watermelon│
 │ Layer  │ │  Layer   │
 └────────┘ └──────────┘
      │         │
      └────┬────┘
           ▼
    [localStorage]
    (En el navegador)
```

### Flujo de Datos

1. **Creación de Item**:
   - Usuario completa formulario → CRUDForm
   - Llamada a `createItem()` en contexto
   - Contexto llama a `DualStorageService`
   - Servicio elige la capa activa (SQLite o WatermelonDB)
   - Los datos se guardan en localStorage

2. **Cambio de Almacenamiento**:
   - Usuario hace clic en "Alternar Almacenamiento"
   - Contexto llama a `switchStorage()`
   - Servicio cambia la referencia de la capa activa
   - Los items del nuevo almacenamiento se cargan
   - UI se actualiza automáticamente

3. **Eliminación de Item**:
   - Usuario hace clic en "Eliminar"
   - Contexto llama a `deleteItem()`
   - Servicio elimina del almacenamiento activo
   - UI se actualiza automáticamente

## 🔍 Logging

Todos los eventos se registran en la consola del navegador:

```
[DualPersistence] [INFO] ✓ Servicio de persistencia dual listo
[DualPersistence] [INFO] ✓ Item creado en SQLite: item-1717570800000-abc123
[DualPersistence] [INFO] Cambiando almacenamiento de sqlite a watermelon
[DualPersistence] [INFO] ✓ Almacenamiento cambiado a watermelon
[DualPersistence] [INFO] ✓ 2 documentos leídos de WatermelonDB
```

Abre la consola del navegador (F12) para ver los logs en tiempo real.

## 💾 Almacenamiento en Web

En el navegador, los datos se guardan en **localStorage**:

- **SQLite**: `localStorage.getItem('sqlite_items')`
- **WatermelonDB**: `localStorage.getItem('watermelon_items')`

Cada almacenamiento tiene su propio espacio separado.

### Datos de Ejemplo

```json
{
  "item-1717570800000-abc123": {
    "id": "item-1717570800000-abc123",
    "title": "Mi primer item",
    "description": "Descripción del item",
    "createdAt": 1717570800000,
    "updatedAt": 1717570800000
  }
}
```

## 🧪 Pruebas

Ejecutar pruebas unitarias:

```bash
npm test
```

Las pruebas incluyen:
- ✅ Validación de estructura de datos
- ✅ Operaciones CRUD correctas
- ✅ Manejo de errores
- ✅ Conmutación entre almacenamientos
- ✅ Separación de datos entre capas

## 🌐 Compatibilidad Web

### Navegadores Soportados

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+

### Tecnologías Web

- **React**: Framework UI
- **React Native Web**: Compatibilidad entre plataformas
- **TypeScript**: Tipado estático
- **Expo Web**: Bundler metro

## 🔧 Requisitos Técnicos

**Mínimos:**
- Node.js 14+
- npm 6+
- Navegador moderno

**Recomendado:**
- Node.js 18+
- npm 8+
- Visual Studio Code

## 📖 Documentación Adicional

- [Guía de Instalación](SETUP.md)
- [API de Servicios](src/services/)
- [Tipos TypeScript](src/types/)

## 🐛 Resolución de Problemas

### Error: "Cannot find module 'expo'"

```bash
npm install
```

### Puerto 19006 ya está en uso

El puerto predeterminado es 19006. Para usar otro puerto:

```bash
expo start --web --port 3000
```

### localStorage no funcionando

- Verifica que las cookies/almacenamiento del navegador estén habilitadas
- Limpia localStorage: Abre DevTools → Application → Clear storage

### Los datos desaparecen al recargar

Este es el comportamiento esperado si se limpian los datos. Para mantener los datos:
1. No limpies el almacenamiento del navegador
2. Los datos persisten en `localStorage` entre sesiones

## 📝 Notas Importantes

⚠️ **Emulación Web**: En web, tanto SQLite como WatermelonDB se emulan usando localStorage. En una aplicación nativa (Android/iOS con Expo Go), se usarían las bases de datos reales.

⚠️ **Límite de Storage**: localStorage tiene un límite típico de 5-10MB según el navegador.

⚠️ **Datos Locales**: Todos los datos se guardan localmente en el navegador. No se sincroniza con un servidor.

## 🎓 Conceptos Demostrados

- ✅ Persistencia Dual (dos capas de almacenamiento)
- ✅ Context API para estado global
- ✅ Componentes React reutilizables
- ✅ TypeScript para seguridad de tipos
- ✅ Logging centralizado
- ✅ Patrón Strategy (múltiples implementaciones)
- ✅ Patrón Facade (interfaz unificada)

## 🚀 Próximos Pasos

1. Ejecuta `npm install`
2. Ejecuta `npm run web`
3. ¡Abre la aplicación en tu navegador!

---

**Autor**: MALDONADO-SOLORZANO-GABRIEL-ANDRES
**Versión**: 1.0.0
**Licencia**: MIT
**Estado**: ✅ Listo para usar
