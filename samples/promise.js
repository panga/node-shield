const { Shield } = require('node-shield');

Shield.evaluateAsync({
  username: {
    '$gt': ''
  }
}, {
  mongo: true,
  proto: true,
}).catch((err) => {
  throw err;
});
