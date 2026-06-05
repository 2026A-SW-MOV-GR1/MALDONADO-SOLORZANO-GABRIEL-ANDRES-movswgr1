# 🎯 INSTRUCCIONES FINALES

## ✅ Lo que se ha completado

Se ha configurado completamente la aplicación **Persistencia Dual** para ejecutarse en **Expo Web** con el comando:

```bash
npx expo start --web
```

### Estructura Completada:
- ✅ 4 archivos de configuración (package.json, app.json, tsconfig.json, babel.config.js)
- ✅ 10 archivos de código fuente (App.tsx + 3 componentes + 2 servicios + 2 capas + 1 contexto + 1 tipos)
- ✅ 3 archivos de documentación (README.md, SETUP.md, QUICKSTART.md)
- ✅ 5 archivos de configuración adicional (jest, eslint, metro, verificación, gitignore)
- ✅ 7 directorios organizados
- ✅ Scripts de instalación (Windows & Linux/Mac)

## 🚀 CÓMO EJECUTAR

### Paso 1: Instala las dependencias
```bash
cd examen01
npm install
```

Esto instalará:
- React 18.2.0
- React Native 0.72.0
- Expo 49.0.0
- react-native-web
- TypeScript 5.0
- Jest para pruebas
- Y todas las dependencias de desarrollo

### Paso 2: Inicia la aplicación en web
```bash
npm run web
```

O directamente:
```bash
npx expo start --web
```

Se abrirá automáticamente en: `http://localhost:19006`

### Paso 3: ¡Usa la aplicación!

1. **Crear Item**: Completa el formulario y haz clic en "Crear Item"
2. **Ver Items**: Aparecerán en la lista debajo del formulario
3. **Cambiar Almacenamiento**: Haz clic en "Alternar Almacenamiento"
   - De SQLite a WatermelonDB (verde → azul)
   - Verás que los items desaparecen (están en otro almacenamiento)
   - Los datos están completamente separados
4. **Crear en otro almacenamiento**: Crea items mientras usas WatermelonDB
5. **Alternar de nuevo**: Vuelve a SQLite y verás tus items originales

## 📊 Lo que verás

```
┌─────────────────────────────────────────────┐
│  Persistencia Dual                          │
│  SQLite + WatermelonDB en Tiempo Real       │
├─────────────────────────────────────────────┤
│                                             │
│  Origen de Datos Activo                     │
│  ┌──────────────────────────────────────┐   │
│  │ 🗄️ SQLite (Relacional) [verde]     │   │
│  └──────────────────────────────────────┘   │
│  [Alternar Almacenamiento] 🔄              │
│                                             │
│  Crear Nuevo Item                           │
│  ┌──────────────────────────────────────┐   │
│  │ Título: ________________            │   │
│  │ Descripción:                         │   │
│  │ ____________________________         │   │
│  │ [Crear Item]                        │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  Items CRUD [2 items]                      │
│  ┌──────────────────────────────────────┐   │
│  │ Título del Item                      │   │
│  │ Descripción breve...                 │   │
│  │ 5 jun 12:34  🗄️ SQL    [Eliminar]   │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  💾 Todos los datos se guardan localmente   │
│  🔄 Cambio instantáneo entre almacenes    │
│                                             │
└─────────────────────────────────────────────┘
```

## 🔍 Monitorea los Logs

Los logs te muestran exactamente qué está pasando:

1. Abre **DevTools** (F12 o Ctrl+Shift+I)
2. Ve a la pestaña **Console**
3. Busca `[DualPersistence]`
4. Verás logs como:

```
[DualPersistence] [INFO] ✓ Servicio de persistencia dual listo
[DualPersistence] [INFO] ✓ Item creado en SQLite: item-1717570800000-abc123
[DualPersistence] [INFO] Cambiando almacenamiento de sqlite a watermelon
[DualPersistence] [INFO] ✓ Almacenamiento cambiado a watermelon
[DualPersistence] [INFO] ✓ 0 documentos leídos de WatermelonDB
```

## 💡 Conceptos Clave

**Persistencia Dual**: Dos bases de datos en paralelo
- SQLite: Almacenamiento relacional (SQL)
- WatermelonDB: Almacenamiento NoSQL (documentos)

**Conmutación Instantánea**: Cambias de BD sin retrasos
- Almacenamiento separado para cada BD
- El contexto mantiene el estado
- La UI se actualiza automáticamente

**React Native + Web**: La app funciona en web
- Componentes react-native compatibles
- StyleSheet igual que en mobile
- localStorage en lugar de DB nativa

## 📱 Comandos Útiles

```bash
npm run web              # Inicia en navegador
npm start                # Inicia Expo (default)
npm test                 # Ejecuta pruebas
npm run lint             # Revisa código
npm run verify           # Verifica configuración
npm run build            # Compila TypeScript
```

## ⚙️ Tecnologías Usadas

- **React 18** - Framework UI
- **React Native** - Componentes
- **React Native Web** - Compatibilidad web
- **Expo 49** - Plataforma de desarrollo
- **TypeScript 5** - Tipado estático
- **Context API** - State management
- **localStorage** - Persistencia en web
- **Jest** - Testing framework
- **ESLint** - Code quality

## 🎓 Archivos Importantes

**Lógica Principal:**
- `src/App.tsx` - Punto de entrada
- `src/context/DualStorageContext.tsx` - State management
- `src/services/dualStorageService.ts` - Orquestador

**Componentes:**
- `src/components/StorageSwitch.tsx` - Selector BD
- `src/components/CRUDForm.tsx` - Crear items
- `src/components/CRUDList.tsx` - Ver/eliminar items

**Capas de Persistencia:**
- `src/persistence/sqlite/storage.ts` - SQLite
- `src/persistence/watermelon/storage.ts` - WatermelonDB

**Configuración:**
- `package.json` - Scripts y dependencias
- `app.json` - Config Expo
- `tsconfig.json` - Config TypeScript
- `babel.config.js` - Config Babel

## ✨ Próximos Pasos

1. **Abre terminal en la carpeta examen01**
2. **Ejecuta**: `npm install`
3. **Espera** a que terminen las dependencias (~2-3 minutos)
4. **Ejecuta**: `npm run web`
5. **Disfruta** de tu app de Persistencia Dual

## 🎉 ¡LISTO!

La aplicación está **100% lista** para ejecutar.

Solo necesitas:
```bash
npm install && npm run web
```

---

**Preguntas Frecuentes:**

**P: ¿Puedo usar localhost en lugar de 19006?**
R: El puerto está configurado por defecto, pero puedes especificar otro si cambias package.json

**P: ¿Los datos persisten si cierro el navegador?**
R: Sí, se guardan en localStorage del navegador

**P: ¿Puedo usar esto en Android/iOS?**
R: Sí, pero necesitarías instalar Expo Go en el dispositivo

**P: ¿Cómo veo los logs?**
R: Abre DevTools (F12) → Consola → Busca [DualPersistence]

---

**Estado**: ✅ COMPLETAMENTE LISTO PARA EJECUTAR
