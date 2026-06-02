const { test, expect } = require('../lambdatest-setup');

test.describe('Playwright Cloud – All Scenarios', () => {

  test('Scenario 1 – Simple Navigation', async ({ page }) => {
    await page.goto('https://www.testmuai.com/selenium-playground/');
    const title = await page.title();
    console.log('Scenario 1 Title:', title);
    expect(title).toContain('Selenium');
  });

  test('Scenario 2 – Checkbox Demo', async ({ page }) => {
    await page.goto('https://www.testmuai.com/selenium-playground/checkbox-demo');
    await page.check('#isAgeSelected');
    const msg = await page.textContent('#txtAge');
    console.log('Scenario 2 Message:', msg);
    expect(msg).toContain('Success');
  });

  test('Scenario 3 – Input Form Submit', async ({ page }) => {
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
    console.log('Scenario 3 Message:', msg);
    expect(msg).toContain('Thanks for contacting us');
  });

});
