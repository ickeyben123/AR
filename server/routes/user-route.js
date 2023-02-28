import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user-controller.js';
import * as validation from '../middleware/validation.js';

router.post("/", [validation.checkDuplicateUsernameOrEmail,validation.validatePassword],userController.addUser);
router.get("/", userController.getUsers);
router.get("/:userId", userController.getUser);
router.put("/:userId", userController.updateUser);
router.delete("/:userId", userController.deleteUser);
router.post("/login", userController.loginUser);

export default router