import { Page } from '@playwright/test';
import { ENV } from '../config/env';
import { DateUtils } from '../utils/DateUtils';

export class HomePage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(ENV.baseUrl, { waitUntil: 'domcontentloaded' });
    await this.handleCaptcha();
    await this.page.waitForSelector('input[name="originInput-search"]', {
      state: 'visible',
      timeout: 15000,
    });
  }

  private async handleCaptcha() {
    if (this.page.url().includes('captcha')) {
      console.log('CAPTCHA detected — Press & Hold in the browser window');
      console.log('Waiting up to 60 seconds...');
      await this.page.waitForURL(
        url => !url.toString().includes('captcha'),
        { timeout: 60000 }
      );
      console.log('CAPTCHA solved! Continuing...');
      await this.page.waitForTimeout(1000);
    }
  }

  // Select from city
  async enterFromCity(city: string) {
    console.log(`Entering FROM: ${city}`);
    const input = this.page.locator('input[name="originInput-search"]');
    await input.click();
    await input.fill('');
    await input.fill(city);
    await this.page.waitForFunction(() => {
      return document.querySelectorAll('[role="option"]').length > 0;
    }, { timeout: 10000 });
    await this.selectFromDropdown(city);
    await this.page.waitForTimeout(500);
  }

  // Select to city
  async enterToCity(city: string) {
    console.log(`Entering TO: ${city}`);
    const input = this.page.locator('input[name="destinationInput-search"]');
    await input.fill('');
    await input.fill(city);
    await this.page.waitForFunction(() => {
      return document.querySelectorAll('[role="option"]').length > 0;
    }, { timeout: 10000 });
    await this.selectFromDropdown(city);
    await this.page.waitForTimeout(500);
  }

  private async selectFromDropdown(city: string) {
    const options = this.page.locator('[role="option"]');
    const count = await options.count();
    console.log(`Found ${count} dropdown options`);

    for (let i = 0; i < count; i++) {
      const text = await options.nth(i).textContent();
      console.log(`Option ${i}: ${text?.trim()}`);

      const firstWord = city.split(' ')[0];
      if (text?.includes(firstWord)) {
        await options.nth(i).hover();
        await this.page.waitForTimeout(300);
        await options.nth(i).click();
        console.log(`Selected: ${text?.trim()}`);
        return;
      }
    }
    throw new Error(`"${city}" not found in dropdown`);
  }

  // Select date from auto pop calendar
  async selectDates(fromDate: Date, toDate: Date) {
    console.log(`Selecting dates: ${DateUtils.format(fromDate)} → ${DateUtils.format(toDate)}`);

    await this.page.waitForSelector('[data-testid="depart-btn"]', {
      state: 'visible',
      timeout: 10000,
    });

    await this.pickDate(fromDate);
    await this.page.waitForTimeout(500);
    await this.pickDate(toDate);

    const apply = this.page.getByTestId('CalendarSearchButton');
    if (await apply.isVisible({ timeout: 3000 })) {
      await apply.click();
    }
  }

  private async pickDate(date: Date) {
    const targetMonthName = DateUtils.getMonthName(date);
    const ariaLabel = DateUtils.toAriaLabel(date);

    console.log(`Picking date: ${ariaLabel}`);

    // Navigate to correct month
    for (let i = 0; i < 12; i++) {
      const headers = await this.page
        .locator('h2[class*="MonthName"], [class*="_MonthName"]')
        .allTextContents();

      console.log(`Current calendar headers: ${headers}`);

      if (headers.some(h => h.trim() === targetMonthName)) break;

      await this.page
        .locator('button[aria-label="Next month"], [class*="next"], [class*="Next"]')
        .first()
        .click();
      await this.page.waitForTimeout(400);
    }

    // Button contains full date text 
    const dayBtn = this.page
      .locator(`button[aria-label*="${ariaLabel}"]`)
      .first();

    await dayBtn.waitFor({ state: 'visible', timeout: 5000 });
    await dayBtn.click();
    console.log(`Date clicked: ${ariaLabel}`);
  }

  // Select guests
  async selectGuests(count: number) {
    console.log(`Selecting guests: ${count}`);

    await this.page.locator('[data-testid="traveller-button"]').click();

    await this.page.waitForTimeout(500);

    const adultInput = this.page.locator('#adult-nudger');
    await adultInput.fill('');
    await adultInput.fill(count.toString());

    console.log(`Guests set to: ${count}`);

    await this.page.getByTestId('traveller-selector-apply-button').click();
  }

  // Disable hotel 
  async disableHotelOption() {
    console.log('Checking Add hotel option...');
    const hotelCheckbox = this.page.locator('input[type="checkbox"]').nth(3);
    const isChecked = await hotelCheckbox.isChecked();
    if (isChecked) {
      console.log('Hotel option enabled — disabling...');
      await hotelCheckbox.uncheck();
      console.log('Hotel option disabled');
    } else {
      console.log('Hotel option already disabled');
    }
  }

  // Click search
  async clickSearch() {
    await this.page.getByTestId('desktop-cta').click();
    console.log('Search clicked');
  }
}