import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: number | string;
  title: string;
  body: string;
  tipo?: 'info' | 'alerta' | 'exito';
  timestamp?: string;
}

interface NotificationsState {
  items: Notification[];
}

const initialState: NotificationsState = {
  items: [
    {
      id: 1,
      title: 'Inventario de Repuestos',
      body: 'Batería 12V Heavy Duty tiene stock bajo (2 unidades).',
      tipo: 'alerta',
      timestamp: '10:00 AM',
    },
    {
      id: 2,
      title: 'Nuevo Cliente',
      body: 'Ana María López ha registrado el vehículo Mazda 3.',
      tipo: 'info',
      timestamp: '10:15 AM',
    },
    {
      id: 3,
      title: 'Facturación Registrada',
      body: 'Servicio de Cambio de aceite completado por $45,000.',
      tipo: 'exito',
      timestamp: '10:30 AM',
    },
  ],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    agregarNotificacion: (
      state,
      action: PayloadAction<{ title: string; body: string; tipo?: 'info' | 'alerta' | 'exito' }>
    ) => {
      state.items.unshift({
        id: Date.now(),
        title: action.payload.title,
        body: action.payload.body,
        tipo: action.payload.tipo || 'info',
        timestamp: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }),
      });
    },
    eliminarNotificacion: (state, action: PayloadAction<number | string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    limpiarNotificaciones: (state) => {
      state.items = [];
    },
  },
});

export const { agregarNotificacion, eliminarNotificacion, limpiarNotificaciones } = notificationsSlice.actions;
export default notificationsSlice.reducer;
