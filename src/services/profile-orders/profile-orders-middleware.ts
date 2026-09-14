import { createWebSocketMiddleware } from '@services/socket/socket-middleware';
import { getSocketResponseError, parseOrdersResponse } from '@utils/order';

import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSocketClosed,
  profileOrdersSocketError,
  profileOrdersSocketMessage,
  profileOrdersSocketOpened,
} from './profile-orders-slice';

import type { TOrdersResponse } from '@utils/types';

export const profileOrdersMiddleware = createWebSocketMiddleware<TOrdersResponse>({
  actions: {
    connect: connectProfileOrders,
    disconnect: disconnectProfileOrders,
    error: profileOrdersSocketError,
    message: profileOrdersSocketMessage,
    opened: profileOrdersSocketOpened,
    closed: profileOrdersSocketClosed,
  },
  getMessageError: getSocketResponseError,
  parseMessage: parseOrdersResponse,
});
