export const API_BASE_URL = 'https://new-stellarburgers.education-services.ru/api/';

export const WS_BASE_URL = 'wss://new-stellarburgers.education-services.ru';

export const WsRoutes = {
  ALL_ORDERS: '/orders/all',
  USER_ORDERS: '/orders',
} as const;

export const DraggableTypes = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_ITEM: 'constructor-item',
} as const;

export const AppRoutes = {
  HOME: '/',
  FEED: '/feed',
  FEED_ORDER: '/feed/:id',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  PROFILE_ORDER: '/profile/orders/:id',
  INGREDIENT: '/ingredients/:id',
} as const;

export const getIngredientRoute = (id: string): string =>
  AppRoutes.INGREDIENT.replace(':id', id);

export const getFeedOrderRoute = (id: string): string =>
  AppRoutes.FEED_ORDER.replace(':id', id);

export const getProfileOrderRoute = (id: string): string =>
  AppRoutes.PROFILE_ORDER.replace(':id', id);
