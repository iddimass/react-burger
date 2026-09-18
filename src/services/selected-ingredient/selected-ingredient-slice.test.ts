import { describe, expect, it } from 'vitest';

import { testMain } from '@utils/test-fixtures';

import {
  clearSelectedIngredient,
  selectedIngredientSlice,
  setSelectedIngredient,
} from './selected-ingredient-slice';

const reducer = selectedIngredientSlice.reducer;
const initialState = {
  ingredient: null,
};

describe('Редьюсер выбранного ингредиента', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('сохраняет выбранный ингредиент', () => {
    const state = reducer(initialState, setSelectedIngredient(testMain));

    expect(state.ingredient).toEqual(testMain);
  });

  it('очищает выбранный ингредиент', () => {
    const state = reducer({ ingredient: testMain }, clearSelectedIngredient());

    expect(state).toEqual(initialState);
  });
});
