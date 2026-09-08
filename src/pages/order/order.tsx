import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Modal from '@components/modal/modal';
import { OrderInfo } from '@components/orders/order-info/order-info';
import { selectFeedOrders } from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { fetchOrderById } from '@services/order-info/order-info-actions';
import {
  clearOrderInfo,
  selectOrderInfo,
  selectOrderInfoError,
  selectOrderInfoLoading,
} from '@services/order-info/order-info-slice';
import { selectProfileOrders } from '@services/profile-orders/profile-orders-slice';
import { isOrderValid } from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order.module.css';

type TCurrentOrderState = {
  error: string | null;
  isLoading: boolean;
  order: TOrder | null;
};

const useCurrentOrder = (): TCurrentOrderState => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const feedOrders = useAppSelector(selectFeedOrders);
  const profileOrders = useAppSelector(selectProfileOrders);
  const fetchedOrder = useAppSelector(selectOrderInfo);
  const isLoading = useAppSelector(selectOrderInfoLoading);
  const error = useAppSelector(selectOrderInfoError);

  const socketOrder = [...feedOrders, ...profileOrders].find(
    (order) => order._id === id
  );

  useEffect((): (() => void) => {
    const request = id && !socketOrder ? dispatch(fetchOrderById(id)) : null;

    return (): void => {
      request?.abort();
      dispatch(clearOrderInfo());
    };
  }, [dispatch, id, socketOrder]);

  const matchingFetchedOrder = fetchedOrder?._id === id ? fetchedOrder : null;
  const orderCandidate = socketOrder ?? matchingFetchedOrder;
  const order =
    orderCandidate && isOrderValid(orderCandidate, ingredients) ? orderCandidate : null;

  return {
    error,
    isLoading,
    order,
  };
};

const OrderContent = ({
  numberAlign = 'center',
}: {
  numberAlign?: 'center' | 'left';
}): React.JSX.Element => {
  const ingredients = useAppSelector(selectIngredients);
  const { error, isLoading, order } = useCurrentOrder();

  if (isLoading || (!order && !error)) {
    return (
      <div className={styles.message}>
        <Preloader />
      </div>
    );
  }

  if (!order) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        {error ?? 'Заказ не найден'}
      </p>
    );
  }

  return <OrderInfo ingredients={ingredients} numberAlign={numberAlign} order={order} />;
};

export const OrderPage = (): React.JSX.Element => (
  <main className={styles.page}>
    <OrderContent />
  </main>
);

export const OrderModal = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = useCallback((): void => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal onClose={handleClose}>
      <OrderContent numberAlign="left" />
    </Modal>
  );
};
