import { describe, expect, it } from 'vitest';

import { testUser } from '@utils/test-fixtures';

import {
  checkUserAuth,
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
} from './user-actions';
import { clearUserError, userSlice } from './user-slice';

const reducer = userSlice.reducer;
const initialState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};
const authorizedState = {
  user: testUser,
  isAuthChecked: true,
  isLoading: false,
  error: null,
};
const registerData = {
  ...testUser,
  password: 'password',
};
const loginData = {
  email: testUser.email,
  password: 'password',
};
const updateData = {
  ...testUser,
  password: 'new-password',
};
const resetData = {
  password: 'new-password',
  token: 'reset-token',
};
const basicResponse = {
  success: true,
  message: 'Операция выполнена',
};

describe('Редьюсер пользователя', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('очищает ошибку пользователя', () => {
    const state = reducer(
      { ...initialState, error: 'Previous error' },
      clearUserError()
    );

    expect(state).toEqual(initialState);
  });

  it('включает загрузку и сбрасывает ошибку перед каждым запросом', () => {
    const actions = [
      registerUser.pending('register-id', registerData),
      loginUser.pending('login-id', loginData),
      logoutUser.pending('logout-id', undefined),
      checkUserAuth.pending('auth-id', undefined),
      updateUser.pending('update-id', updateData),
      forgotPassword.pending('forgot-id', testUser.email),
      resetPassword.pending('reset-id', resetData),
    ];

    actions.forEach((action) => {
      const state = reducer({ ...authorizedState, error: 'Previous error' }, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  it('сохраняет пользователя после регистрации, входа и обновления профиля', () => {
    const updatedUser = { ...testUser, name: 'Обновлённый космонавт' };
    const actions = [
      registerUser.fulfilled(testUser, 'register-id', registerData),
      loginUser.fulfilled(testUser, 'login-id', loginData),
      updateUser.fulfilled(updatedUser, 'update-id', updateData),
    ];

    actions.forEach((action, index) => {
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.user).toEqual(index === 2 ? updatedUser : testUser);
      expect(state.isLoading).toBe(false);
    });
  });

  it('завершает запросы восстановления пароля', () => {
    const actions = [
      forgotPassword.fulfilled(basicResponse, 'forgot-id', testUser.email),
      resetPassword.fulfilled(basicResponse, 'reset-id', resetData),
    ];

    actions.forEach((action) => {
      const state = reducer({ ...initialState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  it('сохраняет пользователя после проверки авторизации', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      checkUserAuth.fulfilled(testUser, 'auth-id', undefined)
    );

    expect(state).toEqual({
      user: testUser,
      isAuthChecked: true,
      isLoading: false,
      error: null,
    });
  });

  it('завершает проверку авторизации, если пользователь не найден', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      checkUserAuth.fulfilled(null, 'auth-id', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      isAuthChecked: true,
    });
  });

  it('очищает пользователя после выхода', () => {
    const state = reducer(
      { ...authorizedState, isLoading: true },
      logoutUser.fulfilled(true, 'logout-id', undefined)
    );

    expect(state).toEqual({
      ...authorizedState,
      user: null,
      isLoading: false,
    });
  });

  it('сохраняет ошибки запросов профиля и пароля', () => {
    const actions = [
      registerUser.rejected(
        new Error('Request failed'),
        'register-id',
        registerData,
        'Ошибка запроса'
      ),
      loginUser.rejected(
        new Error('Request failed'),
        'login-id',
        loginData,
        'Ошибка запроса'
      ),
      updateUser.rejected(
        new Error('Request failed'),
        'update-id',
        updateData,
        'Ошибка запроса'
      ),
      forgotPassword.rejected(
        new Error('Request failed'),
        'forgot-id',
        testUser.email,
        'Ошибка запроса'
      ),
      resetPassword.rejected(
        new Error('Request failed'),
        'reset-id',
        resetData,
        'Ошибка запроса'
      ),
    ];

    actions.forEach((action) => {
      const state = reducer({ ...authorizedState, isLoading: true }, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка запроса');
    });
  });

  it('завершает проверку авторизации даже при ошибке', () => {
    const state = reducer(
      { ...authorizedState, isLoading: true },
      checkUserAuth.rejected(
        new Error('Request failed'),
        'auth-id',
        undefined,
        'Ошибка авторизации'
      )
    );

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      isLoading: false,
      error: 'Ошибка авторизации',
    });
  });

  it('очищает пользователя даже при ошибке выхода', () => {
    const state = reducer(
      { ...authorizedState, isLoading: true },
      logoutUser.rejected(
        new Error('Request failed'),
        'logout-id',
        undefined,
        'Ошибка выхода'
      )
    );

    expect(state).toEqual({
      user: null,
      isAuthChecked: true,
      isLoading: false,
      error: 'Ошибка выхода',
    });
  });

  it('показывает стандартную ошибку, если сервер не вернул текст', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      registerUser.rejected(new Error('Request failed'), 'register-id', registerData)
    );

    expect(state.error).toBe('Произошла неизвестная ошибка');
    expect(state.isLoading).toBe(false);
  });
});
