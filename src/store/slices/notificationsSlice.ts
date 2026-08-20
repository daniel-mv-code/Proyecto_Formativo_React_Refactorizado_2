import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Notification {
  id: number;
  title: string;
  body: string;
}

interface NotificationsState {
  items: Notification[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=5');
    return response.data;
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Error al obtener notificaciones';
      });
  },
});

export default notificationsSlice.reducer;
