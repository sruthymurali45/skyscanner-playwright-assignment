import { Page, expect } from '@playwright/test';
import { DateUtils } from '../utils/DateUtils';

export class ResultsPage {

  constructor(private page: Page) {}

  // Wait for search result to load
  async waitForResults() {
    console.log('Waiting for results page...');

    await this.page.waitForSelector('#resultsContainer', {
      timeout: 60000
    });

    const firstResult = await this.page.locator('#dayview-first-result');
    await firstResult.waitFor({ state: 'visible', timeout: 30000 });

    await this.page.waitForTimeout(3000);
    console.log('Results loaded');
  }

  // Verify the results count
  async countAndVerifyResults(): Promise<number> {
    const summary = await this.page
      .locator('#resultsContainer')
      .textContent();

    console.log('Summary Text:', summary);

    const match = summary?.match(/\d+/);
    const count = match ? parseInt(match[0]) : 0;

    expect(count).toBeGreaterThan(0);
    console.log(`Total results found: ${count}`); 

    return count;
  }

  // Sort by cheapest
  async sortByCheapest() {
    console.log('Sorting by cheapest...');

    const cheapestTab = this.page.locator('[data-testid="FqsTab_CHEAPEST"]').first();

    await cheapestTab.waitFor({ state: 'visible', timeout: 15000 });
    await cheapestTab.click();

    await this.page.waitForSelector('#dayview-first-result', {
      timeout: 30000
    });

    await this.page.waitForTimeout(2000);
    console.log('Sorted by cheapest');
  }

  // Fetch the cheapest price
  async getFirstPrice(): Promise<number> {
    const priceLocator = this.page
      .locator('span[class*="heading-3"]')
      .nth(1);

    await priceLocator.waitFor({ state: 'visible', timeout: 20000 });

    const rawPrice = await priceLocator.textContent();
    console.log('Raw price:', rawPrice);

    const cleanedPrice = rawPrice ? rawPrice.replace(/[^\d]/g, '') : '';
    const price = cleanedPrice ? parseInt(cleanedPrice) : 0;

    console.log(`Parsed price: ${price}`);

    return price;
  }

  // Iterate over next 5days and fetch the cheapest price
  async findCheapestOver5Days(baseDate: Date) {
    console.log('\n Finding cheapest over next 5 days...\n');

    let cheapestPrice = Infinity;
    let cheapestDate = '';

    for (let i = 1; i <= 5; i++) {
      const targetDate = DateUtils.addDays(baseDate, i);
      const ariaLabel = DateUtils.toAriaLabel(targetDate);

      console.log(`\n Selecting date: ${ariaLabel}`); 

      // Open date picker
      await this.page.locator('#outbound_date').click();
      await this.page.waitForTimeout(1000);

      // Click date using aria-label
      const dateLocator = this.page.locator(
        `button[data-backpack-ds-component="CalendarDate"][aria-label*="${ariaLabel}"]`  // ← backtick + *=
      );

      await dateLocator.waitFor({ state: 'visible', timeout: 15000 });
      await dateLocator.click();

      // Wait for results to refresh
      await this.page.waitForSelector('#dayview-first-result', {
        timeout: 30000
      });
      await this.page.waitForTimeout(2000);

      // Sort by cheapest
      await this.sortByCheapest();

      // Get price
      const currentPrice = await this.getFirstPrice();

      console.log(` ${ariaLabel} → ${currentPrice}`); 

      // Track cheapest
      if (currentPrice < cheapestPrice) {
        cheapestPrice = currentPrice;
        cheapestDate = ariaLabel;
      }
    }

    console.log('\n FINAL CHEAPEST RESULT');
    console.log(` Date: ${cheapestDate}`);   
    console.log(` Price: ${cheapestPrice}`);

    return {
      date: cheapestDate,
      price: cheapestPrice
    };
  }
}