import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TIngredient } from '@utils/types';

type TSelectedIngredientState = {
  ingredient: TIngredient | null;
};

const initialState: TSelectedIngredientState = {
  ingredient: null,
};

export const selectedIngredientSlice = createSlice({
  name: 'selectedIngredient',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },

    clearSelectedIngredient: (state) => {
      state.ingredient = null;
    },
  },
  selectors: {
    selectSelectedIngredient: (state) => state.ingredient,
  },
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  selectedIngredientSlice.actions;
export const { selectSelectedIngredient } = selectedIngredientSlice.selectors;
