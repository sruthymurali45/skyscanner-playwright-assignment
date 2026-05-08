import { defineConfig, devices } from '@playwright/test';
import * as fs from 'fs';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,            
  workers: 1,
  timeout: 120000,
  expect: { timeout: 15000 },

  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://www.skyscanner.com',
    headless: true,
    viewport: null,
    locale: 'en-US',
    // timezoneId: 'America/New_York',
    // geolocation: { longitude: -74.006, latitude: 40.7128 },
    // permissions: ['geolocation'],
    launchOptions: {
      args: [
        '--start-maximized',
      ],
    },
    storageState: fs.existsSync('auth/cookies.json')
      ? 'auth/cookies.json'
      : undefined,
},

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args:['--start-maximized',
                '--window-size=1920,1080',
                '--disable-blink-features=AutomationControlled'
              ],
        },
      },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  outputDir: 'reports/artifacts',
});