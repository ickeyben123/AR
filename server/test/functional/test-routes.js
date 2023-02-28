import chai from 'chai';
import request from 'supertest';

const expect = chai.expect;

import server from '../../server.js';


describe('GET /health', () => {
  it('responds with json', () => {
    return request(server)
      .get('/health/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, {
        status: 'UP',
      });
  });
});

describe('GET /swagger/api-docs', () => {
  it('responds with swagger', () => {
    return request(server)
      .get('/swagger/api-docs/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .then(response => {
        expect(response.text).to.include('Swagger');
      });
  });
});

describe('POST /fake/route', () => {
  it('responds with not found page', () => {
    return request(server)
      .post('/fake/route')
      .expect('Content-Type', 'text/html; charset=UTF-8')
      .expect(200)
      .then(response => {
        expect(response.text).to.include(
          'Whoops! Looks like you got lost or couldn\'t find your page.',
        );
      });
  });
});
