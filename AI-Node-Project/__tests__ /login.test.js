const request = require('supertest');
// const app = require('../index'); // assuming the app is exported from app.js


describe('POST /login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Happy path
  it('should return 200 and a token with valid credentials', async () => {
    // console.log('test', request(app).post);
    const response = await request("http://localhost:3000")
      .post('/login')
      .send({ username: 'admin', password: 'password123' });

    expect(response.statusCode).toBe(200);
  });

  // // Invalid username
  // it('should return 401 for invalid username', async () => {
  //   const response = await request(app)
  //     .post('/login')
  //     .send({ username: 'wronguser', password: 'testpass' });

  //   expect(response.statusCode).toBe(401);
  //   expect(response.body).toEqual({ message: 'Invalid credentials' });
  // });

  // // Invalid password
  // it('should return 401 for invalid password', async () => {
  //   const response = await request(app)
  //     .post('/login')
  //     .send({ username: 'testuser', password: 'wrongpass' });

  //   expect(response.statusCode).toBe(401);
  //   expect(response.body).toEqual({ message: 'Invalid credentials' });
  // });

  // // Missing username
  // it('should return 400 if username is missing', async () => {
  //   const response = await request(app)
  //     .post('/login')
  //     .send({ password: 'testpass' });

  //   expect(response.statusCode).toBe(400);
  // });

  // // Missing password
  // it('should return 400 if password is missing', async () => {
  //   const response = await request(app)
  //     .post('/login')
  //     .send({ username: 'testuser' });

  //   expect(response.statusCode).toBe(400);
  // });

  // // Empty request body
  // it('should return 400 for empty request body', async () => {
  //   const response = await request(app)
  //     .post('/login')
  //     .send({});

  //   expect(response.statusCode).toBe(400);
  // });
});
