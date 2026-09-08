import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { OrderBoard } from '@components/orders/order-board/order-board';
import { OrderList } from '@components/orders/order-list/order-list';
import {
  connectFeed,
  disconnectFeed,
  selectFeedError,
  selectFeedIsConnecting,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { getFeedOrderRoute, WS_BASE_URL, WsRoutes } from '@utils/constants';
import { isOrderValid } from '@utils/order';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const isConnecting = useAppSelector(selectFeedIsConnecting);
  const error = useAppSelector(selectFeedError);
  const validOrders = orders.filter((order) => isOrderValid(order, ingredients));

  useEffect((): (() => void) => {
    dispatch(connectFeed(`${WS_BASE_URL}${WsRoutes.ALL_ORDERS}`));

    return (): void => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  if (isConnecting && orders.length === 0) {
    return (
      <main className={styles.message}>
        <Preloader />
      </main>
    );
  }

  if (error && orders.length === 0) {
    return (
      <main className={`${styles.message} text text_type_main-medium`}>{error}</main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className="text text_type_main-large">Лента заказов</h1>

      <div className={`${styles.content} mt-5`}>
        <OrderList
          getOrderRoute={getFeedOrderRoute}
          ingredients={ingredients}
          orders={validOrders}
        />
        <OrderBoard orders={validOrders} total={total} totalToday={totalToday} />
      </div>
    </main>
  );
};
