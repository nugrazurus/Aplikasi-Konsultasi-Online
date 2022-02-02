import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import multer from 'multer';
import * as controller from '../controllers/apiController';
import * as logbookController from '../controllers/logbookController';
const router = Router();
const upload = multer();

router.all('/*', verifyToken);
router.get('/periodelirs', controller.getPeriodeLirs);
router.post('/logbook', logbookController.create);
router.get('/logbook/:nim', logbookController.showByNim);
router.get('/logbook/id/:id', logbookController.show);
router.put('/logbook/id/:id', upload.single('lampiran'), logbookController.update);
router.delete('/logbook/id/:id', logbookController.destroy);
export default router;
