import { createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredients } from '@utils/api';

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      return await getIngredients();
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось получить ингредиенты'
      );
    }
  }
);
