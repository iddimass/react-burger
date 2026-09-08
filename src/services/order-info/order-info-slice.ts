import { createSlice } from '@reduxjs/toolkit';

import { fetchOrderById } from './order-info-actions';

import type { TOrder } from '@utils/types';

type TOrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderInfoState = {
  order: null,
  isLoading: false,
  error: null,
};

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {
    clearOrderInfo: (state) => {
      state.order = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  selectors: {
    selectOrderInfo: (state) => state.order,
    selectOrderInfoLoading: (state) => state.isLoading,
    selectOrderInfoError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.order = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        if (action.meta.aborted) {
          return;
        }

        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось получить информацию о заказе';
      });
  },
});

export const { clearOrderInfo } = orderInfoSlice.actions;
export const { selectOrderInfo, selectOrderInfoError, selectOrderInfoLoading } =
  orderInfoSlice.selectors;
