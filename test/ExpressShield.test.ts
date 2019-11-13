import * as express from 'express';
import * as request from 'supertest';
import ExpressShield from '../src/ExpressShield';

function app(middleware: express.RequestHandler): any {
  const server = express();

  server.use(express.urlencoded({ extended: true }));
  server.use(express.json());
  server.use(middleware);

  server.post('/body', (req, res) => res.send(req.body));
  server.get('/query', (req, res) => res.send(req.query));
  server.post('/params', (req, res) => res.send(req.params));

  return server;
}

describe('ExpressShield', () => {
  it('should block Mongo NoSQL in query', (done) => {
    request(app(ExpressShield()))
      .get('/query?username[$ne]=1')
      .set('Accept', 'application/json')
      .expect(403, done);
  });

  it('should not block non malicious in query', (done) => {
    request(app(ExpressShield()))
      .get('/query?username=$ne')
      .set('Accept', 'application/json')
      .expect(200, {
        username: '$ne',
      }, done);
  });

  it('should block Mongo NoSQL in body', (done) => {
    request(app(ExpressShield()))
      .post('/body')
      .send({
        username: {
          $ne: 1,
        },
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(403, done);
  });

  it('should block Mongo NoSQL in params', (done) => {
    request(app(ExpressShield()))
      .post('/params')
      .type('form')
      .send({
        username: {
          $ne: 1,
        },
      })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json')
      .expect(403, done);
  });
});
