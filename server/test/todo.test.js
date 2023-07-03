'use strict';

const request = require('supertest');
const { default: Todo } = require('../dist/models/todo');
const { default: User } = require('../dist/models/user');
const { default: Event } = require('../dist/models/event');
const { default: app } = require('../dist/app.js');
const { default: sequelize } = require('../dist/models/modelDB');
const userMocks = require('./mocks/userMocks')
const eventMocks = require('./mocks/eventMocks')
const todoMocks = require('./mocks/todoMocks')

beforeAll(async () => {
  await sequelize.authenticate();
  await User.create(userMocks.user01);
  await Event.create(eventMocks.event01);
});

afterAll(async () => {
  await Todo.destroy({ where: {} });
  // WHY THE HECK THESE ARE NOT WORKING
  // await Event.destroy({ where: {} });
  // await User.destroy({ where: {} });
  await sequelize.close();
});

describe('Todo controller tests', () => {
  //
  it('Creates a todo', async () => {
    const user01 = await User.findOne({ where: { email: userMocks.user01.email } });
    const event01 = await Event.findOne({ where: { title: eventMocks.event01.title } });
    const u01 = user01.dataValues.userId;
    const e01 = event01.dataValues.eventId;
    const res = await request(app)
      .post('/todo')
      .send({ ...todoMocks.todo01, creatorId: u01, eventId: e01 })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const parsedRes = JSON.parse(res.text)
    expect(res.status).toBe(201)
    expect(parsedRes.success).toBe(true);
    expect(parsedRes.message).toBe('Todo created');
    expect(parsedRes.data.title).toBe(todoMocks.todo01.title);
  });
  //
  it('Updates a todo', async () => {
    const todo = await Todo.findOne({ where: { title: todoMocks.todo01.title } });
    const res = await request(app)
      .patch(`/todo/${todo.id}`)
      .send(todoMocks.updatedTodo)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);
    const parsedRes = JSON.parse(res.text)
    expect(res.status).toBe(200)
    expect(parsedRes.success).toBe(true);
    expect(parsedRes.message).toBe('Todo updated');
    expect(parsedRes.data.title).toBe('Updated todo');
  });
  //
  it('Deletes a todo', async () => {
    const todo = await Todo.findOne({ where: todoMocks.updatedTodo });
    const res = await request(app)
      .delete(`/todo/${todo.id}`)
    const parsedRes = JSON.parse(res.text)
    expect(res.status).toBe(201)
    expect(parsedRes.success).toBe(true);
    expect(parsedRes.message).toBe('Todo deleted');
  });
  //
  it('Fetches todos from event', async () => {
    const user01 = await User.findOne({ where: { email: userMocks.user01.email } });
    const event01 = await Event.findOne({ where: { title: eventMocks.event01.title } });
    const u01 = user01.dataValues.userId;
    const e01 = event01.dataValues.eventId;
    await Todo.create({ ...todoMocks.todo02, creatorId: u01, eventId: e01 })
    const res = await request(app)
      .get(`/todos/${e01}`)
    const parsedRes = JSON.parse(res.text)
    expect(res.status).toBe(200)
    expect(parsedRes.success).toBe(true);
    expect(parsedRes.message).toBe('Expenses fetched');
  });
});