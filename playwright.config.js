const { devices } = require('@playwright/test')

const config = {
  testDir: 'tests',
  testMatch: '**/*.spec.js',
  timeout: 180000,
  workers: 2,
  use: {
    viewport: null
  },

  projects: [
    {
      name: 'pw-chromium:latest:Windows 10@lambdatest',
      use: {
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'pw-webkit:latest:Windows 10@lambdatest',
      use: {
        viewport: { width: 1280, height: 720 }
      }
    },

    // Local browser examples (optional)
    // {
    //   name: "local-chrome",
    //   use: {
    //     browserName: "chromium",
    //     channel: "chrome",
    //   },
    // },
    // {
    //   name: "local-webkit",
    //   use: {
    //     browserName: "webkit",
    //     viewport: { width: 1200, height: 750 },
    //   },
    // },
  ]
}

module.exports = config
