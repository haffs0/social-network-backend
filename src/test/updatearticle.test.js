const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const articleUpdatedPost = '/api/v1/articles/2';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);


let userToken;


const user = {
  email: 'john@teamwork.com',
  password: '123456',
};

const post = {
  title: 'she is beautiful',
  article: 'My first love, love her',
};

describe('Article update posts test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
  });
  describe('Unauthenticated user can not update an article post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .patch(articleUpdatedPost)
        .send(post)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can update article post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .patch(articleUpdatedPost)
        .set('Authorization', userToken)
        .send(post)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('articleId');
          expect(res.body.payload).to.have.property('updatedOn');
          expect(res.body.payload).to.have.property('title');
          expect(res.body.payload).to.have.property('article');
          done();
        });
    });
  });
  describe('cannot update article post with invalid data', () => {
    it('should respond with error for white space', (done) => {
      chai.request(app)
        .patch(articleUpdatedPost)
        .set('Authorization', userToken)
        .send({
          title: '              ',
          article: 'when is about to rain the sky becomes blue and everything. Things about rain are beautiful.',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('should respond with error for empty field', (done) => {
      chai.request(app)
        .patch(articleUpdatedPost)
        .set('Authorization', userToken)
        .send({
          title: '',
          article: 'when is about to rain the sky becomes blue and everything. Things about rain are beautiful.',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
});
