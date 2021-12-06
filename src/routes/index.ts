import axios from 'axios';
import { Router, Request, Response } from 'express';
// import * as controller from '../controllers/indexController';
import * as authController from '../controllers/authController';
const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.redirect('/login');
});
router.get('/logbook', (req: Request, res: Response) => {
  res.status(200).render('logbook');
});
router.get('/logbook/detail', (req: Request, res: Response) => {
  res.status(200).render('logbook-detail');
});
router.get('/konsultasi', (req: Request, res: Response) => {
  res.status(200).render('konsultasi');
});
router.get('/login', (req: Request, res: Response) => {
  res.status(200).render('login');
});
router.get('/pic/:nim', async (req: Request, res: Response) => {
  const img = await axios
    .get(`http://servicedpna.untan.ac.id/mhs/getpicbynim/${req.params.nim}`, { responseType: 'arraybuffer' })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response;
    });
  res.writeHead(200, {
    'Content-Type': 'image/jpeg',
    // 'Content-Length': img.length
  });
  res.end(img);
});
router.post('/login', authController.loginServerSide);
router.get('/logout', authController.logout);
router.use('*', (req: Request, res: Response) => {
  res.status(404).render('_404');
});

export default router;
