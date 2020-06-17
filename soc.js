const puppeteer = require('puppeteer-extra');
const fs = require('fs');

const USERNAME_SELECTOR = 'input[aria-label="email"]';
const PASSWORD_SELECTOR = 'input[aria-label="password"]';
const CTA_SELECTOR = '#login-submit-button';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const commandLine = process.argv.slice(2);
const credentials = commandLine.slice(0, 2);
// eslint-disable-next-line no-console
console.log(credentials);
// eslint-disable-next-line no-unused-vars
const userAgent = require('user-agents');

async function fetchInfo(page, selector) {
  let result = '';
  try {
    await page.waitForSelector(selector);
    // eslint-disable-next-line no-undef
    result = await page.evaluate((select) => document.querySelector(select).textContent, selector);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Our Error: fetchInfo() failed.\n', error.message);
    result = 'Error';
  }
  return result;
}

async function getLinks(page) {
  await page.waitForSelector('a[_ngcontent-c42]', {
    timeout: 100000,
  });
  const links = await page.evaluate(
      () => Array.from(
          // eslint-disable-next-line no-undef
          document.querySelectorAll('a[_ngcontent-c42]'),
          a => a.getAttribute('href'),
      ),
  );
  // eslint-disable-next-line no-console
  console.log(`inside links:${links}`);
  return links;
}

async function getElements(page) {
  let hasNext = true;
  const elements = [];
  // eslint-disable-next-line eqeqeq
  while (hasNext == true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await page.waitFor(1000);
      getLinks(page).then(links => {
        elements.push(links);
      });
      // eslint-disable-next-line no-await-in-loop
      await page.waitForSelector('button[class="mat-paginator-navigation-next mat-icon-button"]:enabled', {
        timeout: 100000,
      });
      // eslint-disable-next-line no-await-in-loop
      const nextPage = await page.$('button[class="mat-paginator-navigation-next mat-icon-button"]:enabled');
      // eslint-disable-next-line no-await-in-loop
      await nextPage.click();
      // console.log(elements);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e.message);
      // eslint-disable-next-line no-console
      console.log(elements);
      hasNext = false;
      // eslint-disable-next-line no-console
      console.log('\nReached the end of pages!');
    }
  }
  // eslint-disable-next-line no-console
  console.log(elements);
  return elements;
}

async function writeData(data) {
  await fs.writeFile('./soc.data.json',
      JSON.stringify(data, null, 4), 'utf-8',
      // eslint-disable-next-line no-console
      err => (err ? console.log('\nData not written!', err) :
          // eslint-disable-next-line no-console
          console.log('\nData successfully written!')));
}

async function startBrowser() {
  const browser = await puppeteer.launch({
   headless: false,
  });
  const page = await browser.newPage();
  return { browser, page };
}

async function login(url, browser, page) {
  page.setViewport({ width: 800, height: 600 });
  // eslint-disable-next-line max-len
  await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36');
  await page.goto(url);
  await page.waitForSelector(USERNAME_SELECTOR);
  await page.waitForSelector(PASSWORD_SELECTOR);
  await page.click(USERNAME_SELECTOR);
  await page.keyboard.type(credentials[0]);
  await page.click(PASSWORD_SELECTOR);
  await page.keyboard.type(credentials[1]);
  await page.waitFor(20000);
  await page.click(CTA_SELECTOR);
}

async function input(page) {
  await page.waitForSelector('input[aria-label="Search Bar"]', {
    timeout: 100000,
  });
  await page.click('input[aria-label="Search Bar"]');
  await page.keyboard.type('computer science canada');
  await (await page.$('input[aria-label="Search Bar"]')).press('Enter');
  await page.screenshot({ path: 'soc.png' });
}

// eslint-disable-next-line consistent-return
async function getData(page, elements) {
  try {
    const data = [];
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < elements[i].length; j++) {
        const element = `https://app.studentopportunitycenter.com${elements[i][j]}`;
        // eslint-disable-next-line no-console
        console.log(element);
        // eslint-disable-next-line no-await-in-loop
        await page.goto(element);
        let position = '';
        try {
          // eslint-disable-next-line no-await-in-loop
          position = await fetchInfo(page, 'span[_ngcontent-c31]');
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log('Can\'t find position, setting to N/A');
          position = 'N/A';
        }
        // eslint-disable-next-line no-await-in-loop
        const description = await fetchInfo(page, 'span[class="pb-8 mat-body-1 wrap-text"]');
        // eslint-disable-next-line no-console
        console.log(position);
        data.push({
          position: position,
          description: description,
          currentURL: element,
        });
      }
    }
    return data;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e.message);
  }
}

(async () => {
  puppeteer.use(StealthPlugin());
  const { browser, page } = await startBrowser();
  await login('https://app.studentopportunitycenter.com/app/search', browser, page);
  await input(page).then(
  getElements(page).then((elements) => {
    getData(page, elements).then((data => {
      // eslint-disable-next-line no-console
      console.log(data);
      writeData(data);
    }));
  }),
  );
})();
