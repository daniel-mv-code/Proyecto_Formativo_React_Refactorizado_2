import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  categoria: string;
}

interface ProductosState {
  items: Producto[];
}

const initialState: ProductosState = {
  items: [
    { id: 1, nombre: 'Filtro de Aceite', precio: 35000, stock: 3, categoria: 'Filtros' },
    { id: 2, nombre: 'Pastillas de Freno Delanteras', precio: 120000, stock: 12, categoria: 'Frenos' },
    { id: 3, nombre: 'Aceite Sintético 5W-30 (Galón)', precio: 150000, stock: 8, categoria: 'Lubricantes' },
    { id: 4, nombre: 'Batería 12V Heavy Duty', precio: 380000, stock: 2, categoria: 'Eléctrico' },
  ],
};

export const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    agregarProducto: (state, action: PayloadAction<Producto>) => {
      state.items.unshift(action.payload);
    },
    actualizarStock: (state, action: PayloadAction<{ id: number; cambio: number }>) => {
      const prod = state.items.find((p) => p.id === action.payload.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock + action.payload.cambio);
      }
    },
    eliminarProducto: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },
  },
});

export const { agregarProducto, actualizarStock, eliminarProducto } = productosSlice.actions;
export default productosSlice.reducer;
