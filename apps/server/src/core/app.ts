import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { FEATURE_CONFIG } from '../config/features';

async function loadRoutes(app: Application): Promise<void> {
  const { default: studyRoutes } = await import('../modules/study/study.routes');
  const { default: mocksRoutes } = await import('../modules/mocks/mocks.routes');
  const { default: analyticsRoutes } = await import('../modules/analytics/analytics.routes');
  const { default: lifestyleRoutes } = await import('../modules/lifestyle/lifestyle.routes');
  const { default: usersRoutes } = await import('../modules/users/users.routes');

  app.use('/api/study', studyRoutes);
  app.use('/api/mocks', mocksRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/lifestyle', lifestyleRoutes);
  app.use('/api/users', usersRoutes);

  console.log('✅ All routes registered');
}

export async function createApp(): Promise<Application> {
  const app = express();

  app.use(compression());
  
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: 'Too many requests from this IP, please try again later.',
  }));

  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://gate-intelligence.vercel.app', // placeholder for your production URL
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  }));

  app.options('*', cors());

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(express.json({ limit: '10mb' }));
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      features: FEATURE_CONFIG.map((f) => ({
        name: f.name,
        enabled: f.enabled,
      })),
    });
  });

  app.get('/ping', (_req, res) => {
    res.status(200).send('pong');
  });

  app.get('/', (_req, res) => {
    res.status(200).send('GATE Intelligence Server is alive');
  });

  await loadRoutes(app);

  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: err.message });
  });

  return app;
}