'use strict';

const request = require('supertest');
const { default: User } = require('../dist/models/user');
const { default: Event } = require('../dist/models/event');
const { default: UserEvent } = require('../dist/models/userEvent');
const { default: app } = require('../dist/app.js');
const { default: sequelize } = require('../dist/models/modelDB');
const userMocks = require('./mocks/userMocks')
const eventMocks = require('./mocks/eventMocks')

beforeAll(async () => {
  await sequelize.authenticate();
  // const user02 = await User.create(userMocks.user02)
  const user03 = await User.create(userMocks.user03)
  // const event01 = await Event.create(eventMocks.event01)
  // const u02 = user02.dataValues.userId;
  // const u03 = user03.dataValues.userId;
  // const e01 = event01.dataValues.eventId;
  // console.log(u02);
  // console.log(u03);
  // console.log(e01);
  // await UserEvent.create({ userId: u02, eventId: e01 })
  // await UserEvent.create({ userId: u03, eventId: e01 })
  // await Event.create(eventMocks.event02)
});

afterAll(async () => {
  await User.destroy({ where: {} });
  await Event.destroy({ where: {} });
  await sequelize.close();
});

describe('User controller tests', () => {
  //
  describe('Register user', () => {
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
        .send({ ...userMocks.user02, email: userMocks.user01.email })
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
        .send({ name: userMocks.user02.name })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text)
      expect(res.status).toBe(409)
      expect(parsedRes.message).toBe('Missing input data');
    });
  });
  //
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
      expect(parsedRes.success).toBe(false);
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
  //
  describe('Update user', () => {
    //
    it('Updates an user', async () => {
      const user = await User.findOne({ where: { email: userMocks.user01.email } });
      const res = await request(app)
        .patch('/user/' + user.userId)
        .send({ name: userMocks.user02.name })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(200);
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User updated');
      expect(parsedRes.data.name).toBe(userMocks.user02.name);
      expect(parsedRes.data.email).toBe(userMocks.user01.email)
    });
    //
    it('Update fails with wrong uuid', async () => {
      const res = await request(app)
        .patch('/user/' + userMocks.randomUUID)
        .send(userMocks.user02)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(400);
      expect(parsedRes.success).toBe(false);
      expect(parsedRes.message).toBe('Wrong user id');
    });
    //
    it('Update fails with used email', async () => {
      const user = await User.findOne({ where: { email: userMocks.user03.email } });
      const res = await request(app)
        .patch('/user/' + user.userId)
        .send({ email: userMocks.user01.email })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/);
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(409);
      expect(parsedRes.success).toBe(false);
      expect(parsedRes.message).toBe('Email already exists');
    });
    //
  });
  //
  describe('Delete user', () => {
    //
    it('Deletes an user', async () => {
      const user = await User.findOne({ where: { email: userMocks.user01.email } });
      const res = await request(app)
        .delete('/user/' + user.userId)
      const parsedRes = JSON.parse(res.text);
      expect(res.status).toBe(200);
      expect(parsedRes.success).toBe(true);
      expect(parsedRes.message).toBe('User deleted');
      expect(parsedRes.data).toBe(1);
    });
  });
  //
  // describe('Fetch users', () => {
  //   //
  //   it('Fetches all users from event', async () => {
  //     const event = await Event.findOne({ where: { title: eventMocks.event01.title } });
  //     const res = await request(app)
  //       .get('/users/' + event.eventId)
  //     const parsedRes = JSON.parse(res.text);
  //     expect(res.status).toBe(200);
  //     expect(parsedRes.success).toBe(true);
  //     expect(parsedRes.message).toBe('Event users fetched');
  //     expect(parsedRes.data[0].name).toBe(userMocks.user02.name);
  //     expect(parsedRes.data[1].name).toBe(userMocks.user03.name);
  //   });
  //   //
  //   it('Fetches nothing from empty event', async () => {
  //     const event = await Event.findOne({ where: { title: eventMocks.event02.title } });
  //     const res = await request(app)
  //       .get('/users/' + event.eventId)
  //     const parsedRes = JSON.parse(res.text);
  //     expect(res.status).toBe(500);
  //     expect(parsedRes.message).toBe('No users were found');
  //   });
  // });
});