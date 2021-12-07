import { Router, Request, Response } from 'express';
import * as controller from '../controllers/indexController';
import * as authController from '../controllers/authController';
const router = Router();

router.get('/', controller.index);
router.get('/pic/:nim', controller.getMhsPicByNim);
router.get('/profil/dosen/:nip', controller.getDosenPicByNip);
router.post('/login', authController.loginServerSide);
router.get('/logout', authController.logout);
router.use('*', (req: Request, res: Response) => {
  res.status(404).render('_404');
});

export default router;
