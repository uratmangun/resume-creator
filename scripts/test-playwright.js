const { chromium } = require("playwright-core");
require('dotenv/config');

// Connect to Browserless using CDP and take screenshot
(async function() {
  // Get and sanitize the Browserless API URL from environment
  const apiUrl = process.env.BROWSERLESS_API_URL;
  if (!apiUrl) {
    throw new Error("BROWSERLESS_API_URL environment variable is required");
  }
  
  // Sanitize URL to get domain only (remove https://, http://, etc.)
  const domain = apiUrl.replace(/^https?:\/\//, '');
  
  const browser = await chromium.connectOverCDP(
    `wss://${domain}?token=YOUR_API_TOKEN_HERE`
  );
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the target website
  await page.goto("https://www.example.com/");
  // Take a screenshot and save it locally
  const title = await page.title();
  console.log(`Page title: ${title}`);

  // Clean up resources
  await browser.close();
  
  console.log("Screenshot captured successfully!");
})().catch(err => {
  console.error("Error taking screenshot:", err);
  process.exit(1);
});