import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrder, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  hasLoaded: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  hasLoaded: false,
  isConnected: false,
  isConnecting: false,
  error: null,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    connectProfileOrders: (state, _action: PayloadAction<string>) => {
      state.isConnecting = true;
      state.hasLoaded = state.orders.length > 0;
      state.error = null;
    },
    disconnectProfileOrders: (state) => {
      state.orders = [];
      state.hasLoaded = false;
      state.isConnected = false;
      state.isConnecting = false;
      state.error = null;
    },
    profileOrdersSocketOpened: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    profileOrdersSocketClosed: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    profileOrdersSocketError: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
    profileOrdersSocketMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.hasLoaded = true;
      state.isConnecting = false;
      state.error = null;
    },
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersHasLoaded: (state) => state.hasLoaded,
    selectProfileOrdersIsConnected: (state) => state.isConnected,
    selectProfileOrdersIsConnecting: (state) => state.isConnecting,
    selectProfileOrdersError: (state) => state.error,
  },
});

export const {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSocketClosed,
  profileOrdersSocketError,
  profileOrdersSocketMessage,
  profileOrdersSocketOpened,
} = profileOrdersSlice.actions;

export const {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersHasLoaded,
  selectProfileOrdersIsConnected,
  selectProfileOrdersIsConnecting,
} = profileOrdersSlice.selectors;
