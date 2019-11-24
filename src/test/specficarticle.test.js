const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const specficArticle = '/api/v1/articles/10';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'aremu@teamwork.com',
  password: 'aremu',
};

describe('specfic article post test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    expect(res.body.payload).to.have.property('token');
  });
  describe('Unauthenticated user can not view specfic article post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .get(specficArticle)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can view specfic article post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .get(specficArticle)
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('authorid');
          expect(res.body.payload).to.have.property('firstname');
          expect(res.body.payload).to.have.property('lastname');
          expect(res.body.payload).to.have.property('id');
          expect(res.body.payload).to.have.property('createdon');
          expect(res.body.payload).to.have.property('articletitle');
          expect(res.body.payload).to.have.property('article');
          expect(res.body.payload).to.have.property('comments');
          done();
        });
    });
  });
});
