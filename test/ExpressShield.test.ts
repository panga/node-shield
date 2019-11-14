import * as express from 'express';
import * as request from 'supertest';
import { expressShield } from '../src/index';
import ShieldError from '../src/ShieldError';

function app(middleware: express.RequestHandler): any {
  const server = express();

  server.use(express.urlencoded({
    extended: true,
  }));
  server.use(express.json());
  server.use(middleware);

  server.post('/body', (req, res) => res.send(req.body));
  server.get('/query', (req, res) => res.send(req.query));

  return server;
}

describe('ExpressShield', () => {
  describe('query', () => {
    it('should block malicious query param', (done) => {
      request(app(expressShield()))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('should not block valid query param', (done) => {
      request(app(expressShield()))
        .get('/query?username=1')
        .set('Accept', 'application/json')
        .expect(200, {
          username: '1',
        }, done);
    });
  });

  describe('body', () => {
    it('should block malicious body param', (done) => {
      request(app(expressShield()))
        .post('/body')
        .send({
          username: {
            $ne: 1,
          },
        })
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('should not block valid body param', (done) => {
      request(app(expressShield()))
        .post('/body')
        .send({
          username: 1,
        })
        .set('Accept', 'application/json')
        .expect(200, {
          username: 1,
        }, done);
    });

    it('should block malicious form param', (done) => {
      request(app(expressShield()))
        .post('/body')
        .type('form')
        .send('username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('should not block valid form param', (done) => {
      request(app(expressShield()))
        .post('/body')
        .type('form')
        .send('username=1')
        .set('Accept', 'application/json')
        .expect(200, {
          username: '1',
        }, done);
    });
  });

  describe('default values', () => {
    it('should block malicious Mongo request', (done) => {
      request(app(expressShield()))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('should block malicious __proto__ request', (done) => {
      request(app(expressShield()))
        .post('/body')
        .send('{ "__proto__": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(403, done);
    });

    it('should block malicious constructor request', (done) => {
      request(app(expressShield()))
        .post('/body')
        .send('{ "constructor": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(403, done);
    });

    it('should not block valid request', (done) => {
      request(app(expressShield()))
        .get('/query?username=1')
        .set('Accept', 'application/json')
        .expect(200, {
          username: '1',
        }, done);
    });
  });

  describe('mongo only', () => {
    it('should block malicious Mongo request', (done) => {
      request(app(expressShield({
        mongo: true,
        proto: false,
      })))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(403, done);
    });

    it('should not block malicious __proto__ request', (done) => {
      request(app(expressShield({
        mongo: true,
        proto: false,
      })))
        .post('/body')
        .send('{ "__proto__": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200, done);
    });

    it('should not block malicious constructor request', (done) => {
      request(app(expressShield({
        mongo: true,
        proto: false,
      })))
        .post('/body')
        .send('{ "constructor": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(200, done);
    });

    it('should not block valid request', (done) => {
      request(app(expressShield({
        mongo: true,
        proto: false,
      })))
        .get('/query?username=1')
        .set('Accept', 'application/json')
        .expect(200, {
          username: '1',
        }, done);
    });
  });

  describe('proto only', () => {
    it('should not block malicious Mongo request', (done) => {
      request(app(expressShield({
        mongo: false,
        proto: true,
      })))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should block malicious __proto__ request', (done) => {
      request(app(expressShield({
        mongo: false,
        proto: true,
      })))
        .post('/body')
        .send('{ "__proto__": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(403, done);
    });

    it('should block malicious constructor request', (done) => {
      request(app(expressShield({
        mongo: false,
        proto: true,
      })))
        .post('/body')
        .send('{ "constructor": { "admin": true } }')
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .expect(403, done);
    });

    it('should not block valid request', (done) => {
      request(app(expressShield({
        mongo: false,
        proto: true,
      })))
        .get('/query?username=1')
        .set('Accept', 'application/json')
        .expect(200, {
          username: '1',
        }, done);
    });
  });

  describe('custom error handler', () => {
    it('should emit error and return custom response', (done) => {
      request(app(expressShield({
        errorHandler: (err: any, _req: express.Request, res: express.Response) => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(ShieldError);
          expect(err.message).toBe('Mongo $ injection found');
          expect(err.code).toBe('mongo_error');
          expect(err.payload).toEqual({
            $ne: '1',
          });
          res.sendStatus(400);
        },
      })))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(400, done);
    });

    it('should emit error and continue processing', (done) => {
      request(app(expressShield({
        errorHandler: (err: any, _req: express.Request, _res: express.Response,
          next: express.NextFunction) => {
          expect(err).toBeDefined();
          expect(err).toBeInstanceOf(ShieldError);
          expect(err.message).toBe('Mongo $ injection found');
          expect(err.code).toBe('mongo_error');
          expect(err.payload).toEqual({
            $ne: '1',
          });
          next();
        },
      })))
        .get('/query?username[$ne]=1')
        .set('Accept', 'application/json')
        .expect(200, done);
    });

    it('should not emit error', (done) => {
      request(app(expressShield({
        errorHandler: () => {
          done(new Error('not expected to reach here'));
        },
      })))
        .get('/query?username=1')
        .set('Accept', 'application/json')
        .expect(200, done);
    });
  });
});
