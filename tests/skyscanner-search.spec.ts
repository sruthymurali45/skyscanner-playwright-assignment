import { test, expect, BrowserContext, Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ResultsPage } from '../pages/SearchResultsPage';
import { TestDataLoader } from '../utils/TestDataLoader';
import { DateUtils } from '../utils/DateUtils';

const testData = TestDataLoader.load();

// One shared browser context — avoids CAPTCHA on every test
let context: BrowserContext;
let page: Page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
});

test.afterAll(async () => {
  await context.close();
});

for (const data of testData) {
  test(`[${data.id}] Search ${data.from} → ${data.to}`, async () => {
    const today = DateUtils.getToday();
    const fromDate = DateUtils.applyOffset(today, data.fromOffset);
    const toDate = DateUtils.applyOffset(today, data.toOffset);

    const home = new HomePage(page);
    const results = new ResultsPage(page);

    // Step 1 — Navigate
    await home.open();

    // Step 2 — Search
    await home.enterFromCity(data.from);
    await home.enterToCity(data.to);
    await home.selectDates(fromDate, toDate);
    await home.selectGuests(data.guests);
    await home.disableHotelOption();
    await home.clickSearch();

    // Step 3 — Verify results
    await results.waitForResults();
    const count = await results.countAndVerifyResults();
    console.log(`\n [${data.id}] ${data.from} → ${data.to}: ${count} results`);

    // Step 4 — Sort + find cheapest over 5 days
    await results.sortByCheapest();
    const cheapest = await results.findCheapestOver5Days(fromDate);

    console.log(`\n [${data.id}] Done — Cheapest: ${cheapest.date} at ${cheapest.price}`);
    expect(cheapest.price).toBeGreaterThan(0);
  });
}