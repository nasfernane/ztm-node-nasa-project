const request = require('supertest');
const app = require('../../app');
const { mongoConnect, mongoDisconnect } = require('./../../services/mongo');

const API_VERSION = "/v1";

describe('Test launches API', () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      await mongoConnect();
      await request(app)
        .get(API_VERSION + '/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  })

  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-296 f',
      launchDate: 'January 4'
    }

    const launchDataWithouthDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-296 f'
    }

    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-296 f',
      launchDate: 'zoot'
    }

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post(API_VERSION + '/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithouthDate)
    })

    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post(API_VERSION + '/launches')
        .send(launchDataWithouthDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property"
      })
    })

    test('It should catch invalid date', async () => {
      const response = await request(app)
        .post(API_VERSION + '/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid date"
      })
    })
  })
})
