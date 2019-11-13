import { Shield } from '../src/Shield';
import ShieldError from '../src/ShieldError';

describe('Shield', () => {
  it('should block Mongo NoSQL', (done) => {
    const payload = {
      $ne: 1,
    };
    Shield.evaluate(payload, {
      mongo: true,
    }, (err) => {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(ShieldError);
      expect(err.message).toBe('Mongo $ injection found');
      expect(err.code).toBe('mongo_error');
      expect(err.payload).toEqual({
        $ne: 1,
      });
      done();
    });
  });

  it('should block Mongo NoSQL 2', (done) => {
    const payload = {
      username: {
        $ne: 1,
      },
    };
    Shield.evaluate(payload, {
      mongo: true,
    }, (err) => {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(ShieldError);
      expect(err.message).toBe('Mongo $ injection found');
      expect(err.code).toBe('mongo_error');
      expect(err.payload).toEqual({
        $ne: 1,
      });
      done();
    });
  });

  it('should block async Mongo NoSQL', (done) => {
    const payload = {
      $ne: 1,
    };
    Shield.evaluateAsync(payload, {
      mongo: true,
    }).catch((err) => {
      expect(err).toBeDefined();
      expect(err).toBeInstanceOf(ShieldError);
      expect(err.message).toBe('Mongo $ injection found');
      expect(err.code).toBe('mongo_error');
      expect(err.payload).toEqual({
        $ne: 1,
      });
      done();
    });
  });

  it('should not block Mongo NoSQL', (done) => {
    const payload = {
      username: 'test',
    };
    Shield.evaluateAsync(payload, {
      mongo: true,
    }).then(() => {
      done();
    });
  });

  it('should not block async Mongo NoSQL', (done) => {
    const payload = {
      username: 'test',
    };
    Shield.evaluateAsync(payload, {
      mongo: true,
    }).then(() => {
      done();
    });
  });
});
