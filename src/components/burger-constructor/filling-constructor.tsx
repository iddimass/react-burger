import {
  moveIngredient,
  removeIngredient,
} from '@/services/burger-constructor/constructor-slice';
import { useAppDispatch } from '@/services/hooks';
import { DraggableTypes } from '@/utils/constants';
import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import type { TConstructorIngredient } from '@utils/types';

import styles from './filling-constructor.module.css';

type TConstructorFillingProps = {
  ingredient: TConstructorIngredient;
  index: number;
};

type TConstructorDragFilling = {
  constructorId: string;
  index: number;
};

export const FillingConstructor = ({
  ingredient,
  index,
}: TConstructorFillingProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);

  const dispatch = useAppDispatch();

  const [, drop] = useDrop<TConstructorDragFilling>({
    accept: DraggableTypes.CONSTRUCTOR_ITEM,
    hover(draggedItem) {
      if (draggedItem.index === index) return;
      dispatch(moveIngredient({ fromIndex: draggedItem.index, toIndex: index }));
      draggedItem.index = index;
    },
  });

  const [, drag] = useDrag<TConstructorDragFilling>({
    type: DraggableTypes.CONSTRUCTOR_ITEM,
    item: { constructorId: ingredient.constructorId, index },
  });

  drag(drop(ref));

  return (
    <li ref={ref} className={styles.filling}>
      <DragIcon type="secondary" />
      <ConstructorElement
        thumbnail={ingredient.image}
        price={ingredient.price}
        text={ingredient.name}
        handleClose={() => dispatch(removeIngredient(ingredient.constructorId))}
      />
    </li>
  );
};
