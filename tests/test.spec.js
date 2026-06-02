import { test, expect } from '@playwright/test';
import { Browser } from '@testmuai/browser-cloud';

const client = new Browser();

test('Google title', async () => {
  const session = await client.sessions.create({
    adapter: 'puppeteer',
    tunnel: true,
    tunnelName: 'mytunnel',
    lambdatestOptions: {
      build: 'My Build',
      name: 'Google Test',
      'LT:Options': {
        username: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY
      }
    }
  });

  const browser = await client.puppeteer.connect(session);
  const page = (await browser.pages())[0];

  await page.goto('https://www.google.com');
  const title = await page.title();
  console.log('Page title:', title);

  expect(title).toContain('Google');

  await browser.close();
  await client.sessions.release(session.id);
});
