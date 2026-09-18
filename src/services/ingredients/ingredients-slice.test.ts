import { describe, expect, it } from 'vitest';

import { testIngredients } from '@utils/test-fixtures';

import { fetchIngredients } from './ingredients-actions';
import { ingredientsSlice } from './ingredients-slice';

const reducer = ingredientsSlice.reducer;
const initialState = {
  items: [],
  isLoading: false,
  error: null,
};

describe('Редьюсер списка ингредиентов', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('включает загрузку и сбрасывает ошибку при запросе ингредиентов', () => {
    const state = reducer(
      { ...initialState, error: 'Previous error' },
      fetchIngredients.pending('request-id', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('сохраняет полученные ингредиенты', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(testIngredients, 'request-id', undefined)
    );

    expect(state).toEqual({
      items: testIngredients,
      isLoading: false,
      error: null,
    });
  });

  it('сохраняет текст ошибки из ответа', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(
        new Error('Request failed'),
        'request-id',
        undefined,
        'Ошибка загрузки'
      )
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка загрузки',
    });
  });

  it('показывает стандартную ошибку, если сервер не вернул текст', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(new Error('Request failed'), 'request-id', undefined)
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Не удалось получить ингредиенты',
    });
  });
});
