const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const articleCommentPost = '/api/v1/articles/1/comment';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'aremu@teamwork.com',
  password: 'aremu',
};

const comment = {
  userId: 6,
  comment: 'beautiful to be home boy !!!!!!!!!!!'
};

describe('Article comment posts test', () => {
  before(async () => {
    try {
      const res = await chai.request(app)
        .post(loginUrl)
        .send(user);
      userToken = res.body.payload.token;
      expect(res).to.have.status(200);
      expect(res.body.payload).to.have.property('token');
    }
    catch (error) {
      console.log(error)
    }
  });
  describe('Unauthenticated user can not comment on other colleagues article post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .post(articleCommentPost)
        .send(comment)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can comment on other colleagues article post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .post(articleCommentPost)
        .set('Authorization', userToken)
        .send(comment)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('commentId');
          expect(res.body.payload).to.have.property('createdOn');
          expect(res.body.payload).to.have.property('articleTitle');
          expect(res.body.payload).to.have.property('article');
          expect(res.body.payload).to.have.property('comment');
          done();
        });
    });
  });
});
