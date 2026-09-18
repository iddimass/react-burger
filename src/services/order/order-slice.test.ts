import { describe, expect, it } from 'vitest';

import { testBun, testOrderResponse, testSauce } from '@utils/test-fixtures';

import { createOrder } from './order-actions';
import { clearOrder, clearOrderError, orderSlice } from './order-slice';

const reducer = orderSlice.reducer;
const initialState = {
  number: null,
  isLoading: false,
  isModalOpen: false,
  error: null,
};
const ingredientIds = [testBun._id, testSauce._id, testBun._id];

describe('Редьюсер создания заказа', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('очищает данные заказа', () => {
    const state = reducer(
      {
        number: testOrderResponse.order.number,
        isLoading: false,
        isModalOpen: true,
        error: 'Previous error',
      },
      clearOrder()
    );

    expect(state).toEqual(initialState);
  });

  it('очищает ошибку, сохраняя остальные данные заказа', () => {
    const state = reducer(
      {
        number: testOrderResponse.order.number,
        isLoading: false,
        isModalOpen: true,
        error: 'Previous error',
      },
      clearOrderError()
    );

    expect(state).toEqual({
      number: testOrderResponse.order.number,
      isLoading: false,
      isModalOpen: true,
      error: null,
    });
  });

  it('открывает модальное окно и включает загрузку при создании заказа', () => {
    const state = reducer(
      {
        number: 100,
        isLoading: false,
        isModalOpen: false,
        error: 'Previous error',
      },
      createOrder.pending('request-id', ingredientIds)
    );

    expect(state).toEqual({
      number: null,
      isLoading: true,
      isModalOpen: true,
      error: null,
    });
  });

  it('сохраняет номер созданного заказа', () => {
    const state = reducer(
      { ...initialState, isLoading: true, isModalOpen: true },
      createOrder.fulfilled(testOrderResponse, 'request-id', ingredientIds)
    );

    expect(state).toEqual({
      number: testOrderResponse.order.number,
      isLoading: false,
      isModalOpen: true,
      error: null,
    });
  });

  it('закрывает модальное окно и сохраняет текст ошибки', () => {
    const state = reducer(
      { ...initialState, isLoading: true, isModalOpen: true },
      createOrder.rejected(
        new Error('Request failed'),
        'request-id',
        ingredientIds,
        'Ошибка заказа'
      )
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка заказа',
    });
  });

  it('показывает стандартную ошибку, если сервер не вернул текст', () => {
    const state = reducer(
      { ...initialState, isLoading: true, isModalOpen: true },
      createOrder.rejected(new Error('Request failed'), 'request-id', ingredientIds)
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Не удалось оформить заказ',
    });
  });
});
