import express, { Router, Request, Response } from 'express';
import * as controller from '../controllers/indexController';
import * as authController from '../controllers/authController';
const router = Router();

router.get('/', controller.index);
router.get('/pic/:nim', controller.getMhsPicByNim);
router.get('/profil/dosen/:nip', controller.getDosenPicByNip);
router.get('/login', authController.loginIndex);
router.post('/login', authController.loginServerSide);
router.get('/logout', authController.logout);
router.use('*', (req: Request, res: Response) => {
  if (req.headers['accept'] == 'application/json') {
    res.status(404).json({
      message: 'URL NOT FOUND',
    });
  } else {
    res.status(404).render('_404');
  }
});

export default router;
