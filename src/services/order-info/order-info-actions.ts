import { createAsyncThunk } from '@reduxjs/toolkit';

import { getOrderByIdRequest } from '@utils/api';

export const fetchOrderById = createAsyncThunk(
  'orderInfo/fetchOrderById',
  async (orderId: string, { rejectWithValue }) => {
    try {
      return await getOrderByIdRequest(orderId);
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось получить информацию о заказе'
      );
    }
  }
);
