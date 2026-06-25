import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  ingredientCounts: Record<string, number>;
  onIngredientClick: (ingredient: TIngredient) => void;
};

export const BurgerIngredients = ({
  ingredients,
  ingredientCounts,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');

  const listRef = useRef<HTMLDivElement>(null);

  const buns = ingredients.filter((i) => i.type === 'bun');
  const sauces = ingredients.filter((i) => i.type === 'sauce');
  const mains = ingredients.filter((i) => i.type === 'main');

  // render group of product's
  const renderGroup = (
    title: string,
    items: TIngredient[],
    type: string
  ): React.JSX.Element => (
    <section data-type={type} className="mt-10">
      <h2 className="text text_type_main-medium mb-6">{title}</h2>
      <ul className={styles.grid}>{items.map(renderCard)}</ul>
    </section>
  );

  // render product item
  const renderCard = (ingredient: TIngredient): React.JSX.Element => {
    const count = ingredientCounts[ingredient._id] ?? 0;
    return (
      <li
        key={ingredient._id}
        className={styles.card}
        onClick={() => onIngredientClick(ingredient)}
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
      </li>
    );
  };

  // tab click processing + scroll
  const handleTabClick = (value: string): void => {
    setCurrentTab(value);
    const section = listRef.current?.querySelector<HTMLElement>(
      `[data-type="${value}"]`
    );
    section?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value="main" active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
          <Tab value="sauce" active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
        </ul>
      </nav>
      <div ref={listRef} className={`${styles.scroll_area} custom-scroll`}>
        {renderGroup('Булки', buns, 'bun')}
        {renderGroup('Начинки', mains, 'main')}
        {renderGroup('Соусы', sauces, 'sauce')}
      </div>
    </section>
  );
};
