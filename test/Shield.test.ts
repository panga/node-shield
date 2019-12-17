import { shield } from '../src/index';
import ShieldError from '../src/ShieldError';

function assertMongoInjection(err: ShieldError, expectedPayload: any) {
  expect(err).toBeDefined();
  expect(err).toBeInstanceOf(ShieldError);
  expect(err.message).toBe('Mongo $ injection found');
  expect(err.code).toBe('mongo_error');
  expect(err.payload).toEqual(expectedPayload);
}

function assertProtoPollution(err: ShieldError, expectedPayload: any) {
  expect(err).toBeDefined();
  expect(err).toBeInstanceOf(ShieldError);
  expect(err.message).toBe('Prototype pollution found');
  expect(err.code).toBe('proto_error');
  expect(err.payload).toEqual(expectedPayload);
}

describe('Shield', () => {
  describe('evaluate', () => {
    it('should handle success', (done) => {
      const payload = {
        ok: 1,
      };
      shield.evaluate(payload, {
        mongo: true,
      }, done);
    });

    it('should handle error', (done) => {
      const payload = {
        $ne: 1,
      };
      shield.evaluate(payload, {
        mongo: true,
      }, (err) => {
        assertMongoInjection(err, {
          $ne: 1,
        });
        done();
      });
    });

    it('should handle non-object', (done) => {
      shield.evaluate(1, {
        mongo: true,
      }, done);
    });
  });

  describe('evaluateAsync', () => {
    it('should handle success', (done) => {
      const payload = {
        ok: 1,
      };
      shield.evaluateAsync(payload, {
        mongo: true,
      }).then(done);
    });

    it('should handle error', (done) => {
      const payload = {
        $ne: 1,
      };
      shield.evaluateAsync(payload, {
        mongo: true,
      }).catch((err) => {
        assertMongoInjection(err, {
          $ne: 1,
        });
        done();
      });
    });

    it('should handle non-object', (done) => {
      shield.evaluateAsync(1, {
        mongo: true,
      }).then(done);
    });
  });

  describe('empty options', () => {
    it('should not block Mongo $ operator', (done) => {
      const payload = {
        $ne: 1,
      };
      shield.evaluate(payload, {}, done);
    });

    it('should not block __proto__ object', (done) => {
      const payload = JSON.parse('{ "__proto__": { "admin": true } }');
      shield.evaluate(payload, {}, done);
    });

    it('should not block constructor object', (done) => {
      const payload = JSON.parse('{ "constructor": { "admin": true } }');
      shield.evaluate(payload, {}, done);
    });
  });

  describe('mongo enabled', () => {
    it('should block Mongo $ operator', (done) => {
      const payload = {
        $ne: 1,
      };
      shield.evaluate(payload, {
        mongo: true,
      }, (err) => {
        assertMongoInjection(err, {
          $ne: 1,
        });
        done();
      });
    });

    it('should block Mongo $ operator in nested object', (done) => {
      const payload = {
        username: {
          $ne: 1,
        },
      };
      shield.evaluate(payload, {
        mongo: true,
      }, (err) => {
        assertMongoInjection(err, {
          $ne: 1,
        });
        done();
      });
    });

    it('should not block "$" attribute', (done) => {
      const payload = {
        $: {
          id: 1,
        },
      };
      shield.evaluate(payload, {
        mongo: true,
      }, done);
    });

    it('should not block __proto__ object', (done) => {
      const payload = JSON.parse('{ "__proto__": { "admin": true } }');
      shield.evaluate(payload, {
        mongo: true,
      }, done);
    });

    it('should not block constructor object', (done) => {
      const payload = JSON.parse('{ "constructor": { "admin": true } }');
      shield.evaluate(payload, {
        mongo: true,
      }, done);
    });
  });

  describe('proto enabled', () => {
    it('should not block Mongo $ operator', (done) => {
      const payload = {
        $ne: 1,
      };
      shield.evaluate(payload, {
        proto: true,
      }, done);
    });

    it('should block __proto__ object', (done) => {
      const payload = JSON.parse('{ "__proto__": { "admin": true } }');
      shield.evaluate(payload, {
        proto: true,
      }, (err) => {
        assertProtoPollution(err, JSON.parse('{ "__proto__": { "admin": true } }'));
        done();
      });
    });

    it('should block __proto__ in nested object', (done) => {
      const payload = JSON.parse('{ "username": { "__proto__": { "admin": true } } }');
      shield.evaluate(payload, {
        proto: true,
      }, (err) => {
        assertProtoPollution(err, JSON.parse('{ "__proto__": { "admin": true } }'));
        done();
      });
    });

    it('should not block __proto__ string', (done) => {
      const payload = JSON.parse('{ "__proto__": "admin" }');
      shield.evaluate(payload, {
        proto: true,
      }, done);
    });

    it('should block constructor object', (done) => {
      const payload = JSON.parse('{ "constructor": { "admin": true } }');
      shield.evaluate(payload, {
        proto: true,
      }, (err) => {
        assertProtoPollution(err, JSON.parse('{ "constructor": { "admin": true } }'));
        done();
      });
    });

    it('should block constructor in nested object', (done) => {
      const payload = JSON.parse('{ "username": { "constructor": { "admin": true } } }');
      shield.evaluate(payload, {
        proto: true,
      }, (err) => {
        assertProtoPollution(err, JSON.parse('{ "constructor": { "admin": true } }'));
        done();
      });
    });

    it('should not block constructor string', (done) => {
      const payload = JSON.parse('{ "constructor": "admin" }');
      shield.evaluate(payload, {
        proto: true,
      }, done);
    });
  });
});
