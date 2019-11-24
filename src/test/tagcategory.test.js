const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const category = '/api/v1/category';
const loginUrl = '/api/v1/auth/signin';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const user = {
  email: 'aremu@teamwork.com',
  password: 'aremu',
};

describe('view all articles that belong to a category test', () => {
  before(async () => {
    const res = await chai.request(app)
      .post(loginUrl)
      .send(user);
    userToken = res.body.payload.token;
    expect(res).to.have.status(200);
    expect(res.body.payload).to.have.property('token');
  });
  describe('Unauthenticated user can not view all articles that belong to a category.', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .get(category)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('User can view all articles that belong to a category', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .get(category)
        .send({category: 'love'})
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload[0]).to.have.property('authorId');
          expect(res.body.payload[0]).to.have.property('name');
          expect(res.body.payload[0]).to.have.property('id');
          expect(res.body.payload[0]).to.have.property('createdOn');
          expect(res.body.payload[0]).to.have.property('title');
          expect(res.body.payload[0]).to.have.property('article');
          done();
        });
    });
  });
});
