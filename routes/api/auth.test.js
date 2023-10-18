const mongoose = require('mongoose');
const request = require('supertest');

const app = require('../../app');

const User = require('../../models/user');

const { DB_HOST_TEST, PORT } = process.env;

describe('test login route', () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  beforeEach(() => {});

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('test correct login data', async () => {
    const loginData = {
      email: 'test@gmail.com',
      password: '12345678',
    };
    await request(app).post('/users/signup').send(loginData);
    const {
      body: { token, user },
      statusCode,
    } = await request(app).post('/users/login').send(loginData);

    expect(statusCode).toBe(200);
    expect(token).toBeDefined();
    expect(user).toBeDefined();
    expect(Object.keys(user).length).toBe(2);
    const { email, subscription } = user;
    expect(email).toBeDefined();
    expect(subscription).toBeDefined();
    expect(typeof email).toBe('string');
    expect(typeof subscription).toBe('string');
  });
});
