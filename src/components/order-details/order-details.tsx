import { useAppSelector } from '@/services/hooks';
import { selectOrderLoading, selectOrderNumber } from '@/services/order/order-slice';
import { formatOrderNumber } from '@/utils/order';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';

import doneIcon from '../../images/done.svg';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const orderNumber = useAppSelector(selectOrderNumber);
  const isLoading = useAppSelector(selectOrderLoading);

  if (isLoading || orderNumber === null) {
    return (
      <section className={`${styles.container} ${styles.loading} mb-15`}>
        <Preloader />
      </section>
    );
  }

  return (
    <section className={`${styles.container} mb-15`}>
      <p
        className={`${styles.order_id} text text_type_digits-large mb-8 mt-9`}
        data-testid="order-number"
      >
        {formatOrderNumber(orderNumber)}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className="mb-15">
        <img src={doneIcon} alt="Готово" />
      </div>
      <p className="text text_type_main-default mb-2">Ваш заказ начали готовить</p>
      <p className="text text_type_main-default text_color_inactive">
        Дождитесь готовности на орбитальной станции
      </p>
    </section>
  );
};
