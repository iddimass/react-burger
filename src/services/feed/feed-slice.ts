import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TOrder, TOrdersResponse } from '@utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isConnecting: false,
  error: null,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    connectFeed: (state, _action: PayloadAction<string>) => {
      state.isConnecting = true;
      state.error = null;
    },
    disconnectFeed: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    feedSocketOpened: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    feedSocketClosed: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    feedSocketError: (state, action: PayloadAction<string>) => {
      state.isConnecting = false;
      state.error = action.payload;
    },
    feedSocketMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isConnecting = false;
      state.error = null;
    },
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedIsConnected: (state) => state.isConnected,
    selectFeedIsConnecting: (state) => state.isConnecting,
    selectFeedError: (state) => state.error,
  },
});

export const {
  connectFeed,
  disconnectFeed,
  feedSocketClosed,
  feedSocketError,
  feedSocketMessage,
  feedSocketOpened,
} = feedSlice.actions;

export const {
  selectFeedError,
  selectFeedIsConnected,
  selectFeedIsConnecting,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} = feedSlice.selectors;
