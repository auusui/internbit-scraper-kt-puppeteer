const puppeteer = require('puppeteer');
const fs = require('fs');

const searchQuery = process.argv.slice(2);

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

async function writeData(data) {
  await fs.writeFile('./idealist.data.json',
      JSON.stringify(data, null, 4), 'utf-8',
      err => (err ? console.log('\nData not written!', err) :
          console.log('\nData successfully written!')));
}

async function getLinks(page) {
  const links = await page.evaluate(
      () => Array.from(
          // eslint-disable-next-line no-undef
          document.querySelectorAll('[data-qa-id=search-result-link]'),
      a => a.getAttribute('href'),
      ),
  );
  return links;
}

async function getElements(page) {
  let hasNext = true;
  const elements = [];
  while (hasNext == true) {
    try {
      await page.waitFor(1000);
      getLinks(page).then(links => {
        elements.push(links);
      })
      await page.waitForSelector('button[class="Button__StyledButton-sc-1avp0bd-0 ggDAbQ Pagination__ArrowLink-nuwudv-2 eJsmUe"]:last-child');
      nextPage = await page.$('button[class="Button__StyledButton-sc-1avp0bd-0 ggDAbQ Pagination__ArrowLink-nuwudv-2 eJsmUe"]:last-child');
      await nextPage.click();
      //console.log(elements);
    } catch(e) {
      console.log(e.message);
      console.log(elements);
      hasNext = false;
      console.log('\nReached the end of pages!');
    }
  }
  console.log(elements);
  return elements;
}

async function getData(page, elements) {
  try {
    const data = [];
    for (let i = 0; i < elements.length; i++) {
      for (let j = 0; j < elements[i].length; j++) {
        const element = 'https://www.idealist.org' + elements[i][j];
        console.log(element);
        await page.goto(element, { waitUntil: 'domcontentloaded' });
        const position = await fetchInfo(page, '[data-qa-id=listing-name]');
        let company = '';
        try {
          company = await fetchInfo(page, '[data-qa-id=org-link]');
        } catch(e) {
          console.log('No company found. Setting to N/A');
          company = 'N/A';
        }
        const description = await fetchInfo(page, '.Text-sc-1wv914u-0.dlxdi.idlst-rchtxt.Text__StyledRichText-sc-1wv914u-1.ctyuXi');
        console.log(position);
        data.push({
          position: position,
          company: company,
          description: description,
          currentURL: element,
        })
      }
    }
    return data;
  } catch(e) {
    console.log(e.message);
  }
}

(async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36');

    await page.goto('https://www.idealist.org/en/');
    await page.waitForSelector('#layout-root > div.idlst-flx.Box__BaseBox-sc-1wooqli-0.lnKqQM > div.idlst-flx.Box__BaseBox-sc-1wooqli-0.dCQmbn.BaseLayout__PageContent-sc-10xtgtb-2.heQjSt > div.Box__BaseBox-sc-1wooqli-0.bsSECh > div > div.Box__BaseBox-sc-1wooqli-0.hpEILX > div.Box__BaseBox-sc-1wooqli-0.datyjK > div > div > div.idlst-flx.idlst-lgncntr.Box__BaseBox-sc-1wooqli-0.cDmdoN > div > form > div.Box__BaseBox-sc-1wooqli-0.ejycyy > div > input');
    await page.type('input[data-qa-id="search-input"]', searchQuery);
    await page.click('button[data-qa-id="search-button"]');
    await page.waitForSelector('#results > div > div > div.Box__BaseBox-sc-1wooqli-0.iuHlOF > div:nth-child(2) > div > div > div > div.Box__BaseBox-sc-1wooqli-0.csFszx > div.Box__BaseBox-sc-1wooqli-0.iKEEgc > h4 > a');

    await getElements(page).then((elements) => {
      getData(page, elements).then((data => {
        console.log(data);
        writeData(data);
      }))
    })

  } catch(e) {
    console.log(e);
  }
})();
