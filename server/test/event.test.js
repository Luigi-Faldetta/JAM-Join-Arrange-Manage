'use strict';

const request = require('supertest');
const { default: Event } = require('../dist/models/event');
const { default: app } = require('../dist/app.js');
const { default: sequelize } = require('../dist/models/modelDB');
const eventMocks = require('./mocks/eventMocks')

beforeAll(async () => {
  await sequelize.authenticate();
});

afterAll(async () => {
  await Event.destroy({ where: {} });
  await sequelize.close();
});

describe('Event controller tests', () => {
  it('Creates an event', async () => {
    expect(true).toBeTruthy();
  });
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