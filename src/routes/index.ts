import { Router, Request, Response } from 'express';
import * as controller from '../controllers/indexController';
import * as authController from '../controllers/authController';
const index = Router();

index.get('/', controller.index);
index.post('/login', authController.login);
index.use('*', (req: Request, res: Response) => {
  res.status(404).render('_404');
});

export default index;
