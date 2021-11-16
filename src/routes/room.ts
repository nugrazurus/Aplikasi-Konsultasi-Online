import { Router } from 'express';
import * as controller from '../controllers/roomController';
import { verifyToken } from '../middleware/auth';

const room = Router();

room.all('/', verifyToken);
room.get('/coba', controller.coba);
room.get('/:roomName', controller.show);
room.post('/', controller.create);
room.put('/:roomName');
room.delete('/:roomName', controller.destroy);

export default room;
