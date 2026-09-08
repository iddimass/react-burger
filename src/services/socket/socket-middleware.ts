import type { Middleware, PayloadAction, UnknownAction } from '@reduxjs/toolkit';

type TPayloadActionCreator<TPayload> = {
  (payload: TPayload): UnknownAction;
  match: (action: unknown) => action is PayloadAction<TPayload>;
};

type TEmptyActionCreator = {
  (): UnknownAction;
  match: (action: unknown) => action is PayloadAction<undefined>;
};

type TWebSocketActions<TMessage> = {
  connect: TPayloadActionCreator<string>;
  disconnect: TEmptyActionCreator;
  error: TPayloadActionCreator<string>;
  message: TPayloadActionCreator<TMessage>;
  opened: TEmptyActionCreator;
  closed: TEmptyActionCreator;
};

type TWebSocketMiddlewareOptions<TMessage> = {
  actions: TWebSocketActions<TMessage>;
  getMessageError: (value: unknown) => string | null;
  parseMessage: (value: unknown) => TMessage | null;
};

export const createWebSocketMiddleware = <TMessage>({
  actions,
  getMessageError,
  parseMessage,
}: TWebSocketMiddlewareOptions<TMessage>): Middleware => {
  let socket: WebSocket | null = null;

  const closeSocket = (): void => {
    if (!socket) {
      return;
    }

    const currentSocket = socket;
    socket = null;
    currentSocket.onopen = null;
    currentSocket.onerror = null;
    currentSocket.onmessage = null;
    currentSocket.onclose = null;
    currentSocket.close();
  };

  return (storeApi) => (next) => (action) => {
    const result = next(action);

    if (actions.connect.match(action)) {
      closeSocket();

      const currentSocket = new WebSocket(action.payload);
      let hasConnectionError = false;
      socket = currentSocket;

      currentSocket.onopen = (): void => {
        storeApi.dispatch(actions.opened());
      };

      currentSocket.onerror = (): void => {
        hasConnectionError = true;
      };

      currentSocket.onmessage = (event: MessageEvent): void => {
        try {
          const value = JSON.parse(String(event.data)) as unknown;
          const messageError = getMessageError(value);

          if (messageError) {
            storeApi.dispatch(actions.error(messageError));
            return;
          }

          const message = parseMessage(value);

          if (message) {
            hasConnectionError = false;
            storeApi.dispatch(actions.message(message));
          }
        } catch {
          // Некорректные сообщения пропускаются и не попадают в хранилище
        }
      };

      currentSocket.onclose = (): void => {
        if (socket === currentSocket) {
          socket = null;
        }

        if (hasConnectionError) {
          storeApi.dispatch(actions.error('Ошибка WebSocket-соединения'));
        }

        storeApi.dispatch(actions.closed());
      };
    }

    if (actions.disconnect.match(action)) {
      closeSocket();
    }

    return result;
  };
};
