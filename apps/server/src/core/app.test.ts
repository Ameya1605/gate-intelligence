import request from 'supertest';
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './database';
import mongoose from 'mongoose';

describe('Server Smoke Test', () => {
  let app: any;

  beforeAll(async () => {
    // Connect to a memory-based or local test DB if possible
    // For now, we just skip real DB connection for smoke test if it fails
    try {
      await connectDatabase(process.env.MONGO_URI || 'mongodb://localhost:27017/gate_test');
    } catch (e) {
      console.warn('Skipping DB connection in test');
    }
    app = await createApp();
  });

  afterAll(async () => {
    await disconnectDatabase();
    await mongoose.connection.close();
  });

  it('should return 200 OK for /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('should return pong for /ping', async () => {
    const res = await request(app).get('/ping');
    expect(res.status).toBe(200);
    expect(res.text).toBe('pong');
  });
});
