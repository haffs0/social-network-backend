const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

const signinUrl = '/api/v1/auth/signin';

describe('user(s) signin test', () => {
  describe('allow user to signin with correct data', () => {
    it('should be able to signin with valid email and password', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: 'admin2@teamwork.com',
          password: '123456',
        })
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.payload).to.have.property('userId');
          expect(res.body.payload).to.have.property('token');
          done();
        });
    }).timeout(200000);
    it('should not signin a user with invalid email', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: 'haffslafgmail.com',
          password: '123456',
        })
        .end((error, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('message');
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Incorrect email or password');
          done();
        });
    });
    it('should not signin a user with empty email and password', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: '',
          password: '',
        })
        .end((error, res) => {
          expect(res).to.have.status(500);
          expect(res.body).to.have.property('success');
          expect(res.body).to.have.property('message');
          expect(res.body.success).to.equal(false);
          done();
        });
    });
    it('should not login a non-existent user', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: 'nonexist@teamwork.com',
          password: '123456',
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('payload');
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Fail to login');
          done();
        });
    });
    it('should not signin a user with wrong password', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: 'haffslaf@gmail.com',
          password: '12388977',
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('payload');
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Incorrect email or password');
          done();
        });
    });
    it('should not signin a user with wrong email', (done) => {
      chai.request(app)
        .post(signinUrl)
        .send({
          email: 'admin4@teamwork.com',
          password: '123456',
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body).to.have.property('payload');
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('Fail to login');
          done();
        });
    });
  });
});

