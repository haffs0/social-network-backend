const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const feed = '/api/v1/feeds';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'aremu@teamwork.com',
  password: 'aremu',
};

describe('feed(all articles posts and gifs posts) test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    expect(res.body.payload).to.have.property('token');
  });
  describe('Unauthenticated user can not view posts.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .get(feed)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can view all posts', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .get(feed)
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload[0]).to.have.property('authorId');
          expect(res.body.payload[0]).to.have.property('name');
          expect(res.body.payload[0]).to.have.property('articleId');
          expect(res.body.payload[0]).to.have.property('createdOn');
          expect(res.body.payload[0]).to.have.property('title');
          expect(res.body.payload[0]).to.have.property('article');
          done();
        });
    });
  });
});
