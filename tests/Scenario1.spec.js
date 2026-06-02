import { test, expect } from '@playwright/test';
import { Browser } from '@testmuai/browser-cloud';

const client = new Browser();

test.describe('TEST MUAI Assignment', () => {

  test('Simple Form Demo Validation', async () => {

    // 1. Create cloud session
    const session = await client.sessions.create({
      adapter: 'puppeteer',
      tunnel: true,
      tunnelName: 'mytunnel',
      lambdatestOptions: {
        build: 'My Build',
        name: 'Simple Form Demo Test',
        'LT:Options': {
          username: process.env.LT_USERNAME,
          accessKey: process.env.LT_ACCESS_KEY
        }
      }
    });

    // 2. Connect to cloud browser
    const browser = await client.puppeteer.connect(session);
    const page = (await browser.pages())[0];

    try {
      // 3. Open website
      await page.goto('https://www.testmuai.com/selenium-playground/');

      // 4. Click Simple Form Demo
      await page.waitForSelector('a[href*="simple-form-demo"]', { visible: true });
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
  page.click('a[href*="simple-form-demo"]')
]);

await page.waitForSelector('#user-message', { visible: true });

      // 5. Validate URL
      expect(page.url()).toContain('simple-form-demo');

      // 6. Enter message
      const message = 'Welcome to TestMu AI';
      await page.type('#user-message', message);

      // 7. Validate input value
      const value = await page.$eval('#user-message', el => el.value);
      expect(value).toBe(message);

      console.log('Message validation passed');

    } catch (error) {
      console.error('Test failed:', error);
      throw error;

    } finally {
      // 8. Cleanup
      await browser.close();
      await client.sessions.release(session.id);
    }
  });

});
