import { formatOrderNumber } from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order-board.module.css';

const MAX_ORDERS_PER_STATUS = 10; // Больше - не красиво =(
const MAX_ORDERS_PER_COLUMN = 5;

type TOrderBoardProps = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

const getNumberColumns = (orders: TOrder[]): number[][] => {
  const orderNumbers = orders
    .slice(0, MAX_ORDERS_PER_STATUS)
    .map((order) => order.number);

  return [
    orderNumbers.slice(0, MAX_ORDERS_PER_COLUMN),
    orderNumbers.slice(MAX_ORDERS_PER_COLUMN),
  ].filter((column) => column.length > 0);
};

const OrderNumbers = ({
  columns,
  isDone = false,
}: {
  columns: number[][];
  isDone?: boolean;
}): React.JSX.Element => (
  <div className={styles.number_columns}>
    {columns.map((column, columnIndex) => (
      <ul className={styles.number_column} key={columnIndex}>
        {column.map((number) => (
          <li
            className={`${isDone ? styles.number_done : ''} text text_type_digits-default`}
            key={number}
          >
            {formatOrderNumber(number)}
          </li>
        ))}
      </ul>
    ))}
  </div>
);

export const OrderBoard = ({
  orders,
  total,
  totalToday,
}: TOrderBoardProps): React.JSX.Element => {
  const doneOrders = getNumberColumns(orders.filter((order) => order.status === 'done'));
  const workOrders = getNumberColumns(orders.filter((order) => order.status !== 'done'));

  return (
    <section>
      <div className={styles.statuses}>
        <div>
          <h2 className="text text_type_main-medium mb-6">Готовы:</h2>
          <OrderNumbers columns={doneOrders} isDone />
        </div>

        <div>
          <h2 className="text text_type_main-medium mb-6">В работе:</h2>
          <OrderNumbers columns={workOrders} />
        </div>
      </div>

      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за все время:</h2>
        <p className={`${styles.total} text text_type_digits-large`}>
          {total.toLocaleString('ru-RU')}
        </p>
      </div>

      <div className="mt-15">
        <h2 className="text text_type_main-medium">Выполнено за сегодня:</h2>
        <p className={`${styles.total} text text_type_digits-large`}>
          {totalToday.toLocaleString('ru-RU')}
        </p>
      </div>
    </section>
  );
};
