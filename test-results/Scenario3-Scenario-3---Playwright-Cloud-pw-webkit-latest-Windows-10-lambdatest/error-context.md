# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: Scenario3.spec.js >> Scenario 3 - Playwright Cloud
- Location: tests\Scenario3.spec.js:4:5

# Error details

```
TimeoutError: browserType.connect: Timeout 60000ms exceeded.
Call log:
  - <ws connecting> wss://yasaswinirenduchinthala:LT_dnfQM7WE8c9MQ1nt0JsjEwOF6QR3kZ5hYQrXaDwMc2HJML6@cdp.lambdatest.com/playwright

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { Browser } from '@testmuai/browser-cloud';
  3  | 
  4  | test('Scenario 3 - Playwright Cloud', async () => {
  5  |   const client = new Browser();
  6  | 
  7  |   const session = await client.sessions.create({
  8  |     adapter: 'playwright',
  9  |     lambdatestOptions: {
  10 |       browserName: 'Chrome',
  11 |       browserVersion: 'latest',
  12 |       platformName: 'Windows 11',
  13 |       'LT:Options': {
  14 |         username: process.env.LT_USERNAME,
  15 |         accessKey: process.env.LT_ACCESS_KEY,
  16 |       },
  17 |     },
  18 |   });
  19 | 
> 20 |   const { browser, page } = await client.playwright.connect(session);
     |                                                     ^ TimeoutError: browserType.connect: Timeout 60000ms exceeded.
  21 | 
  22 |   await page.goto('https://www.testmuai.com/selenium-playground/input-form-submit-demo');
  23 | 
  24 |   await page.fill('#name', 'Yasaswini');
  25 |   await page.fill('#inputEmail4', 'yasaswini@example.com');
  26 |   await page.fill('#inputPassword4', 'Password123');
  27 |   await page.fill('#company', 'TestMu AI');
  28 |   await page.fill('#websitename', 'https://testmuai.com');
  29 |   await page.selectOption('#inputState', 'California');
  30 |   await page.fill('#inputCity', 'Los Angeles');
  31 |   await page.fill('#inputAddress1', '123 Main St');
  32 |   await page.fill('#inputAddress2', 'Suite 100');
  33 |   await page.fill('#inputZip', '90001');
  34 | 
  35 |   await page.click("button[type='submit']");
  36 | 
  37 |   const msg = await page.textContent('.success-msg');
  38 |   expect(msg).toContain('Thanks for contacting us');
  39 | 
  40 |   await browser.close();
  41 |   await client.sessions.release(session.id);
  42 | });
  43 | 
```