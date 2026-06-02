/**
 * Add the file in your test suite to run tests on LambdaTest.
 * Import `test` object from this file in the tests.
 */
const base = require('@playwright/test');
const path = require('path');
const { chromium, webkit, _android } = require('playwright');
const cp = require('child_process');
const playwrightClientVersion = cp.execSync('npx playwright --version').toString().trim().split(' ')[1];

if (process.env.executeOn !== "local") {

  // LambdaTest capabilities
  const capabilities = {
    browserName: 'pw-chromium', // default
    browserVersion: 'latest',
    'LT:Options': {
      platform: 'Windows 10',
      build: 'Playwright JS Build',
      name: 'Playwright Test',
      user: process.env.LT_USERNAME,
      accessKey: process.env.LT_ACCESS_KEY,
      network: true,
      video: true,
      console: true,
      tunnel: true,
      tunnelName: 'mytunnel',
      parallel: 3,
      geoLocation: '',
      playwrightClientVersion: playwrightClientVersion
    }
  };

  // Patch capabilities dynamically based on project name
  const modifyCapabilities = (configName, testName) => {
    let config = configName.split('@lambdatest')[0];

    if (configName.match(/android/)) {
      let [deviceName, platformVersion, platform] = config.split(':');
      capabilities['LT:Options']['deviceName'] = deviceName;
      capabilities['LT:Options']['platformVersion'] = platformVersion;
      capabilities['LT:Options']['platformName'] = platform;
      capabilities['LT:Options']['name'] = testName;
      capabilities['LT:Options']['build'] = 'Playwright JS Android Build';
      capabilities['LT:Options']['isRealMobile'] = true;

      delete capabilities.browserName;
      delete capabilities.browserVersion;
    } else {
      let [browserName, browserVersion, platform] = config.split(':');

      capabilities.browserName = browserName || capabilities.browserName;
      capabilities.browserVersion = browserVersion || capabilities.browserVersion;
      capabilities['LT:Options']['platform'] = platform || capabilities['LT:Options']['platform'];
      capabilities['LT:Options']['name'] = testName;
    }
  };

  exports.test = base.test.extend({
    page: async ({ page, playwright }, use, testInfo) => {
      let fileName = testInfo.file.split(path.sep).pop();

      if (testInfo.project.name.match(/lambdatest/)) {
        modifyCapabilities(testInfo.project.name, `${testInfo.title} - ${fileName}`);
        console.log("Final capabilities:", JSON.stringify(capabilities, null, 2));

        let device, context, browser, ltPage;

        if (testInfo.project.name.match(/android/)) {
          device = await _android.connect(
            `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
          );
          await device.shell("am force-stop com.android.chrome");

          context = await device.launchBrowser();
          ltPage = await context.newPage(testInfo.project.use);

        } else {
          // Detect browser engine
          let browserEngine = capabilities.browserName;

          if (browserEngine === 'pw-chromium') {
            browser = await chromium.connect(
              `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
            );
          } else if (browserEngine === 'pw-webkit') {
            browser = await webkit.connect(
              `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(JSON.stringify(capabilities))}`
            );
          } else {
            throw new Error(`Unsupported browser engine: ${browserEngine}`);
          }

          ltPage = await browser.newPage(testInfo.project.use);
        }

        await use(ltPage);

        const testStatus = {
          action: 'setTestStatus',
          arguments: {
            status: testInfo.status,
            remark: testInfo.error?.stack || testInfo.error?.message,
          }
        };

        await ltPage.evaluate(() => {},
          `lambdatest_action: ${JSON.stringify(testStatus)}`);

        await ltPage.close();
        await context?.close();
        await browser?.close();
        await device?.close();

      } else {
        await use(page);
      }
    }
  });

} else {
  exports.test = base.test.extend({
    page: async ({ page }, use) => {
      await use(page);
    }
  });
}
