import {} from 'jest';
import * as supertest from 'supertest';

const request = supertest('http://localhost:8000');

describe('GET /', () => {
  it('should return 200 OK', () => {
    request
      .get('/')
      .expect(200);
  });
});