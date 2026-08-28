import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('product page is operable, responsive, and has no serious accessibility issues', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Data Engine Switchboard/);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('.hero-plate img')).toHaveJSProperty('complete', true);

  const firstTab = page.getByRole('tab', { name: /Value drift/ });
  await firstTab.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /Schema drift/ })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#demo-code')).toHaveText('SCHEMA');

  const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  expect(errors).toEqual([]);

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''))).toEqual([]);
});

test('returned licenses are stored, stripped from the URL, and unlock after verification', async ({ page }) => {
  await page.route('https://api.sociobot.in/**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, reason: 'ok', expires_at: null })
  }));
  await page.goto('/?license=test-token#license');
  await expect(page).toHaveURL(/\/#license$/);
  await expect(page.locator('#download-kit')).toBeVisible();
  await expect(page.locator('#license-status')).toContainText('verified');
  expect(await page.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard'))).toBe('test-token');
});

test('legal pages expose one clear document heading', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
  }
});
