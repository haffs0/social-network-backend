const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const logout = '/api/v1/logout';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'john@teamwork.com',
  password: '123456',
};

describe('logout test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    expect(res.body.payload).to.have.property('token');
  });
  describe('Unauthenticated user can not logout.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .get(logout)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('A user can logout', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .get(logout)
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
