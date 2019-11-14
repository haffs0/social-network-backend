const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const app = require('../app');

const { expect } = chai;
chai.use(chaiHttp);

const signinUrl = '/api/v1/auth/signin';
const gifsPostUrl = '/api/v1/gifs';

let userToken;

const user = {
  email: 'john@teamwork.com',
  password: '123456',
};


describe('Gifs post tests', () => {
  describe('gifs post', () => {
    before((done) => {
      chai.request(app)
        .post(signinUrl)
        .send(user)
        .end((error, res) => {
          userToken = res.body.payload.token;
          expect(res).to.have.status(200);
          expect(res.body.payload).to.have.property('token');
          done();
        });
    });
    it('should create a gifs post', (done) => {
      chai.request(app)
        .post(gifsPostUrl)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('userId', '1')
        .field('title', 'Beautiful')
        .attach('image', fs.readFileSync(path.join(__dirname, '/mockData/gif.jpg')), 'gif.jpg')
        .set('Authorization', userToken)
        .end((error, res) => {
          expect(res).to.have.status(201);
          expect(res.body.success).to.equal(true);
          expect(res.body.payload).to.have.property('gifId');
          expect(res.body.payload).to.have.property('createdOn');
          expect(res.body.payload).to.have.property('title');
          expect(res.body.payload).to.have.property('imageUrl');
          done();
        })
    }).timeout(20000);
  });
});
