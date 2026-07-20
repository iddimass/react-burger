import { useAppDispatch, useAppSelector } from '@/services/hooks';
import { fetchIngredients } from '@/services/ingredients/ingredients-actions';
import {
  selectIngredientsLoading,
  selectIngredientsError,
} from '@/services/ingredients/ingredients-slice';
import { clearOrder, selectOrderNumber } from '@/services/order/order-slice';
import {
  clearSelectedIngredient,
  selectSelectedIngredient,
} from '@/services/selected-ingredient/selected-ingredient-slice';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const isLoading = useAppSelector(selectIngredientsLoading);
  const ingredientsError = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectSelectedIngredient);
  const orderNumber = useAppSelector(selectOrderNumber);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleCloseIngredientModal = useCallback(() => {
    dispatch(clearSelectedIngredient());
  }, [dispatch]);

  const handleCloseOrderModal = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  if (isLoading)
    return (
      <div className={styles.app}>
        <Preloader />
      </div>
    );

  if (ingredientsError) {
    return (
      <p
        className={`${styles.app} text text_type_main-medium`}
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        Возникли космические неполадки :(
        <br />
        {ingredientsError}
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
        <BurgerIngredients />
        <BurgerConstructor />
      </main>

      {orderNumber !== null && (
        <Modal onClose={handleCloseOrderModal}>
          <OrderDetails />
        </Modal>
      )}

      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={handleCloseIngredientModal}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
    </div>
  );
};

export default App;
