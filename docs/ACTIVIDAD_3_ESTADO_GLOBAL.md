# Actividad 3 – Proyecto Formativo: Manejo del Estado Global

## 1. Requerimientos de la Actividad
Integre un sistema de estado global en el proyecto y cree un nuevo componente independiente (por ejemplo, un panel de notificaciones, un contador de registros o un perfil de usuario) que consuma y muestre en tiempo real la información almacenada en dicho estado, recordando que estos datos deben estar vinculados directamente con las tablas de su base de datos, sin importar la ruta en la que se encuentre el usuario.

---

## 2. Enlaces del Repositorio y Pull Request (GitHub)

- **Repositorio GitHub:** [https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2)
- **Rama Secundaria:** `feature/estado-global-actividad-3`
- **Pull Request Oficial (Abierto):** [Pull Request #1 en GitHub](https://github.com/daniel-mv-code/Proyecto_Formativo_React_Refactorizado_2/pull/1)

---

## 3. Proceso de Creación del Pull Request (PR)

1. **Ir a la pestaña de Pull Requests:** En la barra superior del repositorio de GitHub, hacer clic en la pestaña "Pull requests".
2. **Seleccionar las ramas a comparar:** 
   - `base: main` (rama principal receptora).
   - `compare: feature/estado-global-actividad-3` (rama secundaria con los cambios).
   - GitHub muestra el estado verde **"Able to merge"**.
3. **Crear la solicitud:** Presionar el botón verde **"Create pull request"**.
4. **Detalles del PR:**
   - **Título:** `feat: integrar estado global Redux con tablas de BD y componente en tiempo real`
   - **Descripción:** Detalle de la implementación de Redux Toolkit para Usuarios, Productos/Inventario, Ventas/Facturación y Notificaciones, además de la inclusión de los componentes independientes en tiempo real (`NotificationPanel` y `GlobalStatsBar`).

---

## 4. Arquitectura del Estado Global Implementado

Se implementó una arquitectura con **Redux Toolkit** centralizada en `src/store/store.ts` con reducers dedicados para cada entidad:

1. **Tabla de Usuarios y Clientes (`usuariosSlice.ts`):**
   - Manejo de clientes, mecánicos y administradores.
   - Acciones: `agregarUsuario`, `cambiarEstadoUsuario`, `eliminarUsuario`.
2. **Tabla de Productos e Inventario (`productosSlice.ts`):**
   - Control de refacciones automotrices, stock y precios.
   - Acciones: `agregarProducto`, `actualizarStock`, `eliminarProducto`.
   - Detección automática de stock crítico (< 3 unidades).
3. **Tabla de Ventas y Facturación (`ventasSlice.ts`):**
   - Registro de órdenes de trabajo y facturación.
   - Acciones: `registrarVenta`.
   - Cálculo automático de ingresos totales en tiempo real.
4. **Sistema de Notificaciones en Vivo (`notificationsSlice.ts`):**
   - Registro reactivo de eventos generados por las operaciones en las tablas de la BD.
   - Acciones: `agregarNotificacion`, `eliminarNotificacion`, `limpiarNotificaciones`.
5. **Componentes Independientes en Tiempo Real:**
   - `NotificationPanel.tsx`: Widget flotante con resumen de registros de BD, stock crítico, monto facturado y notificaciones en tiempo real.
   - `GlobalStatsBar.tsx`: Barra de métricas reactivas en la cabecera.
   - Ubicados en `App.tsx` para estar presentes y sincronizados en cualquier ruta (`/usuarios`, `/productos`, `/ventas`, `/login`, `/registro`).

---

## 5. Código Fuente Principal

### Store (`src/store/store.ts`)
```typescript
import { configureStore } from '@reduxjs/toolkit';
import usuariosReducer from './slices/usuariosSlice';
import productosReducer from './slices/productosSlice';
import ventasReducer from './slices/ventasSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    usuarios: usuariosReducer,
    productos: productosReducer,
    ventas: ventasReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Componente Independiente en Tiempo Real (`src/components/NotificationPanel.tsx`)
```typescript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { eliminarNotificacion, limpiarNotificaciones } from '../store/slices/notificationsSlice';

const NotificationPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'notificaciones' | 'metricas'>('metricas');
  const dispatch = useDispatch<AppDispatch>();

  // Consumo directo del Estado Global vinculado a las tablas de la BD
  const usuarios = useSelector((state: RootState) => state.usuarios.items);
  const productos = useSelector((state: RootState) => state.productos.items);
  const ventas = useSelector((state: RootState) => state.ventas.items);
  const notificaciones = useSelector((state: RootState) => state.notifications.items);

  // Cálculos en tiempo real
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.estado === 'Activo').length;
  const totalStock = productos.reduce((acc, p) => acc + p.stock, 0);
  const stockCritico = productos.filter((p) => p.stock < 3).length;
  const totalFacturado = ventas.reduce((acc, v) => acc + v.monto, 0);
  const totalVentas = ventas.length;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <button onClick={() => setIsOpen(!isOpen)}>
        ⚡ BD en Vivo ({totalUsuarios + productos.length + totalVentas} registros)
      </button>
      {/* Contenido expandible con métricas y alertas */}
    </div>
  );
};

export default NotificationPanel;
```
