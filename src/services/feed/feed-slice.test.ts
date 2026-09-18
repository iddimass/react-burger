import { describe, expect, it } from 'vitest';

import { testOrdersResponse } from '@utils/test-fixtures';

import {
  connectFeed,
  disconnectFeed,
  feedSlice,
  feedSocketClosed,
  feedSocketError,
  feedSocketMessage,
  feedSocketOpened,
} from './feed-slice';

const reducer = feedSlice.reducer;
const initialState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isConnecting: false,
  error: null,
};

describe('Редьюсер ленты заказов', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('начинает подключение к ленте и сбрасывает прошлую ошибку', () => {
    const state = reducer(
      { ...initialState, error: 'Previous error' },
      connectFeed('wss://example.server/orders')
    );

    expect(state).toEqual({
      ...initialState,
      isConnecting: true,
    });
  });

  it('отключается от ленты заказов', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      disconnectFeed()
    );

    expect(state).toEqual(initialState);
  });

  it('отмечает WebSocket-соединение как открытое', () => {
    const state = reducer(
      { ...initialState, isConnecting: true, error: 'Previous error' },
      feedSocketOpened()
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
      feedSocketClosed()
    );

    expect(state).toEqual(initialState);
  });

  it('сохраняет ошибку WebSocket-соединения', () => {
    const state = reducer(
      { ...initialState, isConnecting: true },
      feedSocketError('Ошибка WebSocket')
    );

    expect(state).toEqual({
      ...initialState,
      error: 'Ошибка WebSocket',
    });
  });

  it('сохраняет заказы и статистику из WebSocket-сообщения', () => {
    const state = reducer(
      { ...initialState, isConnecting: true, error: 'Previous error' },
      feedSocketMessage(testOrdersResponse)
    );

    expect(state).toEqual({
      orders: testOrdersResponse.orders,
      total: testOrdersResponse.total,
      totalToday: testOrdersResponse.totalToday,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  });
});
