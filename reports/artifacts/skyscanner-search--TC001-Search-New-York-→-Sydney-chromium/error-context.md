# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: skyscanner-search.spec.ts >> [TC001] Search New York → Sydney
- Location: tests/skyscanner-search.spec.ts:29:7

# Error details

```
Error: Channel closed
```

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('#resultsContainer') to be visible

```

```
Error: browserContext.close: Target page, context or browser has been closed
```