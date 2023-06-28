'use strict';

// const request = require('supertest');
// const { default: User } = require('../dist/models/user');
// const { default: app } = require('../dist/app.js');
// const { default: sequelize } = require('../dist/models/modelDB');
// const userMocks = require('./mocks/userMocks')

// beforeAll(async () => {
//   await sequelize.authenticate();
// });

// afterAll(async () => {
//   await User.destroy({ where: {} });
//   await sequelize.close();
// });

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
    it('Fetches an user', async () => {
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
    //
    it('Fetch fails with wrong uuid', async () => {
      const res = await request(app)
        .get('/user/' + userMocks.randomUUID)
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(404);
      expect(parsedRes.message).toBe('No user found');
    });
    //
    it('Fetch fails with wrong request', async () => {
      const res = await request(app)
        .get('/user/patata')
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(400);
      expect(parsedRes.message).toContain('invalid input syntax for type uuid');
    });
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
    //
    it('Update fails with wrong uuid', async () => {
      const res = await request(app)
        .patch('/user/' + userMocks.randomUUID)
        .send(userMocks.user02)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(500);
      expect(parsedRes.message).toContain('Cannot read properties of undefined');
    });
    //
  });
  describe('Deletes an user', () => {
    //
    it('Deletes an user', async () => {
      const user = await User.findOne({ where: { email: userMocks.user02.email } });
      const res = await request(app)
        .delete('/user/' + user.userId)
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(200);
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User deleted');
      expect(parsedRes.data).toBe(1);
    });
  });
  // describe('Fetches users from event', () => {
    //
  // });

});