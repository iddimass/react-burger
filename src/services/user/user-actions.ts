import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getUserRequest,
  loginRequest,
  logoutRequest,
  passwordForgotRequest,
  passwordResetRequest,
  registerRequest,
  updateUserRequest,
} from '@utils/api';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from '@utils/token-storage';

import type { TUserUpdate } from '@utils/types';

type TRegisterData = {
  name: string;
  email: string;
  password: string;
};

type TLoginData = {
  email: string;
  password: string;
};

type TResetPasswordData = {
  password: string;
  token: string;
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  return error instanceof Error ? error.message : fallback;
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerRequest(data.email, data.password, data.name);

      setTokens(response.accessToken, response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось зарегистрироваться'));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginRequest(data.email, data.password);

      setTokens(response.accessToken, response.refreshToken);

      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось войти в систему'));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }

      return true;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось выйти из системы'));
    } finally {
      clearTokens();
    }
  }
);

export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!accessToken || !refreshToken) {
      return null;
    }

    try {
      const response = await getUserRequest();

      return response.user;
    } catch (error: unknown) {
      clearTokens();

      return rejectWithValue(getErrorMessage(error, 'Не удалось проверить авторизацию'));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TUserUpdate, { rejectWithValue }) => {
    try {
      const response = await updateUserRequest(data);

      return response.user;
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось обновить данные пользователя')
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      return await passwordForgotRequest(email);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось отправить письмо для сброса пароля')
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: TResetPasswordData, { rejectWithValue }) => {
    try {
      return await passwordResetRequest(data.password, data.token);
    } catch (error: unknown) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось установить новый пароль')
      );
    }
  }
);
