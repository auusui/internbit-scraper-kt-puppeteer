const puppeteer = require('puppeteer-extra');
const USERNAME_SELECTOR = '#mat-input-0';
const PASSWORD_SELECTOR = '#mat-input-1';
const CTA_SELECTOR = '#login-submit-button';
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const credentials = process.argv.slice(2);
const userAgent = require('user-agents');

async function fetchInfo(page, selector) {
  let result = '';
  try {
    await page.waitForSelector(selector);
    result = await page.evaluate((select) => document.querySelector(select).textContent, selector);
  } catch (error) {
    console.log('Our Error: fetchInfo() failed.\n', error.message);
    result = 'Error';
  }
  return result;
}

async function startBrowser() {
  const browser = await puppeteer.launch({
   headless: false,
  });
  const page = await browser.newPage();
  return {browser, page};
}

async function closeBrowser(browser) {
  return browser.close();
}

async function login(url, browser, page) {
  page.setViewport({width: 1366, height: 768});
  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url);
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(credentials[0]);
  await page.waitFor(20000)
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials[1]);
  await page.waitFor(20000)
  await page.click(CTA_SELECTOR);
}

async function input(page) {
  await page.waitForSelector('#mat-input-2', {
    timeout: 100000
  });
  await page.click('#mat-input-2');
  await page.keyboard.type('computer science');
  await page.screenshot({path: 'soc.png'});
}

(async () => {
  puppeteer.use(StealthPlugin())
  const {browser, page} = await startBrowser();
  await login("https://app.studentopportunitycenter.com/app/search", browser, page);
  await input(page);
})();
