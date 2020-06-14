const puppeteer = require('puppeteer');
const USERNAME_SELECTOR = '#username';
const PASSWORD_SELECTOR = '#password';
const CTA_SELECTOR = '#app__container > main > div:nth-child(2) > form > div.login__form_action_container > button';

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

async function playTest(url) {
  const {browser, page} = await startBrowser();
  page.setViewport({width: 1366, height: 768});
  await page.goto(url);
  await page.click('.nav__button-secondary')
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(credentials[0]);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials[1]);
  await page.click(CTA_SELECTOR);
  await page.waitForNavigation();
  await page.screenshot({path: 'linkedin.png'});
}

(async () => {
  await playTest("https://www.linkedin.com/");
})();
