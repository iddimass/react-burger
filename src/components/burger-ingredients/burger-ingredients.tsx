import { selectIngredientCounts } from '@/services/burger-constructor/constructor-slice';
import { useAppSelector } from '@/services/hooks';
import { selectIngredients } from '@/services/ingredients/ingredients-slice';
import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import IngredientCard from './ingredient-card';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = (): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState('bun');

  const listRef = useRef<HTMLDivElement>(null);
  const bunRef = useRef<HTMLElement>(null);
  const sauceRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  const ingredients = useAppSelector(selectIngredients);
  const ingredientCounts = useAppSelector(selectIngredientCounts);

  const buns = ingredients.filter((i) => i.type === 'bun');
  const sauces = ingredients.filter((i) => i.type === 'sauce');
  const mains = ingredients.filter((i) => i.type === 'main');

  const handleScroll = (): void => {
    if (!listRef.current || !bunRef.current || !sauceRef.current || !mainRef.current)
      return;

    const containerTop = listRef.current.getBoundingClientRect().top;

    const sections = [
      {
        type: 'bun',
        distance: Math.abs(bunRef.current.getBoundingClientRect().top - containerTop),
      },
      {
        type: 'sauce',
        distance: Math.abs(sauceRef.current.getBoundingClientRect().top - containerTop),
      },
      {
        type: 'main',
        distance: Math.abs(mainRef.current.getBoundingClientRect().top - containerTop),
      },
    ];

    const closestSection = sections.reduce((closest, section) =>
      section.distance < closest.distance ? section : closest
    );

    setCurrentTab(closestSection.type);
  };

  // render group of product's
  const renderGroup = (
    title: string,
    items: TIngredient[],
    sectionRef: React.RefObject<HTMLElement | null>
  ): React.JSX.Element => (
    <section ref={sectionRef} className="mt-10">
      <h2 className="text text_type_main-medium mb-6">{title}</h2>

      <ul className={styles.grid}>
        {items.map((ingredient) => (
          <IngredientCard
            key={ingredient._id}
            ingredient={ingredient}
            count={ingredientCounts[ingredient._id] ?? 0}
          />
        ))}
      </ul>
    </section>
  );

  // tab click processing + scroll
  const handleTabClick = (value: string): void => {
    setCurrentTab(value);

    const refs: Record<string, React.RefObject<HTMLElement | null>> = {
      bun: bunRef,
      sauce: sauceRef,
      main: mainRef,
    };

    refs[value]?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
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
      <div
        ref={listRef}
        className={`${styles.scroll_area} custom-scroll`}
        onScroll={handleScroll}
      >
        {renderGroup('Булки', buns, bunRef)}
        {renderGroup('Начинки', mains, mainRef)}
        {renderGroup('Соусы', sauces, sauceRef)}
      </div>
    </section>
  );
};
