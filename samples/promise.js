const { shield } = require('node-shield');

shield.evaluateAsync({ username: { $gt: '' } }, { mongo: true, proto: true })
  .catch((err) => {
    throw err;
  });
