import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UsuarioAuth, getUser, getToken, isAuthenticated, removeToken } from '../../services/tokenService';

interface AuthState {
  user: UsuarioAuth | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: isAuthenticated() ? getUser() : null,
  token: isAuthenticated() ? getToken() : null,
  isAuthenticated: isAuthenticated(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UsuarioAuth; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      removeToken();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    restoreSession: (state) => {
      if (isAuthenticated()) {
        state.user = getUser();
        state.token = getToken();
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    },
  },
});

export const { loginSuccess, logout, restoreSession } = authSlice.actions;
export default authSlice.reducer;
