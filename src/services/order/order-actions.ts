import { createAsyncThunk } from '@reduxjs/toolkit';

import { createOrderRequest } from '@utils/api';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      return await createOrderRequest(ingredients);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);
