import { Request, Response, Router } from 'express';
import { redirectIfAuthenticated } from '../middleware/auth';
import * as controller from '../controllers/dosenController';
import jwt from 'jsonwebtoken';
const router = Router();

router.all('/*', redirectIfAuthenticated);
router.get('/', controller.index);
export default router;
