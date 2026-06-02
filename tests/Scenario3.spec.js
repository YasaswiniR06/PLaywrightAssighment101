import { test, expect } from '@playwright/test';
import { Browser } from '@testmuai/browser-cloud';

test('Scenario 3 - Playwright Cloud', async () => {
  const client = new Browser();

  const session = await client.sessions.create({
    adapter: 'playwright',
    lambdatestOptions: {
      browserName: 'Chrome',
      browserVersion: 'latest',
      platformName: 'Windows 11',
      'LT:Options': {
        username: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY,
      },
    },
  });

  const { browser, page } = await client.playwright.connect(session);

  await page.goto('https://www.testmuai.com/selenium-playground/input-form-submit-demo');

  await page.fill('#name', 'Yasaswini');
  await page.fill('#inputEmail4', 'yasaswini@example.com');
  await page.fill('#inputPassword4', 'Password123');
  await page.fill('#company', 'TestMu AI');
  await page.fill('#websitename', 'https://testmuai.com');
  await page.selectOption('#inputState', 'California');
  await page.fill('#inputCity', 'Los Angeles');
  await page.fill('#inputAddress1', '123 Main St');
  await page.fill('#inputAddress2', 'Suite 100');
  await page.fill('#inputZip', '90001');

  await page.click("button[type='submit']");

  const msg = await page.textContent('.success-msg');
  expect(msg).toContain('Thanks for contacting us');

  await browser.close();
  await client.sessions.release(session.id);
});
