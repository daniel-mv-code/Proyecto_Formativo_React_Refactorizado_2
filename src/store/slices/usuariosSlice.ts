import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UsuarioItem {
  id: number;
  nombre: string;
  correo: string;
  rol: 'Mecánico' | 'Cliente' | 'Administrador';
  vehiculo?: string;
  estado: 'Activo' | 'Inactivo';
}

interface UsuariosState {
  items: UsuarioItem[];
}

const initialState: UsuariosState = {
  items: [
    { id: 1, nombre: 'Carlos Rodríguez', correo: 'carlos.mecanico@autometrica.com', rol: 'Mecánico', estado: 'Activo' },
    { id: 2, nombre: 'Ana María López', correo: 'ana.lopez@gmail.com', rol: 'Cliente', vehiculo: 'Mazda 3 (2020)', estado: 'Activo' },
    { id: 3, nombre: 'Jorge Martínez', correo: 'jorge.mecanico@autometrica.com', rol: 'Mecánico', estado: 'Activo' },
    { id: 4, nombre: 'Laura Fernández', correo: 'laura.f@hotmail.com', rol: 'Cliente', vehiculo: 'Toyota Hilux (2018)', estado: 'Inactivo' },
  ],
};

export const usuariosSlice = createSlice({
  name: 'usuarios',
  initialState,
  reducers: {
    agregarUsuario: (state, action: PayloadAction<UsuarioItem>) => {
      state.items.unshift(action.payload);
    },
    cambiarEstadoUsuario: (state, action: PayloadAction<number>) => {
      const usuario = state.items.find((u) => u.id === action.payload);
      if (usuario) {
        usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
      }
    },
    eliminarUsuario: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((u) => u.id !== action.payload);
    },
  },
});

export const { agregarUsuario, cambiarEstadoUsuario, eliminarUsuario } = usuariosSlice.actions;
export default usuariosSlice.reducer;
