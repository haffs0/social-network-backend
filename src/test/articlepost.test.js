const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const articlePost = '/api/v1/articles';
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

const post = {
  userId: 32,
  title: 'the rain season is a beautiful thing to talk',
  article: 'when is about to rain the sky becomes blue and everything. Things about rain are beautiful.',
};

const post1 = {
  userId: 33,
  title: 'she is beautiful',
  article: 'My first love',
};

describe('Article posts test', () => {
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
  describe('Unauthenticated user can not create article post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .post(articlePost)
        .send(post)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can create article post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .post(articlePost)
        .set('Authorization', userToken)
        .send(post1)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('articleId');
          expect(res.body.payload).to.have.property('createdOn');
          expect(res.body.payload).to.have.property('title');
          expect(res.body.payload).to.have.property('article');
          done();
        });
    });
  });
  describe('Admin can create user', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .post(articlePost)
        .set('Authorization', adminToken)
        .send(post)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('articleId');
          expect(res.body.payload).to.have.property('createdOn');
          expect(res.body.payload).to.have.property('title');
          expect(res.body.payload).to.have.property('article');
          done();
        });
    });
  });
  describe('cannot create article post with invalid data', () => {
    it('should respond with error for white space', (done) => {
      chai.request(app)
        .post(articlePost)
        .set('Authorization', adminToken)
        .send({
          userId: 32,
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
        .post(articlePost)
        .set('Authorization', adminToken)
        .send({
          userId: 32,
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
