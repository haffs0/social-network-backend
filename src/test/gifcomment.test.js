const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const gifCommentPost = '/api/v1/gifs/11/comment';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'john@teamwork.com',
  password: '123456',
};

const comment = {
  userId: 32,
  comment: 'beautiful to be home boy !!!!!!!!!!!',
};

describe('Gifs comment posts test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    expect(res.body.payload).to.have.property('token');
  });
  describe('Unauthenticated user can not comment on other colleagues gif post.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .post(gifCommentPost)
        .send(comment)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can comment on other colleagues gif post', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .post(gifCommentPost)
        .set('Authorization', userToken)
        .send(comment)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('commentId');
          expect(res.body.payload).to.have.property('createdOn');
          expect(res.body.payload).to.have.property('gifTitle');
          expect(res.body.payload).to.have.property('comment');
          done();
        });
    });
  });
});
