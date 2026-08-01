import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag, type DragSourceMonitor } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { getIngredientRoute } from '@utils/constants';

import type { TIngredient } from '@utils/types';

import styles from './ingredient-card.module.css';

const INGREDIENT_DRAG_TYPE = 'ingredient';

type TIngredientCardProps = {
  ingredient: TIngredient;
  count: number;
};

type TIngredientDragState = {
  isDragging: boolean;
};

const IngredientCard = ({
  ingredient,
  count,
}: TIngredientCardProps): React.JSX.Element => {
  const location = useLocation();

  const [{ isDragging }, drag] = useDrag<TIngredient, void, TIngredientDragState>(
    () => ({
      type: INGREDIENT_DRAG_TYPE,
      item: ingredient,
      collect: (
        monitor: DragSourceMonitor<TIngredient, void>
      ): TIngredientDragState => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  const setDragRef = (node: HTMLLIElement | null): void => {
    drag(node);
  };

  return (
    <li
      ref={setDragRef}
      className={styles.card}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Link
        to={getIngredientRoute(ingredient._id)}
        state={{ backgroundLocation: location }}
        className={styles.link}
      >
        <div className={styles.image_wrapper}>
          <img className={styles.image} src={ingredient.image} alt={ingredient.name} />

          {count > 0 && (
            <Counter count={count} size="default" extraClass={styles.counter} />
          )}
        </div>

        <div className={`${styles.price} mt-1 mb-1`}>
          <span className="text text_type_digits-default mr-2">{ingredient.price}</span>
          <CurrencyIcon type="primary" />
        </div>

        <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
      </Link>
    </li>
  );
};

export default IngredientCard;
