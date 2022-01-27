import { Router } from 'express';
import { mahasiswaAuth } from '../middleware/auth';
import * as controller from '../controllers/mahasiswaController';
const router = Router();

router.all('/*', mahasiswaAuth);
router.get('/', controller.index);
router.get('/konsultasi', controller.konsultasi);
router.get('/logbook', controller.logbook);
export default router;
