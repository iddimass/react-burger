import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import type { TGroupedOrderIngredient } from '@utils/order';

import styles from './order-ingredient.module.css';

type TOrderIngredientProps = TGroupedOrderIngredient;

export const OrderIngredient = ({
  count,
  ingredient,
}: TOrderIngredientProps): React.JSX.Element => (
  <li className={styles.ingredient}>
    <div className={styles.image_wrapper}>
      <img
        className={styles.image}
        src={ingredient.image_mobile}
        alt={ingredient.name}
      />
    </div>

    <p className={`${styles.name} text text_type_main-default mr-4`}>
      {ingredient.name}
    </p>

    <div className={styles.price}>
      <span className="text text_type_digits-default mr-2">
        {count} x {ingredient.price}
      </span>
      <CurrencyIcon type="primary" />
    </div>
  </li>
);
