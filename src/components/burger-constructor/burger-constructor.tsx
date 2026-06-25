import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  bun: TIngredient | null;
  fillings: TIngredient[];
  totalPrice: number;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  bun,
  fillings,
  totalPrice,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  return (
    <section className={styles.burger_constructor}>
      {bun && (
        <div className="ml-8 mb-4">
          <ConstructorElement
            type="top"
            isLocked
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <ul className={`${styles.fillings} custom-scroll`}>
        {fillings.map((item, index) => (
          <li key={`${item._id}_${index}`} className={styles.filling_item}>
            <DragIcon type="secondary" />
            <ConstructorElement
              text={item.name}
              price={item.price}
              thumbnail={item.image}
            />
          </li>
        ))}
      </ul>

      {bun && (
        <div className="ml-8 mt-4">
          <ConstructorElement
            type="bottom"
            isLocked
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.footer} mt-10 mr-4`}>
        <div className={`${styles.total} mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button htmlType="button" type="primary" size="large" onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};
