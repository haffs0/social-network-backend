const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const deleteArticlePost = '/api/v1/articles/6';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);


let userToken;


const user = {
  email: 'john@teamwork.com',
  password: '123456',
};


describe('Delete articles posts test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
  });
  describe('Unauthenticated user can not delete an article post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .delete(deleteArticlePost)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can delete article post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .delete(deleteArticlePost)
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
