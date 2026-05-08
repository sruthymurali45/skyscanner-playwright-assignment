import { chromium } from '@playwright/test';
import { mkdirSync, existsSync } from 'fs';
import * as readline from 'readline';

const rl = readline.createInterface({ input: process.stdin });
const prompt = (q) => new Promise(resolve => rl.question(q, resolve));

const browser = await chromium.launch({ 
  headless: false,
  args: ['--start-maximized']  // ← same as test run
});

const context = await browser.newContext({
  viewport: null,              // ← same as test run
  locale: 'en-US',
});

const page = await context.newPage();

// Step 1 — Home page
await page.goto('https://www.skyscanner.com');
console.log('==============================================');
console.log('STEP 1: Solve CAPTCHA on HOME PAGE');
console.log('Press & Hold — wait for home page to load');
console.log('==============================================');
await prompt('Press ENTER when home page fully loaded: ');

// Step 2 — Results page
await page.goto('https://www.skyscanner.com/transport/flights/nyc/syd/');
console.log('==============================================');
console.log('STEP 2: Solve CAPTCHA on RESULTS PAGE if shown');
console.log('Press & Hold — wait for results to load');
console.log('==============================================');
await prompt('Press ENTER when results page fully loaded: ');

// Save
if (!existsSync('auth')) mkdirSync('auth');
await context.storageState({ path: 'auth/cookies.json' });
console.log('Cookies saved!');
console.log('Now run: npx playwright test --project=chromium');

rl.close();
await browser.close();