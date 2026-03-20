import { Router } from 'express';
import { analyticsController } from './analytics.controller';

const router = Router();

// Full dashboard in one call
router.get('/dashboard', (req, res) => analyticsController.dashboard(req, res));

// Individual metric endpoints
router.get('/accuracy', (req, res) => analyticsController.accuracy(req, res));
router.get('/effort', (req, res) => analyticsController.effort(req, res));
router.get('/productivity', (req, res) => analyticsController.productivity(req, res));
router.get('/readiness', (req, res) => analyticsController.readiness(req, res));
router.get('/insights', (req, res) => analyticsController.insights(req, res));

export default router;
