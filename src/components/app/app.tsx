import { getIngredients } from '@/utils/api';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import type { TIngredient } from '@/utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);

  const [hasError, setHasError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // load ingredients from API on component mount
  useEffect(() => {
    setIsLoading(true);
    getIngredients()
      .then((data) => {
        setIngredients(data);
      })
      .catch((err: unknown) => {
        const message =
          err instanceof Error ? err.message : 'Произошла неизвестная ошибка';

        setHasError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleOpenOrderModal = useCallback(() => setIsOrderModalOpen(true), []);
  const handleCloseOrderModal = useCallback(() => setIsOrderModalOpen(false), []);
  const handleCloseIngredientModal = useCallback(() => setSelectedIngredient(null), []);

  // demo one bun
  const bun = useMemo(
    () => ingredients.find((i) => i.type === 'bun') ?? null,
    [ingredients]
  );

  // demo six fillings
  const fillings = useMemo(
    () => ingredients.filter((i) => i.type !== 'bun').slice(0, 6),
    [ingredients]
  );

  // calculate total price
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const fillingsPrice = fillings.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + fillingsPrice;
  }, [bun, fillings]);

  // calculate ingredient counts
  const ingredientCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (bun) counts[bun._id] = 2;
    fillings.forEach((i) => {
      counts[i._id] = (counts[i._id] ?? 0) + 1;
    });
    return counts;
  }, [bun, fillings]);

  if (isLoading)
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );

  if (hasError) {
    return (
      <p
        className={`${styles.app} text text_type_main-medium`}
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        Возникли космические неполадки :(
        <br />
        Попробуйте обновить страницу
      </p>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          ingredientCounts={ingredientCounts}
          onIngredientClick={setSelectedIngredient}
        />
        <BurgerConstructor
          bun={bun}
          fillings={fillings}
          totalPrice={totalPrice}
          onOrderClick={() => handleOpenOrderModal()}
        />
      </main>

      {isOrderModalOpen && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={() => handleCloseIngredientModal()}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </div>
  );
};

export default App;
