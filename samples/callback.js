const { shield } = require('node-shield');

shield.evaluate({ username: { $gt: '' } }, { mongo: true, proto: true }, (err) => {
  if (err) {
    throw err;
  }
});
