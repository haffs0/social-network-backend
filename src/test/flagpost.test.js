const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const flagPost = '/api/v1/flag/3';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);


let userToken;


const user = {
  email: 'john@teamwork.com',
  password: '123456',
};

describe('Flag inappropriate posts test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
  });
  describe('Unauthenticated user can not flag post as inappropraite.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .patch(flagPost)
        .send({tableName: 'article'})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can flag post as inappropraite', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .patch(flagPost)
        .set('Authorization', userToken)
        .send({tableName: 'article'})
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('User can flag post as inappropraite', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .patch(flagPost)
        .set('Authorization', userToken)
        .send({tableName: 'gif'})
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('User can flag post as inappropraite', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .patch(flagPost)
        .set('Authorization', userToken)
        .send({tableName: 'articleComment'})
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
  describe('User can flag post as inappropraite', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .patch(flagPost)
        .set('Authorization', userToken)
        .send({tableName: 'gifComment'})
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          done();
        });
    });
  });
});
