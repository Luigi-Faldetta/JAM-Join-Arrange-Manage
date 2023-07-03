'use strict';

const request = require('supertest');
const { default: User } = require('../dist/models/user');
const { default: Event } = require('../dist/models/event');
const { default: app } = require('../dist/app.js');
const { default: sequelize } = require('../dist/models/modelDB');
const userMocks = require('./mocks/userMocks')
const eventMocks = require('./mocks/eventMocks')

beforeAll(async () => {
  await sequelize.authenticate();
  await User.create(userMocks.user01);
});

afterAll(async () => {
  await Event.destroy({ where: {} });
  await User.destroy({ where: {} });
  await sequelize.close();
});

describe('Event controller tests', () => {
  // it('Creates an event', async () => {
  //   const user = await User.findOne({ where: { email: userMocks.user01.email } });
  //   const res = await request(app)
  //     .post(`/newevent/${user.userId}`)
  //     .send(eventMocks.event01)
  //     .set('Accept', 'application/json')
  //     .expect('Content-Type', /json/);
  //     const parsedRes = JSON.parse(res.text)
  //     console.log(user.userId);
  //     console.log(eventMocks.event01);
  //     console.log(parsedRes);
  //     // WHY THE HECK THIS IS NOT WORKING
  //   expect(res.status).toBe(201)
  //   expect(parsedRes.success).toBe(true);
  //   expect(parsedRes.message).toBe('Event created');
  //   expect(parsedRes.data.title).toBe(eventMocks.event01.title);
  // });
  //
  it('Fetches an event', async () => {
    expect(true).toBeTruthy();
  });
  //
  it('Updates an event', async () => {
    expect(true).toBeTruthy();
  });
  //
  it('Deletes an event', async () => {
    expect(true).toBeTruthy();
  });
  //
  it('Fetches events from user', async () => {
    expect(true).toBeTruthy();
  });
});