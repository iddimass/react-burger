import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/constructor-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderSlice } from './order/order-slice';
import { selectedIngredientSlice } from './selected-ingredient/selected-ingredient-slice';
import { userSlice } from './user/user-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  selectedIngredientSlice,
  orderSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
