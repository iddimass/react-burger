import { API_BASE_URL } from './constants';

import type { TIngredient, TOrderResponse } from './types';

const checkResponse = <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    return Promise.reject(new Error(`Ошибка запроса: ${response.status}`));
  }

  return response.json() as Promise<T>;
};

// Получаем ингредиенты
export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then((response) =>
      checkResponse<{ success: boolean; data: TIngredient[] }>(response)
    )
    .then((response) => response.data)
    .catch((error: unknown) => {
      throw error instanceof Error
        ? error
        : new Error('Не удалось получить ингредиенты');
    });

// СОздаём заказ
export const createOrderRequest = (ingredients: string[]): Promise<TOrderResponse> =>
  fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  })
    .then((response) => checkResponse<TOrderResponse>(response))
    .catch((error: unknown) => {
      throw error instanceof Error ? error : new Error('Не удалось оформить заказ');
    });
