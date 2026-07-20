import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './order-actions';

type TOrderState = {
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.number = null;
      state.error = null;
    },

    clearOrderError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectOrderNumber: (state) => state.number,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.number = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder, clearOrderError } = orderSlice.actions;
export const { selectOrderNumber, selectOrderLoading, selectOrderError } =
  orderSlice.selectors;
