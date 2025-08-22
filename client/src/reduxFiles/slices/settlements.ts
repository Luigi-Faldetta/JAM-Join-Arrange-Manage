import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Settlement {
  id: string;
  eventId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  payerConfirmed: boolean;
  receiverConfirmed: boolean;
  payerConfirmedAt?: string;
  receiverConfirmedAt?: string;
  createdAt: string;
  updatedAt: string;
  Payer?: {
    userId: string;
    name: string;
    profilePic?: string;
  };
  Receiver?: {
    userId: string;
    name: string;
    profilePic?: string;
  };
}

interface SettlementState {
  settlements: Settlement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SettlementState = {
  settlements: [],
  isLoading: false,
  error: null,
};

const settlementSlice = createSlice({
  name: 'settlements',
  initialState,
  reducers: {
    setSettlements: (state, action: PayloadAction<Settlement[]>) => {
      state.settlements = action.payload;
      state.error = null;
    },
    addSettlement: (state, action: PayloadAction<Settlement>) => {
      const existingIndex = state.settlements.findIndex(
        s => s.id === action.payload.id
      );
      if (existingIndex >= 0) {
        state.settlements[existingIndex] = action.payload;
      } else {
        state.settlements.push(action.payload);
      }
    },
    updateSettlement: (state, action: PayloadAction<Settlement>) => {
      const index = state.settlements.findIndex(
        s => s.id === action.payload.id
      );
      if (index >= 0) {
        state.settlements[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearSettlements: (state) => {
      state.settlements = [];
      state.error = null;
    },
  },
});

export const {
  setSettlements,
  addSettlement,
  updateSettlement,
  setLoading,
  setError,
  clearSettlements,
} = settlementSlice.actions;

export default settlementSlice.reducer;