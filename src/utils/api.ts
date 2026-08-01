import { API_BASE_URL } from './constants';
import { getAccessToken, getRefreshToken, setTokens } from './token-storage';

import type {
  TAuthResponse,
  TAuthUserResponse,
  TBasicResponse,
  TIngredient,
  TOrderResponse,
  TUserResponse,
  TUserUpdate,
} from './types';

type TApiResponse = {
  success: boolean;
  message?: string;
};

const API_ERROR_MESSAGES: Record<string, string> = {
  'email or password are incorrect': 'Ой! Неверная почта или пароль',
  'Email, password and name are required fields':
    'Ой! Почта, пароль и имя — обязательные поля',
  'Invalid credentials provided': 'Ой! Введите новый пароль и код из письма',
};

const getApiErrorMessage = (message: string): string =>
  API_ERROR_MESSAGES[message] ?? message;

const createHeaders = (headers?: HeadersInit): Headers => {
  const result = new Headers(headers);

  if (!result.has('Content-Type')) {
    result.set('Content-Type', 'application/json');
  }

  return result;
};

const checkResponse = async <T extends TApiResponse>(response: Response): Promise<T> => {
  const data = (await response.json()) as T;

  if (!response.ok) {
    const message = data.message
      ? getApiErrorMessage(data.message)
      : `Ошибка запроса: ${response.status}`;

    throw new Error(message);
  }

  return data;
};

const checkSuccess = <T extends TApiResponse>(data: T): T => {
  if (!data.success) {
    throw new Error(
      data.message ? getApiErrorMessage(data.message) : 'Запрос завершился с ошибкой'
    );
  }

  return data;
};

const request = async <T extends TApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: createHeaders(options.headers),
  });

  const data = await checkResponse<T>(response);

  return checkSuccess(data);
};

const normalizeError = (error: unknown, fallback: string): Error => {
  return error instanceof Error ? error : new Error(fallback);
};

export const refreshTokenRequest = (): Promise<TAuthResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    return Promise.reject(new Error('Токен обновления отсутствует'));
  }

  return request<TAuthResponse>('auth/token', {
    method: 'POST',
    body: JSON.stringify({
      token: refreshToken,
    }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось обновить токен');
  });
};

export const fetchWithRefresh = async <T extends TApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = createHeaders(options.headers);
  const accessToken = getAccessToken();

  if (accessToken) {
    headers.set('authorization', accessToken);
  }

  try {
    return await request<T>(endpoint, {
      ...options,
      headers,
    });
  } catch (error: unknown) {
    if (!(error instanceof Error) || error.message !== 'jwt expired') {
      throw error;
    }

    const tokens = await refreshTokenRequest();

    setTokens(tokens.accessToken, tokens.refreshToken);
    headers.set('authorization', tokens.accessToken);

    return request<T>(endpoint, {
      ...options,
      headers,
    });
  }
};

export const getIngredients = (): Promise<TIngredient[]> =>
  request<{ success: boolean; data: TIngredient[] }>('ingredients')
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw normalizeError(error, 'Не удалось получить ингредиенты');
    });

export const createOrderRequest = (ingredients: string[]): Promise<TOrderResponse> =>
  fetchWithRefresh<TOrderResponse>('orders', {
    method: 'POST',
    body: JSON.stringify({ ingredients }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось оформить заказ');
  });

export const registerRequest = (
  email: string,
  password: string,
  name: string
): Promise<TAuthUserResponse> =>
  request<TAuthUserResponse>('auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось зарегистрироваться');
  });

export const loginRequest = (
  email: string,
  password: string
): Promise<TAuthUserResponse> =>
  request<TAuthUserResponse>('auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось войти в систему');
  });

export const logoutRequest = (refreshToken: string): Promise<TBasicResponse> =>
  request<TBasicResponse>('auth/logout', {
    method: 'POST',
    body: JSON.stringify({
      token: refreshToken,
    }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось выйти из системы');
  });

export const passwordForgotRequest = (email: string): Promise<TBasicResponse> =>
  request<TBasicResponse>('password-reset', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось отправить письмо для сброса пароля');
  });

export const passwordResetRequest = (
  password: string,
  token: string
): Promise<TBasicResponse> =>
  request<TBasicResponse>('password-reset/reset', {
    method: 'POST',
    body: JSON.stringify({ password, token }),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось установить новый пароль');
  });

export const getUserRequest = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'GET',
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось получить информацию о пользователе');
  });

export const updateUserRequest = (user: TUserUpdate): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>('auth/user', {
    method: 'PATCH',
    body: JSON.stringify(user),
  }).catch((error: unknown) => {
    throw normalizeError(error, 'Не удалось обновить информацию о пользователе');
  });
