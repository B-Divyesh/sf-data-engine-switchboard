import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from '@playwright/test';

const base = new URL(process.env.LIVE_BASE_URL || 'https://data-engine-switchboard.sociobot.in/');
const evidence = process.env.LIVE_EVIDENCE_DIR || '.factory/evidence/polish-3-live';
mkdirSync(evidence, { recursive: true });

const expected = new Map([
  ['/', 'Data Engine Switchboard — check Pandas migrations'],
  ['/demo/', 'Demo — Data Engine Switchboard'],
  ['/privacy/', 'Privacy — Data Engine Switchboard'],
  ['/terms/', 'Terms — Data Engine Switchboard'],
  ['/404.html', 'Page not found — Data Engine Switchboard']
]);
const results = { base: base.href, routes: [], requests: [], externalLinks: [], headers: {} };
const browser = await chromium.launch();

try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(String(error)));

    for (const [path, title] of expected) {
      const routeRequests = [];
      const listener = (request) => routeRequests.push(request.url());
      page.on('request', listener);
      const response = await page.goto(new URL(path, base).href, { waitUntil: 'networkidle' });
      page.off('request', listener);
      assert.equal(response?.status(), 200, `${path} did not return 200`);
      assert.equal(await page.title(), title);
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('main').count(), 1);
      assert.equal(await page.locator('h1').evaluate((heading) => heading === document.activeElement), true, `${path} H1 lacks route focus`);
      assert.equal(await page.locator('link[rel="canonical"]').count(), 1);
      assert.equal(await page.locator('meta[property="og:image"]').count(), 1);
      assert.equal(await page.locator('meta[name="twitter:image"]').count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), true, `${path} overflows`);
      assert.equal(routeRequests.every((url) => new URL(url).origin === base.origin), true, `${path} made a third-party request`);
      const axe = await new AxeBuilder({ page }).analyze();
      assert.deepEqual(axe.violations, [], `${path} has Axe violations`);
      results.routes.push({ viewport: viewport.name, path, title, requests: routeRequests.length, axeViolations: 0 });
    }

    await page.goto(base.href, { waitUntil: 'networkidle' });
    const action = page.getByRole('link', { name: 'Try it with sample data' });
    await action.waitFor();
    if (viewport.name === 'mobile') {
      const box = await action.boundingBox();
      assert.ok(box && box.y + box.height <= viewport.height, 'sample action is outside the first mobile screen');
      for (const name of ['Demo', 'How it works', 'Privacy', 'Terms']) {
        const target = await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name, exact: true }).boundingBox();
        assert.ok(target && target.height >= 44 && target.x >= 0 && target.x + target.width <= viewport.width, `${name} is not a complete mobile target`);
      }
      await page.screenshot({ path: join(evidence, 'home-mobile.png'), fullPage: false });
    }
    await action.click();
    assert.equal(page.url(), new URL('/demo/', base).href);
    await page.locator('h1').waitFor();
    if (viewport.name === 'mobile') await page.screenshot({ path: join(evidence, 'demo-mobile.png'), fullPage: true });

    if (viewport.name === 'desktop') {
      await page.goto(base.href);
      await page.getByRole('link', { name: 'Privacy', exact: true }).first().click();
      assert.equal(await page.title(), expected.get('/privacy/'));
      assert.equal(await page.locator('h1').evaluate((heading) => heading === document.activeElement), true);
      await page.goBack();
      assert.equal(await page.title(), expected.get('/'));
      assert.equal(await page.locator('h1').evaluate((heading) => heading === document.activeElement), true);
    }
    assert.deepEqual(errors, [], `${viewport.name} console errors`);
    await context.close();
  }

  const demoContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const demoPage = await demoContext.newPage();
  const demoRequests = [];
  demoPage.on('request', (request) => demoRequests.push(request.url()));
  await demoPage.goto(base.href);
  await demoPage.evaluate(() => localStorage.setItem('sb_license:data-engine-switchboard', 'real-user-sentinel'));
  await demoPage.goto(new URL('/?demo=1', base).href, { waitUntil: 'networkidle' });
  assert.equal(demoPage.url(), new URL('/demo/', base).href);
  await demoPage.getByText('Demo — sample data, nothing is saved').waitFor();
  await demoPage.getByRole('button', { name: 'Reset demo' }).click();
  assert.equal(await demoPage.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard')), 'real-user-sentinel');
  assert.deepEqual(await demoPage.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:'))), ['demo:data-engine-switchboard:opened']);
  await demoPage.getByRole('link', { name: 'Start for real' }).click();
  assert.equal(demoPage.url(), base.href);
  assert.deepEqual(await demoPage.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:'))), []);
  assert.equal(await demoPage.evaluate(() => localStorage.getItem('sb_license:data-engine-switchboard')), 'real-user-sentinel');
  assert.equal(demoRequests.every((url) => new URL(url).origin === base.origin), true);
  results.requests = demoRequests;
  await demoContext.close();

  const checkContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const checkPage = await checkContext.newPage();
  await checkPage.goto(new URL('/terms/', base).href);
  assert.equal(await checkPage.getByText('Reports identify each configured fixture and its comparison results.').count(), 1);
  assert.equal(await checkPage.getByText('They do not record transformation identity, Python details, or dataframe library versions.').count(), 1);
  await checkPage.screenshot({ path: join(evidence, 'terms-mobile.png'), fullPage: true });
  await checkPage.goto(new URL('/privacy/', base).href);
  assert.equal(await checkPage.getByText('That code can access files available to its Python process.').count(), 1);
  assert.equal(await checkPage.getByText('Switchboard itself does not upload fixture contents, reports, code, filenames, or usage data.').count(), 1);
  assert.equal(await checkPage.getByText('It reads only the configuration', { exact: false }).count(), 0);
  await checkPage.screenshot({ path: join(evidence, 'privacy-mobile.png'), fullPage: true });
  const missing = await checkPage.goto(new URL('/missing-polish-3-route', base).href);
  assert.equal(missing?.status(), 404);
  assert.equal(await checkPage.locator('h1').textContent(), 'This route is not connected');
  assert.deepEqual((await new AxeBuilder({ page: checkPage }).analyze()).violations, []);
  await checkContext.close();

  const rootResponse = await fetch(base);
  for (const header of ['content-security-policy', 'x-content-type-options', 'referrer-policy']) {
    const value = rootResponse.headers.get(header);
    assert.ok(value, `missing ${header}`);
    results.headers[header] = value;
  }
  for (const href of ['/', '/demo/', '/privacy/', '/terms/', 'https://github.com/B-Divyesh/sf-data-engine-switchboard', 'https://github.com/B-Divyesh/sf-data-engine-switchboard/issues']) {
    const url = new URL(href, base);
    const response = await fetch(url, { redirect: 'follow' });
    assert.ok(response.status >= 200 && response.status < 400, `${url.href} returned ${response.status}`);
    results.externalLinks.push({ url: url.href, status: response.status });
  }
} finally {
  await browser.close();
}

writeFileSync(join(evidence, 'live-check.json'), `${JSON.stringify(results, null, 2)}\n`);
console.log(`Live checks passed for ${results.routes.length} route/viewport combinations.`);
