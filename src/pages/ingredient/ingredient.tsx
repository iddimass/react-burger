import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import Modal from '@components/modal/modal';
import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';

import styles from './ingredient.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(selectIngredients);

  const ingredient = ingredients.find((item) => item._id === id);

  if (!ingredient) {
    return (
      <main className={styles.page}>
        <p className="text text_type_main-medium">Ингредиент не найден</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <h1 className="text text_type_main-large">Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};

export const IngredientModal = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredients = useAppSelector(selectIngredients);

  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  if (!ingredient) {
    return null;
  }

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};
