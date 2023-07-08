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
  it('Fetches an event', async () => {
    expect(true).toBeTruthy();
  });

  it('Updates an event', async () => {
    expect(true).toBeTruthy();
  });

  it('Deletes an event', async () => {
    expect(true).toBeTruthy();
  });

  it('Fetches events from user', async () => {
    expect(true).toBeTruthy();
  });
});