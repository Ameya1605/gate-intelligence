import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDatabase } from './database';

const PORT = process.env.PORT ?? 4000;
const MONGO_URI =
  process.env.MONGO_URI ?? 'mongodb://localhost:27017/gate-intelligence';

async function bootstrap(): Promise<void> {
  await connectDatabase(MONGO_URI);
  const app = await createApp();

  app.listen(PORT, () => {
    console.log(`🚀 GATE Intelligence Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
