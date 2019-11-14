# node-shield

Protects against common Node.js vulnerabilities in MEAN stack (MongoDB, Node.js).

Provides an extremelly fast and low overhead API and Express 4.x middleware.

- Executes in ~200ns (nanoseconds) for a payload with 10 keys and 500 bytes.
- Supports Node 6+ [![Build Status](https://travis-ci.com/panga/node-shield.svg?branch=master)](https://travis-ci.com/panga/node-shield)
- 100% code coverage.
- Zero dependencies.

## Install

`npm install node-shield`

## Description

This module aims in protecting Node.js applications againt OWASP Injection (A1) attacks.

One of the most common attacks of MEAN stack is the MongoDB NoSQL injection using arbitraty input in request parameters.

A second and more recent attack comes with JavaScript prototype pollution and it was seen in multiple libraries in last years ([Lodash](https://snyk.io/vuln/SNYK-JS-LODASH-450202), [Hapi.js](https://github.com/hapijs/hapi/issues/3916)), but it is also present if you use `Object.assign` API.

**WARNING** This is not a replacement for good coding practices like:
* Use parameterized queries to prevent injection flaws.
* Always validate input parameters types (JSON Schema recommended)

### MongoDB NoSQL protection

Block object keys which start with `$` operator for MongoDB. e.g: `username: { $gt: ''}`.

https://www.owasp.org/index.php/Testing_for_NoSQL_injection
https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html
https://blog.websecurify.com/2014/08/attacks-nodejs-and-mongodb-part-to.html

### Prototype Pollution protection

Block object keys with names `__proto__` or `constructor` which are also an object.

https://github.com/HoLyVieR/prototype-pollution-nsec18/blob/master/paper/JavaScript_prototype_pollution_attack_in_NodeJS.pdf

## API usage

### Callback style

```javascript
const { shield } = require('node-shield');

shield.evaluate({ user: { $gt: '' } }, { mongo: true, proto: true },
  (err) => {
    if (err) {
      throw err;
    }
  });
```

### Promise style

```javascript
const { shield } = require('node-shield');

shield.evaluateAsync({ user: { $gt: '' } }, { mongo: true, proto: true })
  .catch((err) => {
    throw err;
  });
```

## Express 4.x middleware usage

By default, both `mongo` and `proto` protections are evaluated and the error handler return a `403` error.
You can do anything you would normally do in a express middleware.
Example, but not limited to:
- Log the injection attempt and continue to process the request
- Log the injection attempt and response with an error

```javascript
const express = require('express');
const { expressShield } = require('node-shield');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressShield({
  errorHandler: (shieldError, req, res, next) => {
    console.error(shieldError);
    res.sendStatus(400);
  },
}));

app.listen(3000);
```

## License

Apache2.0

## Author

Leonardo Zanivan <panga@apache.org>
