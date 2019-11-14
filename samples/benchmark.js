const { Shield } = require('node-shield');

const iterations = 1000000;
const payload = {
  "title": "Node.js in Action",
  "isbn": "1617290572",
  "pageCount": 300,
  "publishedDate": { "date": "2013-10-15T00:00:00.000-0700" },
  "thumbnailUrl": "https://s3.amazonaws.com/AKIAJC5RLADLUMVRPFDQ.book-thumb-images/cantelon.jpg",
  "shortDescription": "Node.js in Action",
  "status": "PUBLISH",
  "authors": [
    "Mike Cantelon",
    "Marc Harter",
    "T.J. Holowaychuk",
    "Nathan Rajlich"
  ],
  "categories": ["Web Development"]
};

let executions = 0;
const hrstart = process.hrtime();

for (let i = 0; i < iterations; i++) {
  Shield.evaluate(payload, {
    mongo: true,
    proto: true,
  }, (err) => {
    executions++;
    if (err) {
      throw err;
    }
  });
}
const hrend = process.hrtime(hrstart);
const calls = executions;

console.info('Execution time for %d calls (hr): %ds %dns', calls, hrend[0], hrend[1]);
