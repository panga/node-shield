const { Shield } = require('node-shield');

Shield.evaluate({
  username: {
    '$gt': ''
  }
}, {
  mongo: true,
  proto: true,
}, (err) => {
  if (err) {
    throw err;
  }
});
