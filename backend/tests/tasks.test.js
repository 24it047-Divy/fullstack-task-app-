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
    expect(res.statusCode).toBe(200);
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

  // Test 4 (AI Integration): POST /api/ai/generate-description returns 200 with graceful degradation
  test('POST /api/ai/generate-description returns 200 with generated description', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: 'Build Docker Container Images' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.description).toBe('string');
    expect(res.body.description.length).toBeGreaterThan(10);
    expect(res.body.disclaimer).toContain('AI-generated suggestion');
  });

  // Test 5 (AI Validation): POST /api/ai/generate-description returns 400 when title is missing
  test('POST /api/ai/generate-description returns 400 when title is missing', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .send({ title: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Task title is required');
  });

  // Test 6 (Practical 9: In-Memory Caching Stats): GET /tasks/cache/stats returns 200 with cache metrics
  test('GET /tasks/cache/stats returns 200 with cache metrics', async () => {
    const res = await request(app).get('/tasks/cache/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.stats).toBeDefined();
    expect(typeof res.body.stats.ttlSeconds).toBe('number');
    expect(res.body.stats.ttlSeconds).toBe(60);
  });

  // Test 7 (Practical 9: Cache Invalidation): POST /tasks/cache/clear flushes cache
  test('POST /tasks/cache/clear flushes cache successfully', async () => {
    const res = await request(app).post('/tasks/cache/clear');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('flushed successfully');
  });

  // Test 8 (Auth Validation): POST /api/auth/register returns 400 when fields are missing
  test('POST /api/auth/register returns 400 when required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Please provide name, email, and password');
  });

  // Test 9 (Auth Validation): POST /api/auth/login returns 400 when credentials missing
  test('POST /api/auth/login returns 400 when credentials are missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Please provide an email and password');
  });
});
