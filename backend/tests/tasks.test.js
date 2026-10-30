const request = require('supertest');
const app = require('../server');
const Task = require('../models/Task');

// Mock Task model for deterministic testing in CI pipeline
jest.mock('../models/Task');

describe('Task Management API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1 (Primary Practical Requirement): GET /tasks returns 200
  test('GET /tasks returns 200', async () => {
    Task.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue([
        {
          _id: 'mock-id-1',
          title: 'Verify CI/CD Pipeline with GitHub Actions',
          status: 'in-progress',
          priority: 'high',
          assignedUser: 'Divy (24IT047)'
        }
      ])
    });

    const res = await request(app).get('/tasks');
    // Deliberate test failure for CI failure demonstration: expecting 500 instead of 200
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // Test 2 (Supplementary Requirement): GET / health check endpoint returns 200
  test('GET / returns 200 with API status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toContain('TaskPulse Fullstack API is running');
  });

  // Test 3 (Validation check): POST /tasks returns 400 when title is missing
  test('POST /tasks returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ description: 'Task missing title' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Task title is required');
  });
});
