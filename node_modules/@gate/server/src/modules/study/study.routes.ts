import { Router } from 'express';
import { studyController } from './study.controller';

/**
 * Study feature routes.
 * Deleting this file (or the entire /study folder) removes the feature.
 */
const router = Router();

router.post('/', (req, res) => studyController.create(req, res));
router.get('/', (req, res) => studyController.list(req, res));
router.get('/heatmap', (req, res) => studyController.heatmap(req, res));
router.get('/:id', (req, res) => studyController.getOne(req, res));
router.patch('/:id', (req, res) => studyController.update(req, res));
router.delete('/:id', (req, res) => studyController.remove(req, res));

export default router;
