const puppeteer = require('puppeteer');
const USERNAME_SELECTOR = '#mat-input-0';
const PASSWORD_SELECTOR = '#mat-input-1';
const CTA_SELECTOR = '#login-submit-button';

const credentials = process.argv.slice(2);

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
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials[1]);
  await page.click(CTA_SELECTOR);
}

async function input(page) {
  await page.waitFor(60000);
  await page.waitForSelector('#container-1 > core-sidebar > navbar > navbar-vertical-style-2 > div.navbar-content.fuse-navy-700.ps > core-navigation > div > div > div:nth-child(1) > core-nav-vertical-item:nth-child(2) > a', {
    timeout: 100000
  });
  await page.click('#container-1 > core-sidebar > navbar > navbar-vertical-style-2 > div.navbar-content.fuse-navy-700.ps > core-navigation > div > div > div:nth-child(1) > core-nav-vertical-item:nth-child(2) > a');
  await page.waitForSelector('#mat-input-8');
  await page.$eval('#mat-input-8', (el, text) => el.value = text, 'computer science');
  await page.screenshot({path: 'soc.png'});
}

(async () => {
  const {browser, page} = await startBrowser();
  await login("https://app.studentopportunitycenter.com/auth/login", browser, page);
  await input(page);
})();
