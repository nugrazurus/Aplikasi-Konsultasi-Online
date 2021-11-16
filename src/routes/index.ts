import { Router } from 'express';
import * as controller from '../controllers/indexController';
import * as authController from '../controllers/authController';
const index = Router();

index.get('/', controller.index);
index.post('/login', authController.login);

export default index;
