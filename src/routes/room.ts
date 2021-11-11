import { Router } from "express";
import * as controller from "../controllers/roomController"
export const room = Router();

room.get('/:roomName', controller.show);
room.post('/', controller.create);
room.put('/:roomName');
room.delete('/:roomName', controller.destroy);