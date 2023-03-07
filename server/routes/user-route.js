import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user-controller.js';
import * as validation from '../middleware/validation.js';
import * as validationJWT from '../middleware/validateJWT.js';

router.post("/", [validation.checkDuplicateUsernameOrEmail,validation.validatePassword],userController.addUser);
router.get("/all",[validationJWT.verifyToken,validationJWT.isAdmin], userController.getUsers);
router.get("/",[validationJWT.verifyToken], userController.getUser);
router.put("/",[validationJWT.verifyToken], userController.updateUser);
router.delete("/", [validationJWT.verifyToken,validationJWT.isAdmin], userController.deleteUser);
router.post("/login", userController.loginUser);

export default router