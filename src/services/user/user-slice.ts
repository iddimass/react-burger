import { createSlice, isAnyOf } from '@reduxjs/toolkit';

import {
  checkUserAuth,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from './user-actions';

import type { TUser } from '@utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.user !== null,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
      })
      .addMatcher(
        isAnyOf(registerUser.fulfilled, loginUser.fulfilled, updateUser.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(forgotPassword.fulfilled, resetPassword.fulfilled),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          registerUser.pending,
          loginUser.pending,
          logoutUser.pending,
          checkUserAuth.pending,
          updateUser.pending,
          forgotPassword.pending,
          resetPassword.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          logoutUser.rejected,
          checkUserAuth.rejected,
          updateUser.rejected,
          forgotPassword.rejected,
          resetPassword.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.error =
            typeof action.payload === 'string'
              ? action.payload
              : 'Произошла неизвестная ошибка';
        }
      );
  },
});

export const { clearUserError } = userSlice.actions;
export const {
  selectUser,
  selectIsAuthenticated,
  selectIsAuthChecked,
  selectUserLoading,
  selectUserError,
} = userSlice.selectors;
