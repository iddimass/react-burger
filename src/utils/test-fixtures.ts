import type {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TOrderResponse,
  TOrdersResponse,
  TUser,
} from './types';

const TEST_IMAGE = 'https://code.s3.yandex.net/react/code/bun-02-large.png';

export const testBun: TIngredient = {
  _id: 'bun-1',
  name: 'Тестовая космическая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 170,
  price: 500,
  image: TEST_IMAGE,
  image_large: TEST_IMAGE,
  image_mobile: TEST_IMAGE,
  __v: 0,
};

export const testSecondBun: TIngredient = {
  ...testBun,
  _id: 'bun-2',
  name: 'Вторая тестовая булка',
  price: 650,
};

export const testSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Тестовый межзвёздный соус',
  type: 'sauce',
  proteins: 2,
  fat: 3,
  carbohydrates: 4,
  calories: 50,
  price: 100,
  image: TEST_IMAGE,
  image_large: TEST_IMAGE,
  image_mobile: TEST_IMAGE,
  __v: 0,
};

export const testMain: TIngredient = {
  _id: 'main-1',
  name: 'Тестовая галактическая начинка',
  type: 'main',
  proteins: 25,
  fat: 15,
  carbohydrates: 10,
  calories: 275,
  price: 300,
  image: TEST_IMAGE,
  image_large: TEST_IMAGE,
  image_mobile: TEST_IMAGE,
  __v: 0,
};

export const testIngredients: TIngredient[] = [
  testBun,
  testSecondBun,
  testSauce,
  testMain,
];

export const testUser: TUser = {
  email: 'test@stellar-burgers.example',
  name: 'Тестовый космонавт',
};

export const testOrder: TOrder = {
  _id: 'order-1',
  ingredients: [testBun._id, testMain._id, testBun._id],
  status: 'done',
  name: 'Тестовый галактический бургер',
  number: 12345,
  createdAt: '2026-01-01T12:00:00.000Z',
  updatedAt: '2026-01-01T12:01:00.000Z',
};

export const testSecondOrder: TOrder = {
  _id: 'order-2',
  ingredients: [testSecondBun._id, testSauce._id, testSecondBun._id],
  status: 'pending',
  name: 'Второй тестовый бургер',
  number: 12346,
  createdAt: '2026-01-02T12:00:00.000Z',
  updatedAt: '2026-01-02T12:00:30.000Z',
};

export const testOrdersResponse: TOrdersResponse = {
  success: true,
  orders: [testOrder, testSecondOrder],
  total: 2,
  totalToday: 1,
};

export const testOrderResponse: TOrderResponse = {
  success: true,
  name: testOrder.name,
  order: {
    number: testOrder.number,
  },
};

export const createTestConstructorIngredient = (
  ingredient: TIngredient,
  constructorId: string
): TConstructorIngredient => ({
  ...ingredient,
  constructorId,
});
