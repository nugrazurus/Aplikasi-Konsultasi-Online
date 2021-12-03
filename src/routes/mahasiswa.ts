import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import * as controller from '../controllers/apiController';
const router = Router();

router.all('/*', verifyToken);
router.get('/periodelirs', controller.getPeriodeLirs);
export default router;
