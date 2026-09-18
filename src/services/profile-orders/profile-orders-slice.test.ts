import { describe, expect, it } from 'vitest';

import { testOrder, testOrdersResponse } from '@utils/test-fixtures';

import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSlice,
  profileOrdersSocketClosed,
  profileOrdersSocketError,
  profileOrdersSocketMessage,
  profileOrdersSocketOpened,
} from './profile-orders-slice';

const reducer = profileOrdersSlice.reducer;
const initialState = {
  orders: [],
  hasLoaded: false,
  isConnected: false,
  isConnecting: false,
  error: null,
};

describe('Редьюсер заказов пользователя', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('начинает подключение при пустом списке заказов', () => {
    const state = reducer(
      { ...initialState, error: 'Previous error' },
      connectProfileOrders('wss://example.server/orders')
    );

    expect(state).toEqual({
      ...initialState,
      isConnecting: true,
    });
  });

  it('сохраняет признак загрузки при повторном подключении', () => {
    const state = reducer(
      {
        ...initialState,
        orders: [testOrder],
      },
      connectProfileOrders('wss://example.server/orders')
    );

    expect(state.hasLoaded).toBe(true);
    expect(state.isConnecting).toBe(true);
  });

  it('отключается и очищает заказы пользователя', () => {
    const state = reducer(
      {
        orders: [testOrder],
        hasLoaded: true,
        isConnected: true,
        isConnecting: true,
        error: 'Previous error',
      },
      disconnectProfileOrders()
    );

    expect(state).toEqual(initialState);
  });

  it('отмечает WebSocket-соединение как открытое', () => {
    const state = reducer(
      { ...initialState, isConnecting: true, error: 'Previous error' },
      profileOrdersSocketOpened()
    );

    expect(state).toEqual({
      ...initialState,
      isConnected: true,
      isConnecting: true,
    });
  });

  it('отмечает WebSocket-соединение как закрытое', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      profileOrdersSocketClosed()
    );

    expect(state).toEqual(initialState);
  });

  it('сохраняет ошибку WebSocket-соединения', () => {
    const state = reducer(
      { ...initialState, isConnecting: true },
      profileOrdersSocketError('Ошибка WebSocket')
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка WebSocket',
    });
  });

  it('сохраняет заказы из WebSocket-сообщения', () => {
    const state = reducer(
      { ...initialState, isConnecting: true, error: 'Previous error' },
      profileOrdersSocketMessage(testOrdersResponse)
    );

    expect(state).toEqual({
      orders: testOrdersResponse.orders,
      hasLoaded: true,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  });
});
