import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Venta {
  id: number;
  cliente: string;
  servicio: string;
  monto: number;
  fecha: string;
}

interface VentasState {
  items: Venta[];
}

const initialState: VentasState = {
  items: [
    { id: 1, cliente: 'Juan Pérez', servicio: 'Cambio de aceite', monto: 45000, fecha: '10:30 AM' },
    { id: 2, cliente: 'María Gómez', servicio: 'Alineación y balanceo', monto: 80000, fecha: '11:15 AM' },
    { id: 3, cliente: 'Carlos Ruiz', servicio: 'Cambio de pastillas de freno', monto: 120000, fecha: '01:45 PM' },
  ],
};

export const ventasSlice = createSlice({
  name: 'ventas',
  initialState,
  reducers: {
    registrarVenta: (state, action: PayloadAction<Venta>) => {
      state.items.unshift(action.payload);
    },
  },
});

export const { registrarVenta } = ventasSlice.actions;
export default ventasSlice.reducer;
