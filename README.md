# internbit-scraper-kt-puppeteer
Spike solution for Idealist and SOC

## Installation
To install puppeteer for this repo, cd into the internbit-scraper-kt-osmosis directory in terminal and run:
```
npm install puppeteer
```

## Running the scripts / Testing
For the Idealist script, in the internbit-scraper-kt-puppeteer directory, run:
```
npm run idea [search query, separate each word with a space]
```

This will run the script to scrape Idealist.org with the search query specified.

For the SOC script, in the internbit-scraper-kt-puppeteer directory, run:
```
npm run soc [SOC username] [SOC password] [search query, separate each word with a space]
```

This will run the script to scrape studentopportunitycenter.com. Note that currently, you need to manually go through the reCaptcha for the SOC script - in addition, you may need to click into the window for pagination to work. Both scripts take time to scrape the actual results after scraping the links, expect at least a 1-2 minute delay after the script scrapes the links.

Current .json files for Idealist: (Can only view the raw file for SimplyHired because of its size)
* [Idealist](https://github.com/radgrad/internbit-scraper-kt-puppeteer/blob/master/idealist.data.json)
* [SOC](https://github.com/radgrad/internbit-scraper-kt-puppeteer/blob/master/soc.data.json)
