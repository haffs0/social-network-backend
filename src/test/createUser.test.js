const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const createUserUrl = '/api/v1/auth/create-user';
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

const newUser = {
  firstName: 'Oyinda',
  lastName: 'Aremu',
  email: 'try2@gmail.com',
  password: 'aremu',
  gender: 'Female',
  jobRole: 'Lead developer',
  department: 'Software',
  address: 'Yaba Lagos',
  phoneNumber: '08092341243',
  role: 'user',
  userAccess: 'yes',
};


describe('Create users test', () => {
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
  describe('Unauthenticated admin cannot create user', () => {
    it('should respond with unauthenticated error', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('Unauthorized user cannot create user', () => {
    it('should respond with forbidden error', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', userToken)
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('Admin can create user', () => {
    it('should respond with user data and status code 201', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body.payload).to.have.property('userId');
          expect(res.body.payload).to.have.property('token');
          done();
        });
    });
  });
  describe('cannot create user with already existing email', () => {
    it('should respond with error message', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send(newUser)
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('cannot create a user with invalid data', () => {
    it('should respond with error for white space', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send({
          firstName: '                ',
          lastName: 'Aremu',
          email: 'joy@gmail.com',
          password: 'joy',
          gender: 'male',
          jobRole: 'Lead developer',
          department: 'Software',
          address: 'Yaba Lagos',
          phoneNumber: '08092341243',
          role: 'user',
          userAccess: 'yes',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('should respond with error for empty field', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send({
          firstName: '',
          lastName: 'Aremu',
          email: 'joy@gmail.com',
          password: 'joy',
          gender: 'male',
          jobRole: 'Lead developer',
          department: 'Software',
          address: 'Yaba Lagos',
          phoneNumber: '08092341243',
          role: 'user',
          userAccess: 'yes',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
  describe('cannot create a user with invalid email', () => {
    it('should respond with error for empty field', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send({
          firstName: 'Joy',
          lastName: 'Aremu',
          email: '',
          password: 'joy',
          gender: 'male',
          jobRole: 'Lead developer',
          department: 'Software',
          address: 'Yaba Lagos',
          phoneNumber: '08092341243',
          role: 'user',
          userAccess: 'yes',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('should respond with error for white space', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send({
          firstName: 'Joy',
          lastName: 'Aremu',
          email: '            ',
          password: 'joy',
          gender: 'male',
          jobRole: 'Lead developer',
          department: 'Software',
          address: 'Yaba Lagos',
          phoneNumber: '08092341243',
          role: 'user',
          userAccess: 'yes',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
    it('should respond with error for invalid email', (done) => {
      chai.request(app)
        .post(createUserUrl)
        .set('Authorization', adminToken)
        .send({
          firstName: 'Joy',
          lastName: 'Aremu',
          email: 'joy',
          password: 'joy',
          gender: 'male',
          jobRole: 'Lead developer',
          department: 'Software',
          address: 'Yaba Lagos',
          phoneNumber: '08092341243',
          role: 'user',
          userAccess: 'yes',
        })
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.body).to.have.property('success', false);
          done();
        });
    });
  });
});
