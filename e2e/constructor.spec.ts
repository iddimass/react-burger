import { expect, test } from '@playwright/test';

import { testBun, testMain, testOrderResponse } from '../src/utils/test-fixtures';

import type { Locator, Page } from '@playwright/test';

const API_GLOB = '**/api/**';
const API_HAR_PATH = 'e2e/fixtures/stellar-api.har';

const dragIngredient = async (
  page: Page,
  source: Locator,
  target: Locator
): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await source.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
  await source.dispatchEvent('dragend', { dataTransfer });

  await dataTransfer.dispose();
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR(API_HAR_PATH, {
    notFound: 'abort',
    update: false,
    url: API_GLOB,
  });

  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer e2e-access-token');
    localStorage.setItem('refreshToken', 'e2e-refresh-token');
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});

test('пользователь может посмотреть ингредиент, собрать бургер и оформить заказ', async ({
  page,
}) => {
  const bunCard = page.getByTestId(`ingredient-${testBun._id}`);
  const mainCard = page.getByTestId(`ingredient-${testMain._id}`);
  const bunTop = page.getByTestId('constructor-bun-top');
  const bunBottom = page.getByTestId('constructor-bun-bottom');
  const fillingsZone = page.getByTestId('constructor-fillings');
  const filling = page.getByTestId('constructor-filling');
  const totalPrice = page.getByTestId('total-price');
  const modal = page.getByTestId('modal');
  const modalClose = page.getByTestId('modal-close');
  const orderNumber = page.getByTestId('order-number');
  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });

  await mainCard.click();

  await expect(modal).toBeVisible();
  await expect(modal).toContainText('Детали ингредиента');
  await expect(modal).toContainText(testMain.name);
  await expect(modal).toContainText(String(testMain.calories));
  await expect(modal).toContainText(String(testMain.proteins));
  await expect(modal).toContainText(String(testMain.fat));
  await expect(modal).toContainText(String(testMain.carbohydrates));

  await modalClose.click();
  await expect(modal).toBeHidden();

  await dragIngredient(page, bunCard, bunBottom);
  await dragIngredient(page, mainCard, fillingsZone);

  await expect(bunTop).toContainText(`${testBun.name} (верх)`);
  await expect(bunBottom).toContainText(`${testBun.name} (низ)`);
  await expect(filling).toContainText(testMain.name);
  await expect(totalPrice).toHaveText(String(testBun.price * 2 + testMain.price));

  const orderRequestPromise = page.waitForRequest(
    (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
  );

  await orderButton.click();

  const orderRequest = await orderRequestPromise;
  expect(orderRequest.postDataJSON()).toEqual({
    ingredients: [testBun._id, testMain._id, testBun._id],
  });

  await expect(modal).toBeVisible();
  await expect(orderNumber).toHaveText(
    String(testOrderResponse.order.number).padStart(6, '0')
  );
  await expect(modal).toContainText('идентификатор заказа');

  await modalClose.click();
  await expect(modal).toBeHidden();
});
