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
npm run soc [SOC username] [SOC password]
```

This will run the script to scrape studentopportunitycenter.com - note that you currently need to alter the search query manually in the soc.js file - working on adding the option to specify the search query when you run the script in command line.

Current .json files for Idealist: (Can only view the raw file for SimplyHired because of its size)
* [Idealist](https://github.com/radgrad/internbit-scraper-kt-puppeteer/blob/master/idealist.data.json)
* [SOC](https://github.com/radgrad/internbit-scraper-kt-puppeteer/blob/master/soc.data.json)
