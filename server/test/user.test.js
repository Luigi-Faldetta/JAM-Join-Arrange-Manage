'use strict';

const request = require('supertest');
const { default: User } = require('../dist/models/user');
const { default: app } = require('../dist/app.js');
const { default: sequelize } = require('../dist/models/modelDB');
const userMocks = require('./mocks/userMocks')

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe('User controller tests', () => {
  //
  describe('Registration', () => {
    //
    it('Registers an user', async () => {
      const res = await request(app)
        .post('/register')
        .send(userMocks.user01)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text)
      expect(res.status).toBe(201)
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User created');
      expect(parsedRes.data.name).toBe(userMocks.user01.name);
      expect(parsedRes.data.email).toBe(userMocks.user01.email);
    });
    //
    it('Register fails if email in use', async () => {
      const res = await request(app)
        .post('/register')
        .send(userMocks.user01)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text)
      expect(res.status).toBe(409)
      expect(parsedRes.message).toBe('User already exists');
    });
    //
    it('Register fails if missing data', async () => {
      const res = await request(app)
        .post('/register')
        .send(userMocks.user02)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text)
      expect(res.status).toBe(409)
      expect(parsedRes.message).toBe('Missing input data');
    });
    //
  });
  describe('Get user', () => {
    //
    it('Fetchs an user', async () => {
      const user = await User.findOne({ where: { email: userMocks.user01.email } });
      const res = await request(app)
        .get('/user/' + user.userId)
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(200);
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User fetched');
      expect(parsedRes.data.name).toBe(userMocks.user01.name);
      expect(parsedRes.data.email).toBe(userMocks.user01.email)
    });
    // TO BE DONE
    // it('Fetch fails with wrong id', async () => {
    //   const res = await request(app)
    //     .get('/user/' + 'banana')
    //   const parsedRes = JSON.parse(res.text);
    //   expect(res.status).toBe(400);
    // });
    //
  });
  describe('Update user', () => {
    //
    it('Updates an user', async () => {
      const user = await User.findOne({ where: { email: userMocks.user01.email } });
      const res = await request(app)
        .patch('/user/' + user.userId)
        .send(userMocks.user02)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(200);
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User updated');
      expect(parsedRes.data.name).toBe(userMocks.user01.name);
      expect(parsedRes.data.email).toBe(userMocks.user02.email)
    });
    // TO BE DONE
    // it('Update fails with wrong id', async () => {
    //   expect(true).toBeTruthy()
    // });
    //
  });
  describe('Deletes an user', () => {
    // TO BE DONE
    // it('Deletes an user', async () => {
    //   const user = await User.findOne({ where: { email: userMocks.user02.email } });
    //   console.log('u', user);
    //   const res = await request(app)
    //   .delete('/user/' + user.userId)
    //   const parsedRes = JSON.parse(res.text);
    //   console.log('pR', parsedRes);
    //   expect(res.status).toBe(200);
    //   expect(parsedRes.success).toBe(true);
    //   expect(parsedRes.message).toBe('User deleted');
    //   expect(parsedRes.data.name).toBe(userMocks.user02.name);
    //   expect(parsedRes.data.email).toBe(userMocks.user02.email)
    // });
  });
  describe('Get users from event', () => {
    //
  });

});