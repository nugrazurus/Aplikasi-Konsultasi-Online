import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import * as controller from '../controllers/apiController';
const api = Router();

api.all('/*', verifyToken);
api.get('/periodelirs', controller.getPeriodeLirs);
export default api;
