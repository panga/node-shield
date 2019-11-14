const { shield } = require('node-shield');

shield.evaluate({ user: { $gt: '' } }, { mongo: true, proto: true },
  (err) => {
    if (err) {
      throw err;
    }
  });
