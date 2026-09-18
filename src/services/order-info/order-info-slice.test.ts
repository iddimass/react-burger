import { describe, expect, it } from 'vitest';

import { testOrder } from '@utils/test-fixtures';

import { fetchOrderById } from './order-info-actions';
import { clearOrderInfo, orderInfoSlice } from './order-info-slice';

const reducer = orderInfoSlice.reducer;
const initialState = {
  order: null,
  isLoading: false,
  error: null,
};

describe('Редьюсер информации о заказе', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('очищает информацию о заказе', () => {
    const state = reducer(
      {
        order: testOrder,
        isLoading: true,
        error: 'Previous error',
      },
      clearOrderInfo()
    );

    expect(state).toEqual(initialState);
  });

  it('включает загрузку и очищает старые данные при запросе заказа', () => {
    const state = reducer(
      {
        order: testOrder,
        isLoading: false,
        error: 'Previous error',
      },
      fetchOrderById.pending('request-id', String(testOrder.number))
    );

    expect(state).toEqual({
      order: null,
      isLoading: true,
      error: null,
    });
  });

  it('сохраняет полученный заказ', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchOrderById.fulfilled(testOrder, 'request-id', String(testOrder.number))
    );

    expect(state).toEqual({
      order: testOrder,
      isLoading: false,
      error: null,
    });
  });

  it('сохраняет текст ошибки из ответа', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchOrderById.rejected(
        new Error('Request failed'),
        'request-id',
        String(testOrder.number),
        'Ошибка загрузки заказа'
      )
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка загрузки заказа',
    });
  });

  it('показывает стандартную ошибку, если сервер не вернул текст', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchOrderById.rejected(
        new Error('Request failed'),
        'request-id',
        String(testOrder.number)
      )
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Не удалось получить информацию о заказе',
    });
  });

  it('не меняет состояние после отменённого запроса', () => {
    const loadingState = {
      ...initialState,
      isLoading: true,
    };
    const action = {
      type: fetchOrderById.rejected.type,
      payload: undefined,
      error: { message: 'Aborted' },
      meta: {
        aborted: true,
        arg: String(testOrder.number),
        condition: false,
        rejectedWithValue: false,
        requestId: 'request-id',
        requestStatus: 'rejected' as const,
      },
    };

    expect(reducer(loadingState, action)).toEqual(loadingState);
  });
});
