# Proyecto Formativo React - SIGTM

Este proyecto es una aplicación web construida con **React** y **TypeScript**, desarrollada como parte de las actividades del proyecto formativo. Permite la gestión de Usuarios, Productos y Ventas, e incluye funcionalidades de Login y Registro.

## 🚀 Novedades (Actividad 3)

Como parte de la **Actividad 3 - Proyecto Formativo**, se han integrado las siguientes características:
- **Redux Toolkit & React-Redux:** Implementación de un estado global para manejar los datos de la aplicación de forma centralizada.
- **Axios:** Consumo de una API REST externa (`https://jsonplaceholder.typicode.com/posts`) para obtener notificaciones o mensajes en tiempo real.
- **Panel de Notificaciones Flotante:** Un nuevo componente totalmente independiente que lee la información desde el store de Redux. Es accesible desde cualquier parte de la página mediante un botón flotante en la esquina inferior derecha.

## 🛠️ Tecnologías utilizadas

- React 18
- TypeScript
- Redux Toolkit (Manejo de estado)
- Axios (Peticiones HTTP)
- CSS (Estilos nativos y variables globales)

## 📦 Estructura del Proyecto

- `src/components/`: Contiene todos los componentes de React (`Usuarios.tsx`, `Productos.tsx`, etc.).
- `src/components/layout/`: Componentes de diseño como `Header`, `Sidebar`, y `Footer`.
- `src/components/NotificationPanel.tsx`: Componente flotante de notificaciones conectado a Redux.
- `src/store/`: Configuración global de Redux.
  - `store.ts`: Archivo principal de configuración del store.
  - `slices/`: Diferentes fragmentos del estado global (ej. `notificationsSlice.ts`).

## ⚙️ Cómo ejecutar el proyecto localmente

Sigue estos pasos para correr el proyecto en tu máquina local:

1. **Clonar o descargar el repositorio**
2. **Abrir la terminal** y navegar hasta la carpeta raíz del proyecto (donde se encuentra `package.json`).
3. **Instalar las dependencias** corriendo el siguiente comando:
   ```bash
   npm install
   ```
4. **Iniciar el servidor de desarrollo** ejecutando:
   ```bash
   npm start
   ```
5. **Abrir en el navegador:**
   La aplicación se abrirá automáticamente en [http://localhost:3000](http://localhost:3000).
   Podrás navegar por las diferentes vistas usando el menú superior y verás el panel de notificaciones flotante en la esquina inferior derecha.

## 🔄 Flujo de Trabajo (Git / GitHub)

Para cumplir con la entrega de la actividad, recuerda:
1. Crear una rama nueva para los cambios: `git checkout -b feature/actividad-3-redux`
2. Hacer commit de los cambios: `git add .` seguido de `git commit -m "feat: implementar redux y consumo de API con axios"`
3. Subir la rama a GitHub: `git push origin feature/actividad-3-redux`
4. Crear el **Pull Request** en GitHub y copiar el enlace para la entrega.
