import { describe, it } from 'mocha';
import { assert } from 'chai';
// eslint-disable-next-line import/named

const fs = require('fs');


const ideaFile = './idealist.data.json';

let ideaTest = {};

describe('Scraper', function () {

  // eslint-disable-next-line mocha/handle-done-callback,no-unused-vars,no-undef,mocha/no-hooks-for-single-case
  before(function (done) {
    // eslint-disable-next-line no-undef
    fs.readFile(ideaFile, 'utf8', function (err, fileContents) {
      if (err) throw err;
      ideaTest = JSON.parse(fileContents);
    });
  });
  it('Idealist | should create a file with objects scraped', function () {
    assert.isArray(ideaTest, {});
  });

});
