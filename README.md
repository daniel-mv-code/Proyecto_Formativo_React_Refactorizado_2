# Proyecto Formativo React - SIGTM / AutoMétrica

Este proyecto es una aplicación web construida con **React** y **TypeScript**, desarrollada como parte de las actividades del proyecto formativo. Permite la gestión de Usuarios, Productos y Ventas, e incluye funcionalidades de Login y Registro.

---

## 🚀 Actividad 3 – Manejo del Estado Global (Proyecto Formativo)

En esta actividad se integró un **sistema de estado global con Redux Toolkit** vinculado directamente con las tablas de la base de datos de la plataforma:

- **Store Centralizado (`src/store/store.ts`):** Gestiona de forma unificada el estado de la aplicación.
- **Slices de Tablas de la BD:**
  - `usuariosSlice.ts`: Control de la nómina de usuarios (mecánicos, clientes y administradores), altas reactivas y cambio de estado.
  - `productosSlice.ts`: Catálogo de refacciones, control de stock en tiempo real y detección automática de stock crítico (< 3 unidades).
  - `ventasSlice.ts`: Facturación y órdenes de trabajo, acumulando totales facturados en tiempo real.
  - `notificationsSlice.ts`: Alertas del sistema emitidas en vivo ante cambios en las tablas.
- **Componentes Independientes en Tiempo Real:**
  - `NotificationPanel.tsx`: Widget flotante interactivo con acceso permanente desde cualquier ruta que muestra las métricas calculadas en vivo de la BD (Usuarios activos, stock total y crítico, y facturación total) y el historial de notificaciones.
  - `GlobalStatsBar.tsx`: Barra de resumen con badges en tiempo real en la cabecera.
  - Ambos componentes persisten fuera de `<Routes>` en `App.tsx`, garantizando sincronización sin importar en qué vista navegue el usuario (`/usuarios`, `/productos`, `/ventas`, `/login`, `/registro`).

---

## 🔗 Enlaces Oficiales de la Actividad (GitHub)

- **Repositorio Oficial:** [daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2)
- **Rama Secundaria de la Actividad:** `feature/estado-global-actividad-3`
- **Pull Request #1 (Abierto):** [Pull Request #1 - Integración de Estado Global](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2/pull/1)
- **Documentación de la Actividad:** Consultar [`docs/ACTIVIDAD_3_ESTADO_GLOBAL.md`](docs/ACTIVIDAD_3_ESTADO_GLOBAL.md) y el archivo Word incluido en [`docs/Manejo del Estado Global (Actualizado).docx`](docs/Manejo%20del%20Estado%20Global%20(Actualizado).docx).

---

## 🛠️ Tecnologías Utilizadas

- **React 18 / 19**
- **TypeScript**
- **Redux Toolkit & React-Redux** (Manejo de estado global)
- **React Router DOM v7** (Navegación y rutas SPA)
- **CSS3** (Variables globales y diseño modular)

---

## 📦 Estructura del Proyecto

- `src/components/`: Componentes de vistas y módulos (`Usuarios.tsx`, `Productos.tsx`, `Ventas.tsx`, `Login.tsx`, `Registro.tsx`).
- `src/components/layout/`: Componentes base de la estructura visual (`Header`, `Sidebar`, `Footer`).
- `src/components/NotificationPanel.tsx`: Componente flotante independiente en tiempo real.
- `src/components/GlobalStatsBar.tsx`: Barra superior con contadores en tiempo real.
- `src/store/`: Configuración global de Redux Toolkit.
  - `store.ts`: Configuración principal de la Store.
  - `slices/`: Slices de base de datos (`usuariosSlice.ts`, `productosSlice.ts`, `ventasSlice.ts`, `notificationsSlice.ts`).
- `docs/`: Documentación técnica y archivo Word de entrega de la Actividad 3.

---

## ⚙️ Cómo ejecutar el proyecto localmente

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2.git
   cd Proyecto_Formativo_React_Refactorizado_2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm start
   ```

4. **Abrir en el navegador:**
   La aplicación se abrirá en [http://localhost:3000](http://localhost:3000).

---

## 🔄 Flujo de Trabajo del Pull Request (PR)

1. Rama base: `main`
2. Rama comparada: `feature/estado-global-actividad-3`
3. Estado: Compatible sin conflictos (**Able to merge**).
4. Acceso directo: [Ver Pull Request #1 en GitHub](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2/pull/1)
