import { Router } from "express";
import * as controller from "../controllers/indexController"
import * as authController from "../controllers/authController"
export const index = Router();

index.get('/', controller.index);
index.post('/login', authController.login);