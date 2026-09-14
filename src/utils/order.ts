import type { TIngredient, TOrder, TOrdersResponse, TOrderStatus } from '@utils/types';

export type TGroupedOrderIngredient = {
  count: number;
  ingredient: TIngredient;
};

const OrderStatusLabels: Record<TOrderStatus, string> = {
  created: 'Создан',
  done: 'Выполнен',
  pending: 'Готовится',
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOrderStatus = (value: unknown): value is TOrderStatus =>
  value === 'created' || value === 'pending' || value === 'done';

const isValidDate = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value));

const isOrder = (value: unknown): value is TOrder => {
  if (!isObject(value)) {
    return false;
  }

  return (
    typeof value._id === 'string' &&
    value._id.length > 0 &&
    Array.isArray(value.ingredients) &&
    value.ingredients.length > 0 &&
    value.ingredients.every((ingredientId) => typeof ingredientId === 'string') &&
    isOrderStatus(value.status) &&
    typeof value.name === 'string' &&
    value.name.length > 0 &&
    typeof value.number === 'number' &&
    Number.isFinite(value.number) &&
    isValidDate(value.createdAt) &&
    isValidDate(value.updatedAt)
  );
};

export const getOrderStatusLabel = (status: TOrderStatus): string =>
  OrderStatusLabels[status];

export const formatOrderNumber = (number: number): string =>
  String(number).padStart(6, '0');

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  const ingredientsById = new Map(
    ingredients.map((ingredient) => [ingredient._id, ingredient])
  );

  return order.ingredients
    .map((ingredientId) => ingredientsById.get(ingredientId))
    .filter((ingredient): ingredient is TIngredient => ingredient !== undefined);
};

export const isOrderValid = (order: TOrder, ingredients: TIngredient[]): boolean =>
  order.ingredients.length > 0 &&
  getOrderIngredients(order, ingredients).length === order.ingredients.length;

export const getOrderTotal = (order: TOrder, ingredients: TIngredient[]): number =>
  getOrderIngredients(order, ingredients).reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );

export const getGroupedOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TGroupedOrderIngredient[] => {
  const groupedIngredients = new Map<string, TGroupedOrderIngredient>();

  getOrderIngredients(order, ingredients).forEach((ingredient) => {
    const groupedIngredient = groupedIngredients.get(ingredient._id);

    if (groupedIngredient) {
      groupedIngredient.count += 1;
    } else {
      groupedIngredients.set(ingredient._id, { count: 1, ingredient });
    }
  });

  return [...groupedIngredients.values()];
};

export const parseOrdersResponse = (value: unknown): TOrdersResponse | null => {
  if (
    !isObject(value) ||
    value.success !== true ||
    !Array.isArray(value.orders) ||
    typeof value.total !== 'number' ||
    !Number.isFinite(value.total) ||
    typeof value.totalToday !== 'number' ||
    !Number.isFinite(value.totalToday)
  ) {
    return null;
  }

  return {
    success: true,
    orders: value.orders.filter(isOrder),
    total: value.total,
    totalToday: value.totalToday,
  };
};

export const getSocketResponseError = (value: unknown): string | null => {
  if (isObject(value) && value.success === false && typeof value.message === 'string') {
    return value.message;
  }

  return null;
};
