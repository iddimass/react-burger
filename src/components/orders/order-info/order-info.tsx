import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import { OrderIngredient } from '@components/orders/order-ingredient/order-ingredient';
import {
  formatOrderNumber,
  getGroupedOrderIngredients,
  getOrderStatusLabel,
  getOrderTotal,
} from '@utils/order';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  ingredients: TIngredient[];
  numberAlign?: 'center' | 'left';
  order: TOrder;
};

export const OrderInfo = ({
  ingredients,
  numberAlign = 'center',
  order,
}: TOrderInfoProps): React.JSX.Element => {
  const groupedIngredients = getGroupedOrderIngredients(order, ingredients);

  return (
    <section className={styles.container}>
      <p
        className={`${styles.number} ${numberAlign === 'left' ? styles.number_left : ''} text text_type_digits-default`}
      >
        #{formatOrderNumber(order.number)}
      </p>
      <h1 className="text text_type_main-medium mt-10">{order.name}</h1>
      <p
        className={`${styles.status} ${order.status === 'done' ? styles.status_done : ''} text text_type_main-default mt-3`}
      >
        {getOrderStatusLabel(order.status)}
      </p>

      <h2 className="text text_type_main-medium mt-15 mb-6">Состав:</h2>
      <ul className={`${styles.ingredients} custom-scroll`}>
        {groupedIngredients.map((groupedIngredient) => (
          <OrderIngredient
            count={groupedIngredient.count}
            ingredient={groupedIngredient.ingredient}
            key={groupedIngredient.ingredient._id}
          />
        ))}
      </ul>

      <div className={`${styles.footer} mt-10`}>
        <FormattedDate
          className="text text_type_main-default text_color_inactive"
          date={new Date(order.createdAt)}
        />
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">
            {getOrderTotal(order, ingredients)}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </section>
  );
};
