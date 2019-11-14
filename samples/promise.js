const { shield } = require('node-shield');

shield.evaluateAsync({ user: { $gt: '' } }, { mongo: true, proto: true })
  .catch((err) => {
    throw err;
  });
