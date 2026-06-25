import { MOCK_ORDER_ID } from '@/utils/constants';

import doneIcon from '../../images/done.svg';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  return (
    <section className={`${styles.container} mb-15`}>
      <p className={`${styles.order_id} text text_type_digits-large mb-8 mt-9`}>
        {MOCK_ORDER_ID}
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
