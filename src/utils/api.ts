import { API_BASE_URL } from './constants';

import type { TIngredient } from './types';

export const getIngredients = (): Promise<TIngredient[]> =>
  fetch(`${API_BASE_URL}/ingredients`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json() as Promise<{ data: TIngredient[] }>;
    })
    .then((body) => body.data);
