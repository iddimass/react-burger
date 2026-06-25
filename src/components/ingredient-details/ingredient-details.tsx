import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { TIngredient } from '@/utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  const [isImageLoaded, setIsImageLoaded] = useState(false); // added preloader if image takes a long time to load

  return (
    <div className={styles.container}>
      {!isImageLoaded && (
        <div className={styles.imageLoader}>
          <Preloader />
        </div>
      )}
      <img
        className={styles.image}
        src={ingredient.image_large}
        alt={ingredient.name}
        onLoad={() => setIsImageLoaded(true)}
        style={{ display: isImageLoaded ? 'block' : 'none' }}
      />
      <h3 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
        {ingredient.name}
      </h3>
      <ul className={styles.nutrients}>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.calories}
          </p>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.proteins}
          </p>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.fat}
          </p>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <p className="text text_type_digits-default text_color_inactive">
            {ingredient.carbohydrates}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default IngredientDetails;
