import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { burgerConstructorSlice } from './burger-constructor/constructor-slice';
import { feedMiddleware } from './feed/feed-middleware';
import { feedSlice } from './feed/feed-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderInfoSlice } from './order-info/order-info-slice';
import { orderSlice } from './order/order-slice';
import { profileOrdersMiddleware } from './profile-orders/profile-orders-middleware';
import { profileOrdersSlice } from './profile-orders/profile-orders-slice';
import { selectedIngredientSlice } from './selected-ingredient/selected-ingredient-slice';
import { userSlice } from './user/user-slice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  selectedIngredientSlice,
  orderSlice,
  orderInfoSlice,
  userSlice,
  feedSlice,
  profileOrdersSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
