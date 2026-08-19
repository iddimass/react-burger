export const API_BASE_URL = 'https://new-stellarburgers.education-services.ru/api/';

export const DraggableTypes = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_ITEM: 'constructor-item',
} as const;

export const AppRoutes = {
  HOME: '/',
  FEED: '/feed',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  INGREDIENT: '/ingredients/:id',
} as const;

export const getIngredientRoute = (id: string): string =>
  AppRoutes.INGREDIENT.replace(':id', id);
