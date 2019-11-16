const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const deleteFlagPost = '/api/v1/flag/3';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);


let adminToken;
let userToken;

const admin = {
  email: 'admin2@teamwork.com',
  password: '123456',
};

const user = {
  email: 'john@teamwork.com',
  password: '123456',
};


describe('Delete flagged inappropriate posts test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    const response = await chai.request(app)
      .post(loginUrl)
      .send(admin);
    adminToken = response.body.payload.token;
    expect(response).to.have.status(200);
    expect(response.body.payload).to.have.property('token');
  });
  describe('Unauthenticated admin can not delete flagged inappropriate post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .delete(deleteFlagPost)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('Unauthorized user cannot flagged inappropriate post', () => {
    it('should respond with forbidden error', (done) => {
      chai.request(app)
        .delete(deleteFlagPost)
        .set('Authorization', userToken)
        .send({ tableName: 'article' })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('Admin can delete flagged inappropriate post ', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .delete(deleteFlagPost)
        .set('Authorization', adminToken)
        .send({ tableName: 'gif' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message');
          done();
        });
    });
    it('should respond with user data and status code 201 for deleted flag article.', (done) => {
      chai.request(app)
        .delete(deleteFlagPost)
        .set('Authorization', adminToken)
        .send({ tableName: 'article' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message');
          done();
        });
    });
  });
});
