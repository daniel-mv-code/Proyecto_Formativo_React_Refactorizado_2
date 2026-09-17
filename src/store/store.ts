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
