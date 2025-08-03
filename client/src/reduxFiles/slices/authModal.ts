import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthModalMode = 'signin' | 'signup' | null;

interface AuthModalState {
  isOpen: boolean;
  mode: AuthModalMode;
}

const initialState: AuthModalState = {
  isOpen: false,
  mode: null,
};

const authModalSlice = createSlice({
  name: 'authModal',
  initialState,
  reducers: {
    openAuthModal: (state, action: PayloadAction<AuthModalMode>) => {
      state.isOpen = true;
      state.mode = action.payload;
    },
    closeAuthModal: (state) => {
      state.isOpen = false;
      state.mode = null;
    },
    switchMode: (state, action: PayloadAction<AuthModalMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { openAuthModal, closeAuthModal, switchMode } = authModalSlice.actions;
export const authModalReducer = authModalSlice.reducer;