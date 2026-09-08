import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import {
  formatOrderNumber,
  getOrderIngredients,
  getOrderStatusLabel,
  getOrderTotal,
} from '@utils/order';

import type { TIngredient, TOrder } from '@utils/types';

import styles from './order-card.module.css';

const MAX_VISIBLE_INGREDIENTS = 6; // Больше - не красиво =(

type TOrderCardProps = {
  ingredients: TIngredient[];
  order: TOrder;
  showStatus?: boolean;
  to: string;
};

export const OrderCard = ({
  ingredients,
  order,
  showStatus = false,
  to,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const orderIngredients = getOrderIngredients(order, ingredients);
  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenIngredientsCount = orderIngredients.length - MAX_VISIBLE_INGREDIENTS;
  const status = getOrderStatusLabel(order.status);

  return (
    <article className={styles.card}>
      <Link className={styles.link} state={{ backgroundLocation: location }} to={to}>
        <div className={styles.header}>
          <p className="text text_type_digits-default">
            #{formatOrderNumber(order.number)}
          </p>
          <FormattedDate
            className="text text_type_main-default text_color_inactive"
            date={new Date(order.createdAt)}
          />
        </div>

        <h2 className="text text_type_main-medium mt-6">{order.name}</h2>

        {showStatus && (
          <p
            className={`${styles.status} ${order.status === 'done' ? styles.status_done : ''} text text_type_main-default mt-2`}
          >
            {status}
          </p>
        )}

        <div className={`${styles.footer} mt-6`}>
          <ul className={styles.ingredients}>
            {visibleIngredients.map((ingredient, index) => {
              const isLastIngredient = index === MAX_VISIBLE_INGREDIENTS - 1;

              return (
                <li
                  className={styles.ingredient}
                  key={`${ingredient._id}-${index}`}
                  style={{ zIndex: visibleIngredients.length - index }}
                >
                  <img
                    className={styles.ingredient_image}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                  />

                  {isLastIngredient && hiddenIngredientsCount > 0 && (
                    <span className={`${styles.more} text text_type_main-default`}>
                      +{hiddenIngredientsCount}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className={styles.price}>
            <span className="text text_type_digits-default mr-2">
              {getOrderTotal(order, ingredients)}
            </span>
            <CurrencyIcon type="primary" />
          </div>
        </div>
      </Link>
    </article>
  );
};
