import { OrderCard } from '@components/orders/order-card/order-card';
import { isOrderValid } from '@utils/order';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-list.module.css';

type TOrderListProps = {
  getOrderRoute: (id: string) => string;
  ingredients: TIngredient[];
  orders: TOrder[];
  showStatus?: boolean;
};

export const OrderList = ({
  getOrderRoute,
  ingredients,
  orders,
  showStatus = false,
}: TOrderListProps): React.JSX.Element => {
  const validOrders = orders.filter((order) => isOrderValid(order, ingredients));

  return (
    <ul className={`${styles.list} custom-scroll`}>
      {validOrders.map((order) => (
        <li key={order._id}>
          <OrderCard
            ingredients={ingredients}
            order={order}
            showStatus={showStatus}
            to={getOrderRoute(order._id)}
          />
        </li>
      ))}
    </ul>
  );
};
