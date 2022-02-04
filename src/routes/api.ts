import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import multer from 'multer';
import * as controller from '../controllers/apiController';
import * as logbookController from '../controllers/logbookController';
import * as authController from '../controllers/authController';
const router = Router();
const upload = multer();

router.post('/generate-token', authController.login)
router.all('/logbook*', verifyToken);
router.get('/periodelirs', controller.getPeriodeLirs);
router.post('/logbook', logbookController.create);
router.get('/logbook/:id', logbookController.show);
router.put('/logbook/:id', upload.single('lampiran'), logbookController.update);
router.delete('/logbook/:id', logbookController.destroy);
router.get('/logbook/mahasiswa/:nim', logbookController.showByNim);
router.get('/logbook/dosen/:nip', logbookController.showByNip);
export default router;
