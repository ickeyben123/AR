import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user-controller.js';

router.get("/", userController.getUsers);
router.post("/", userController.addUser);
router.delete("/:userId", userController.deleteUser);
router.put("/:userId", userController.updateUser);

export default router