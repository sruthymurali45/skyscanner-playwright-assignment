# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: skyscanner-search.spec.ts >> [TC001] Search New York → Sydney
- Location: tests/skyscanner-search.spec.ts:23:7

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('#resultsContainer') to be visible

```

# Test source

```ts
  1   | import { Page, expect } from '@playwright/test';
  2   | import { DateUtils } from '../utils/DateUtils';
  3   | 
  4   | export class ResultsPage {
  5   | 
  6   |   constructor(private page: Page) {}
  7   | 
  8   |   // Wait for search result to load
  9   |   async waitForResults() {
  10  |     console.log('Waiting for results page...');
  11  | 
> 12  |     await this.page.waitForSelector('#resultsContainer', {
      |                     ^ Error: page.waitForSelector: Target page, context or browser has been closed
  13  |       timeout: 60000
  14  |     });
  15  | 
  16  |     const firstResult = await this.page.locator('#dayview-first-result');
  17  |     await firstResult.waitFor({ state: 'visible', timeout: 30000 });
  18  | 
  19  |     await this.page.waitForTimeout(3000);
  20  |     console.log('Results loaded');
  21  |   }
  22  | 
  23  |   // Verify the results count
  24  |   async countAndVerifyResults(): Promise<number> {
  25  |     const summary = await this.page
  26  |       .locator('#resultsContainer')
  27  |       .textContent();
  28  | 
  29  |     console.log('Summary Text:', summary);
  30  | 
  31  |     const match = summary?.match(/\d+/);
  32  |     const count = match ? parseInt(match[0]) : 0;
  33  | 
  34  |     expect(count).toBeGreaterThan(0);
  35  |     console.log(`Total results found: ${count}`); 
  36  | 
  37  |     return count;
  38  |   }
  39  | 
  40  |   // Sort by cheapest
  41  |   async sortByCheapest() {
  42  |     console.log('Sorting by cheapest...');
  43  | 
  44  |     const cheapestTab = this.page.locator('[data-testid="FqsTab_CHEAPEST"]').first();
  45  | 
  46  |     await cheapestTab.waitFor({ state: 'visible', timeout: 15000 });
  47  |     await cheapestTab.click();
  48  | 
  49  |     await this.page.waitForSelector('#dayview-first-result', {
  50  |       timeout: 30000
  51  |     });
  52  | 
  53  |     await this.page.waitForTimeout(2000);
  54  |     console.log('Sorted by cheapest');
  55  |   }
  56  | 
  57  |   // Fetch the cheapest price
  58  |   async getFirstPrice(): Promise<number> {
  59  |     const priceLocator = this.page
  60  |       .locator('span[class*="heading-3"]')
  61  |       .nth(1);
  62  | 
  63  |     await priceLocator.waitFor({ state: 'visible', timeout: 20000 });
  64  | 
  65  |     const rawPrice = await priceLocator.textContent();
  66  |     console.log('Raw price:', rawPrice);
  67  | 
  68  |     const cleanedPrice = rawPrice ? rawPrice.replace(/[^\d]/g, '') : '';
  69  |     const price = cleanedPrice ? parseInt(cleanedPrice) : 0;
  70  | 
  71  |     console.log(`Parsed price: ${price}`);
  72  | 
  73  |     return price;
  74  |   }
  75  | 
  76  |   // Iterate over next 5days and fetch the cheapest price
  77  |   async findCheapestOver5Days(baseDate: Date) {
  78  |     console.log('\n Finding cheapest over next 5 days...\n');
  79  | 
  80  |     let cheapestPrice = Infinity;
  81  |     let cheapestDate = '';
  82  | 
  83  |     for (let i = 1; i <= 5; i++) {
  84  |       const targetDate = DateUtils.addDays(baseDate, i);
  85  |       const ariaLabel = DateUtils.toAriaLabel(targetDate);
  86  | 
  87  |       console.log(`\n Selecting date: ${ariaLabel}`); 
  88  | 
  89  |       // Open date picker
  90  |       await this.page.locator('#outbound_date').click();
  91  |       await this.page.waitForTimeout(1000);
  92  | 
  93  |       // Click date using aria-label
  94  |       const dateLocator = this.page.locator(
  95  |         `button[data-backpack-ds-component="CalendarDate"][aria-label*="${ariaLabel}"]`  // ← backtick + *=
  96  |       );
  97  | 
  98  |       await dateLocator.waitFor({ state: 'visible', timeout: 15000 });
  99  |       await dateLocator.click();
  100 | 
  101 |       // Wait for results to refresh
  102 |       await this.page.waitForSelector('#dayview-first-result', {
  103 |         timeout: 30000
  104 |       });
  105 |       await this.page.waitForTimeout(2000);
  106 | 
  107 |       // Sort by cheapest
  108 |       await this.sortByCheapest();
  109 | 
  110 |       // Get price
  111 |       const currentPrice = await this.getFirstPrice();
  112 | 
```