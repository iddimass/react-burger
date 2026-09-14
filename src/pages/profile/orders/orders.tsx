import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';

import { OrderList } from '@components/orders/order-list/order-list';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSocketError,
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersHasLoaded,
  selectProfileOrdersIsConnecting,
} from '@services/profile-orders/profile-orders-slice';
import { refreshTokenRequest } from '@utils/api';
import { getProfileOrderRoute, WS_BASE_URL, WsRoutes } from '@utils/constants';
import { isOrderValid } from '@utils/order';
import { getAccessToken, setTokens } from '@utils/token-storage';

import styles from './orders.module.css';

const INVALID_TOKEN_ERROR = 'Invalid or missing token';

const getProfileOrdersUrl = (accessToken: string): string => {
  const token = accessToken.replace(/^Bearer\s+/, '');

  return `${WS_BASE_URL}${WsRoutes.USER_ORDERS}?token=${encodeURIComponent(token)}`;
};

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const tokenRefreshAttempted = useRef(false);
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectProfileOrders);
  const hasLoaded = useAppSelector(selectProfileOrdersHasLoaded);
  const isConnecting = useAppSelector(selectProfileOrdersIsConnecting);
  const error = useAppSelector(selectProfileOrdersError);
  const validOrders = orders.filter((order) => isOrderValid(order, ingredients));

  useEffect((): (() => void) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      dispatch(connectProfileOrders(getProfileOrdersUrl(accessToken)));
    } else {
      dispatch(profileOrdersSocketError('Токен доступа отсутствует'));
    }

    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  useEffect(() => {
    if (error !== INVALID_TOKEN_ERROR || tokenRefreshAttempted.current) {
      return;
    }

    tokenRefreshAttempted.current = true;

    void refreshTokenRequest()
      .then((tokens) => {
        setTokens(tokens.accessToken, tokens.refreshToken);
        dispatch(connectProfileOrders(getProfileOrdersUrl(tokens.accessToken)));
      })
      .catch((refreshError: unknown) => {
        dispatch(
          profileOrdersSocketError(
            refreshError instanceof Error
              ? refreshError.message
              : 'Не удалось обновить токен'
          )
        );
      });
  }, [dispatch, error]);

  if (
    (!hasLoaded || isConnecting || error === INVALID_TOKEN_ERROR) &&
    validOrders.length === 0
  ) {
    return (
      <section className={styles.message}>
        <Preloader />
      </section>
    );
  }

  if (error && error !== INVALID_TOKEN_ERROR && validOrders.length === 0) {
    return (
      <section className={`${styles.message} text text_type_main-medium`}>
        {error}
      </section>
    );
  }

  if (validOrders.length === 0) {
    return (
      <section className={`${styles.message} text text_type_main-medium`}>
        У вас пока нет заказов
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <OrderList
        getOrderRoute={getProfileOrderRoute}
        ingredients={ingredients}
        orders={validOrders}
        showStatus
      />
    </section>
  );
};
