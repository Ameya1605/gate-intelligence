import { Router } from 'express';
import { mocksController } from './mocks.controller';

const router = Router();

router.post('/', (req, res) => mocksController.create(req, res));
router.get('/', (req, res) => mocksController.list(req, res));
router.get('/:id', (req, res) => mocksController.getOne(req, res));
router.delete('/:id', (req, res) => mocksController.remove(req, res));

export default router;
