const natural = require('natural');
const fs = require('fs');

// const tokenizer = new natural.WordTokenizer();
const ideaFile = './idealist.canonical.data.json';

const text = fs.readFileSync(ideaFile).toString('utf-8');
// eslint-disable-next-line no-eval
const arr = eval(`[${text}]`);
console.log(arr[0][1]);
natural.PorterStemmer.attach();
console.log((arr[0][1].description).tokenizeAndStem());
/*
async function read(filename) {
  fs.readFile(filename, 'utf8', function (err, fileContents) {
    if (err) throw err;
    ideaTest = JSON.parse(fileContents);
  });
}
(async () => {
  await read(ideaFile);
  await console.log(ideaTest);
 */
  /*
  for (let i = 0; i < ideaTest.length; i++) {
    // eslint-disable-next-line no-console
    console.log(ideaTest[i]);
    console.log(tokenizer.tokenize(ideaTest[i].description));
  }
   */
// })();
