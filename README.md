# Skyscanner Automation Framework (Playwright + TypeScript)

## Overview
This project is an automated test framework built using **Playwright with TypeScript**.

It validates flight search functionality on Skyscanner by performing end-to-end UI automation including:

- Searching flights (From → To)
- Selecting dynamic dates using calendar UI
- Selecting number of guests
- Verifying search results
- Sorting and iterating over next 5 days to find cheapest option
- Data-driven test execution using JSON

---

## Tech Stack

- Playwright
- TypeScript
- Node.js
- Page Object Model (POM)
- Data-driven testing (JSON)
- Custom utilities (Date handling, test data loader)

---

## Project Structure
/tests → Test specs
/pages → Page Object classes (HomePage, SearchResultsPage)
/utils → Utility classes (DateUtils, TestDataLoader)
/test-data → JSON test data
/config → Environment configuration
/reports → HTML reports, artifacts
/playwright.config → Playwright configuration

## How to Run Tests
npm install
npx playwright test
npx playwright test --headed
