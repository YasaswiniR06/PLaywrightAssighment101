import { test, expect } from '@playwright/test';
import { Browser } from '@testmuai/browser-cloud';

const TEST_URL =
  'https://www.testmuai.com/selenium-playground/drag-drop-range-sliders-demo';
const TARGET_SLIDER_INDEX = 2;
const TARGET_PERCENTAGE = 0.95;
const MIN_EXPECTED_VALUE = 90;


const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Create session with LambdaTest capabilities
const createSession = async (client) => {
  return await client.sessions.create({
    adapter: 'puppeteer',
    tunnel: false,
    lambdatestOptions: {
      build: 'My Build',
      name: 'Slider Test',
      'LT:Options': {
        username: process.env.LT_USERNAME,
        accessKey: process.env.LT_ACCESS_KEY
      }
    }
  });
};

//  Helper: Drag slider to target percentage
const dragSlider = async (page, slider, percentage) => {
  const box = await slider.boundingBox();

  if (!box) throw new Error('Slider bounding box not found');

  const startX = box.x + 5;
  const endX = box.x + box.width * percentage;
  const y = box.y + box.height / 2;

  await page.mouse.move(startX, y);
  await page.mouse.down();
  await page.mouse.move(endX, y, { steps: 10 });
  await page.mouse.up();
};

// 
const getSliderValue = async (page, slider) => {
  return await page.evaluate(el => el.value, slider);
};

test.describe('Slider Tests', () => {

  test.setTimeout(180000);

  test('Should set slider value close to 95', async () => {

    const client = new Browser();
    let session;
    let browser;

    try {
      console.log('🔹 Creating session...');
      session = await createSession(client);

      console.log('🔹 Connecting to browser...');
      browser = await client.puppeteer.connect(session);

      const page = (await browser.pages())[0];

     
      console.log('🔹 Navigating to slider page...');
      await page.goto(TEST_URL, { waitUntil: 'networkidle2' });

      await page.waitForSelector('input[type="range"]');

      const sliders = await page.$$('input[type="range"]');

      if (sliders.length <= TARGET_SLIDER_INDEX) {
        throw new Error('Target slider not found');
      }

      const slider = sliders[TARGET_SLIDER_INDEX];

      // Dragging..
      console.log('🔹 Dragging slider...');
      await dragSlider(page, slider, TARGET_PERCENTAGE);

      await delay(1000);

      // Assert
      const value = await getSliderValue(page, slider);
      console.log(`🔹 Slider value: ${value}`);

      expect(Number(value)).toBeGreaterThanOrEqual(MIN_EXPECTED_VALUE);

      console.log('Test Passed');

    } catch (error) {
      console.error('❌ Test Failed:', error);

      // Screenshot only if browser/page exists
      if (browser) {
        const pages = await browser.pages();
        if (pages.length > 0) {
          await pages[0].screenshot({ path: 'error.png' });
        }
      }

      throw error;

    } finally {
     
      if (browser) await browser.close();
      if (session) await client.sessions.release(session.id);
    }
  });
});