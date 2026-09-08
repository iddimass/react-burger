import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { createOrder } from '@services/order/order-actions';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

const selectTotalPriceFromState = createSelector(
  [
    (state: TBurgerConstructorState): TIngredient | null => state.bun,
    (state: TBurgerConstructorState): TConstructorIngredient[] => state.ingredients,
  ],
  (bun, ingredients) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (total, ingredient) => total + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);

const selectIngredientCountsFromState = createSelector(
  [
    (state: TBurgerConstructorState): TIngredient | null => state.bun,
    (state: TBurgerConstructorState): TConstructorIngredient[] => state.ingredients,
  ],
  (bun, ingredients) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }
);

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },

    moveIngredient: (
      state,
      action: PayloadAction<{
        fromIndex: number;
        toIndex: number;
      }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedIngredient] = state.ingredients.splice(fromIndex, 1);

      if (movedIngredient) {
        state.ingredients.splice(toIndex, 0, movedIngredient);
      }
    },

    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
  selectors: {
    selectConstructorBun: (state) => state.bun,
    selectConstructorIngredients: (state) => state.ingredients,
    selectTotalPrice: selectTotalPriceFromState,
    selectIngredientCounts: selectIngredientCountsFromState,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  burgerConstructorSlice.actions;
export const {
  selectConstructorBun,
  selectConstructorIngredients,
  selectTotalPrice,
  selectIngredientCounts,
} = burgerConstructorSlice.selectors;
