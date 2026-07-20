import {
  addIngredient,
  selectConstructorBun,
  selectConstructorIngredients,
  selectTotalPrice,
} from '@/services/burger-constructor/constructor-slice';
import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { createOrder } from '@/services/order/order-actions';
import {
  clearOrderError,
  selectOrderError,
  selectOrderLoading,
} from '@/services/order/order-slice';
import { DraggableTypes } from '@/utils/constants';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  Preloader,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop, type DropTargetMonitor } from 'react-dnd';

import { FillingConstructor } from './filling-constructor';

import type { TIngredient } from '@/utils/types';

import styles from './burger-constructor.module.css';

type TDropState = {
  isOver: boolean;
  ingredient: TIngredient | null;
};

type TFillingsDropState = {
  isOver: boolean;
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const bun = useAppSelector(selectConstructorBun);
  const fillings = useAppSelector(selectConstructorIngredients);
  const totalPrice = useAppSelector(selectTotalPrice);
  const isOrderLoading = useAppSelector(selectOrderLoading);
  const orderError = useAppSelector(selectOrderError);

  const [topBunDropState, topBunDrop] = useDrop<TIngredient, void, TDropState>(
    () => ({
      accept: DraggableTypes.INGREDIENT,

      canDrop: (ingredient: TIngredient): boolean => ingredient.type === 'bun',

      drop: (ingredient: TIngredient): void => {
        dispatch(addIngredient(ingredient));
      },

      collect: (monitor: DropTargetMonitor<TIngredient, void>): TDropState => {
        const isOver = monitor.isOver({ shallow: true }) && monitor.canDrop();

        return {
          isOver,
          ingredient: isOver ? monitor.getItem<TIngredient>() : null,
        };
      },
    }),
    [dispatch]
  );

  const [bottomBunDropState, bottomBunDrop] = useDrop<TIngredient, void, TDropState>(
    () => ({
      accept: DraggableTypes.INGREDIENT,

      canDrop: (ingredient: TIngredient): boolean => ingredient.type === 'bun',

      drop: (ingredient: TIngredient): void => {
        dispatch(addIngredient(ingredient));
      },

      collect: (monitor: DropTargetMonitor<TIngredient, void>): TDropState => {
        const isOver = monitor.isOver({ shallow: true }) && monitor.canDrop();

        return {
          isOver,
          ingredient: isOver ? monitor.getItem<TIngredient>() : null,
        };
      },
    }),
    [dispatch]
  );

  const [{ isOver: isFillingOver }, fillingsDrop] = useDrop<
    TIngredient,
    void,
    TFillingsDropState
  >(
    () => ({
      accept: DraggableTypes.INGREDIENT,

      canDrop: (ingredient: TIngredient): boolean => ingredient.type !== 'bun',

      drop: (ingredient: TIngredient): void => {
        dispatch(addIngredient(ingredient));
      },

      collect: (monitor: DropTargetMonitor<TIngredient, void>): TFillingsDropState => ({
        isOver: monitor.isOver({ shallow: true }) && monitor.canDrop(),
      }),
    }),
    [dispatch]
  );

  const setTopBunDropRef = (node: HTMLDivElement | null): void => {
    topBunDrop(node);
  };

  const setBottomBunDropRef = (node: HTMLDivElement | null): void => {
    bottomBunDrop(node);
  };

  const setFillingsDropRef = (node: HTMLDivElement | null): void => {
    fillingsDrop(node);
  };

  const previewBun = topBunDropState.ingredient ?? bottomBunDropState.ingredient;
  const displayedBun = previewBun ?? bun;

  const handleCreateOrder = (): void => {
    if (!bun || isOrderLoading) return;

    dispatch(clearOrderError());

    const ingredientIds = [bun._id, ...fillings.map((filling) => filling._id), bun._id];

    void dispatch(createOrder(ingredientIds));
  };

  return (
    <section className={styles.burger_constructor}>
      <div
        ref={setTopBunDropRef}
        className={`${styles.bun_drop_zone} mb-4 ${topBunDropState.isOver ? styles.bun_drop_active : ''}`}
      >
        {displayedBun ? (
          <div className={`ml-8`}>
            <ConstructorElement
              type="top"
              isLocked
              text={`${displayedBun.name} (верх)`}
              price={displayedBun.price}
              thumbnail={displayedBun.image}
            />
          </div>
        ) : (
          <div
            className={`constructor-element constructor-element_pos_top ${styles.constructor_placeholder} ml-8`}
          >
            <span className="text text_type_main-default text_color_inactive">
              Перенесите булку
            </span>
          </div>
        )}
      </div>

      <div
        ref={setFillingsDropRef}
        className={`${styles.fillings_drop_zone} ${
          fillings.length === 0
            ? styles.fillings_drop_empty
            : styles.fillings_drop_filled
        } ${isFillingOver ? styles.fillings_drop_active : ''}`}
      >
        {fillings.length > 0 ? (
          <ul className={`${styles.fillings} custom-scroll`}>
            {fillings.map((filling, index) => (
              <FillingConstructor
                key={filling.constructorId}
                ingredient={filling}
                index={index}
              />
            ))}
          </ul>
        ) : (
          <div className={`constructor-element ${styles.constructor_placeholder} ml-8`}>
            <span className="text text_type_main-default text_color_inactive">
              Перенесите начинку
            </span>
          </div>
        )}
      </div>

      {/* Нижняя булка */}
      <div
        ref={setBottomBunDropRef}
        className={`${styles.bun_drop_zone} mt-4 ${bottomBunDropState.isOver ? styles.bun_drop_active : ''}`}
      >
        {displayedBun ? (
          <div className={`ml-8`}>
            <ConstructorElement
              type="bottom"
              isLocked
              text={`${displayedBun.name} (низ)`}
              price={displayedBun.price}
              thumbnail={displayedBun.image}
            />
          </div>
        ) : (
          <div
            className={`constructor-element ${styles.constructor_placeholder} constructor-element_pos_bottom ml-8`}
          >
            <span className="text text_type_main-default text_color_inactive">
              Перенесите булку
            </span>
          </div>
        )}
      </div>

      {orderError && (
        <div className={`${styles.error} mt-4`}>
          <p className="text text_type_main-small text_color_inactive mt-2">
            Возникла ошибка при создании заказа, попробуйте позже :(
          </p>
        </div>
      )}

      <div className={`${styles.footer} mt-10 mr-4`}>
        <div className={`mr-10`}>
          <span className="text text_type_digits-medium mr-2">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>

        {isOrderLoading ? (
          <Preloader />
        ) : (
          <Button
            htmlType="button"
            type="primary"
            size="large"
            disabled={!bun}
            onClick={handleCreateOrder}
          >
            Оформить заказ
          </Button>
        )}
      </div>
    </section>
  );
};
