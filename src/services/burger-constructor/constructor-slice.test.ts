import { describe, expect, it } from 'vitest';

import { createOrder } from '@services/order/order-actions';
import {
  createTestConstructorIngredient,
  testBun,
  testMain,
  testOrderResponse,
  testSauce,
  testSecondBun,
} from '@utils/test-fixtures';

import {
  addIngredient,
  burgerConstructorSlice,
  clearConstructor,
  moveIngredient,
  removeIngredient,
  selectIngredientCounts,
  selectTotalPrice,
} from './constructor-slice';

const reducer = burgerConstructorSlice.reducer;
const initialState = {
  bun: null,
  ingredients: [],
};

describe('Редьюсер конструктора бургера', () => {
  it('возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('добавляет булку в конструктор', () => {
    const state = reducer(initialState, addIngredient(testBun));

    expect(state.bun).toMatchObject(testBun);
    expect(state.ingredients).toEqual([]);
  });

  it('заменяет выбранную булку новой', () => {
    const withFirstBun = reducer(initialState, addIngredient(testBun));
    const state = reducer(withFirstBun, addIngredient(testSecondBun));

    expect(state.bun).toMatchObject(testSecondBun);
  });

  it('добавляет начинки по порядку и назначает им уникальные идентификаторы', () => {
    const withSauce = reducer(initialState, addIngredient(testSauce));
    const state = reducer(withSauce, addIngredient(testMain));

    expect(state.ingredients.map((ingredient) => ingredient._id)).toEqual([
      testSauce._id,
      testMain._id,
    ]);
    expect(state.ingredients[0]?.constructorId).toEqual(expect.any(String));
    expect(state.ingredients[1]?.constructorId).toEqual(expect.any(String));
    expect(state.ingredients[0]?.constructorId).not.toBe(
      state.ingredients[1]?.constructorId
    );
  });

  it('удаляет выбранную начинку', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const main = createTestConstructorIngredient(testMain, 'main-id');
    const state = reducer(
      { bun: testBun, ingredients: [sauce, main] },
      removeIngredient(sauce.constructorId)
    );

    expect(state.ingredients).toEqual([main]);
  });

  it('перемещает начинку на выбранную позицию', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const main = createTestConstructorIngredient(testMain, 'main-id');
    const state = reducer(
      { bun: testBun, ingredients: [sauce, main] },
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients).toEqual([main, sauce]);
  });

  it('не меняет начинки, если исходной позиции нет', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const state = reducer(
      { bun: testBun, ingredients: [sauce] },
      moveIngredient({ fromIndex: 10, toIndex: 0 })
    );

    expect(state.ingredients).toEqual([sauce]);
  });

  it('очищает конструктор', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const state = reducer({ bun: testBun, ingredients: [sauce] }, clearConstructor());

    expect(state).toEqual(initialState);
  });

  it('очищает конструктор после успешного создания заказа', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const ingredientIds = [testBun._id, testSauce._id, testBun._id];
    const state = reducer(
      { bun: testBun, ingredients: [sauce] },
      createOrder.fulfilled(testOrderResponse, 'request-id', ingredientIds)
    );

    expect(state).toEqual(initialState);
  });

  it('правильно считает стоимость и количество ингредиентов', () => {
    const sauce = createTestConstructorIngredient(testSauce, 'sauce-id');
    const secondSauce = createTestConstructorIngredient(testSauce, 'second-sauce-id');
    const state = {
      burgerConstructor: {
        bun: testBun,
        ingredients: [sauce, secondSauce],
      },
    };

    expect(selectTotalPrice(state)).toBe(testBun.price * 2 + testSauce.price * 2);
    expect(selectIngredientCounts(state)).toEqual({
      [testBun._id]: 2,
      [testSauce._id]: 2,
    });
  });
});
