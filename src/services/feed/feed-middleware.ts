import { createWebSocketMiddleware } from '@services/socket/socket-middleware';
import { getSocketResponseError, parseOrdersResponse } from '@utils/order';

import {
  connectFeed,
  disconnectFeed,
  feedSocketClosed,
  feedSocketError,
  feedSocketMessage,
  feedSocketOpened,
} from './feed-slice';

import type { TOrdersResponse } from '@utils/types';

export const feedMiddleware = createWebSocketMiddleware<TOrdersResponse>({
  actions: {
    connect: connectFeed,
    disconnect: disconnectFeed,
    error: feedSocketError,
    message: feedSocketMessage,
    opened: feedSocketOpened,
    closed: feedSocketClosed,
  },
  getMessageError: getSocketResponseError,
  parseMessage: parseOrdersResponse,
});
