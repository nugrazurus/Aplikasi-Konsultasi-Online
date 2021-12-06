import { Request, Response, Router } from 'express';
import { redirectIfAuthenticated } from '../middleware/auth';
import * as controller from '../controllers/dosenController';
import jwt from 'jsonwebtoken';
const router = Router();

router.all('/*', redirectIfAuthenticated);
router.get('/', controller.index);
router.get('/konsultasi', controller.konsultasi);
router.get('/logbook', controller.logbook);
router.get('/logbook/:nim', controller.logbookDetail);
export default router;
