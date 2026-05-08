# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: skyscanner-search.spec.ts >> [TC002] Search Boston → Amsterdam
- Location: tests/skyscanner-search.spec.ts:23:7

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('input[name="originInput-search"]') to be visible

```

# Test source

```ts
  1   | import { Page } from '@playwright/test';
  2   | import { ENV } from '../config/env';
  3   | import { DateUtils } from '../utils/DateUtils';
  4   | 
  5   | export class HomePage {
  6   |   constructor(private page: Page) {}
  7   | 
  8   |   async open() {
  9   |     await this.page.goto(ENV.baseUrl, { waitUntil: 'domcontentloaded' });
  10  |     await this.handleCaptcha();
> 11  |     await this.page.waitForSelector('input[name="originInput-search"]', {
      |                     ^ Error: page.waitForSelector: Target page, context or browser has been closed
  12  |       state: 'visible',
  13  |       timeout: 15000,
  14  |     });
  15  |   }
  16  | 
  17  |   private async handleCaptcha() {
  18  |     if (this.page.url().includes('captcha')) {
  19  |       console.log('CAPTCHA detected — Press & Hold in the browser window');
  20  |       console.log('Waiting up to 60 seconds...');
  21  |       await this.page.waitForURL(
  22  |         url => !url.toString().includes('captcha'),
  23  |         { timeout: 60000 }
  24  |       );
  25  |       console.log('CAPTCHA solved! Continuing...');
  26  |       await this.page.waitForTimeout(1000);
  27  |     }
  28  |   }
  29  | 
  30  |   // Select from city
  31  |   async enterFromCity(city: string) {
  32  |     console.log(`Entering FROM: ${city}`);
  33  |     const input = this.page.locator('input[name="originInput-search"]');
  34  |     await input.click();
  35  |     await input.fill('');
  36  |     await input.pressSequentially(city, { delay: 80 });
  37  |     await this.page.waitForFunction(() => {
  38  |       return document.querySelectorAll('[role="option"]').length > 0;
  39  |     }, { timeout: 10000 });
  40  |     await this.selectFromDropdown(city);
  41  |     await this.page.waitForTimeout(500);
  42  |   }
  43  | 
  44  |   // Select to city
  45  |   async enterToCity(city: string) {
  46  |     console.log(`Entering TO: ${city}`);
  47  |     const input = this.page.locator('input[name="destinationInput-search"]');
  48  |     await input.fill('');
  49  |     await input.pressSequentially(city, { delay: 100 });
  50  |     await this.page.waitForFunction(() => {
  51  |       return document.querySelectorAll('[role="option"]').length > 0;
  52  |     }, { timeout: 10000 });
  53  |     await this.selectFromDropdown(city);
  54  |     await this.page.waitForTimeout(500);
  55  |   }
  56  | 
  57  |   private async selectFromDropdown(city: string) {
  58  |     const options = this.page.locator('[role="option"]');
  59  |     const count = await options.count();
  60  |     console.log(`Found ${count} dropdown options`);
  61  | 
  62  |     for (let i = 0; i < count; i++) {
  63  |       const text = await options.nth(i).textContent();
  64  |       console.log(`Option ${i}: ${text?.trim()}`);
  65  | 
  66  |       const firstWord = city.split(' ')[0];
  67  |       if (text?.includes(firstWord)) {
  68  |         await options.nth(i).hover();
  69  |         await this.page.waitForTimeout(300);
  70  |         await options.nth(i).click();
  71  |         console.log(`Selected: ${text?.trim()}`);
  72  |         return;
  73  |       }
  74  |     }
  75  |     throw new Error(`"${city}" not found in dropdown`);
  76  |   }
  77  | 
  78  |   // Select date from auto pop calendar
  79  |   async selectDates(fromDate: Date, toDate: Date) {
  80  |     console.log(`Selecting dates: ${DateUtils.format(fromDate)} → ${DateUtils.format(toDate)}`);
  81  | 
  82  |     await this.page.waitForSelector('[data-testid="depart-btn"]', {
  83  |       state: 'visible',
  84  |       timeout: 10000,
  85  |     });
  86  | 
  87  |     await this.pickDate(fromDate);
  88  |     await this.page.waitForTimeout(500);
  89  |     await this.pickDate(toDate);
  90  | 
  91  |     const apply = this.page.getByTestId('CalendarSearchButton');
  92  |     if (await apply.isVisible({ timeout: 3000 })) {
  93  |       await apply.click();
  94  |     }
  95  |   }
  96  | 
  97  |   private async pickDate(date: Date) {
  98  |     const targetMonthName = DateUtils.getMonthName(date);
  99  |     const ariaLabel = DateUtils.toAriaLabel(date);
  100 | 
  101 |     console.log(`Picking date: ${ariaLabel}`);
  102 | 
  103 |     // Navigate to correct month
  104 |     for (let i = 0; i < 12; i++) {
  105 |       const headers = await this.page
  106 |         .locator('h2[class*="MonthName"], [class*="_MonthName"]')
  107 |         .allTextContents();
  108 | 
  109 |       console.log(`Current calendar headers: ${headers}`);
  110 | 
  111 |       if (headers.some(h => h.trim() === targetMonthName)) break;
```