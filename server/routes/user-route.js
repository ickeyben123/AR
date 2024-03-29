import express from 'express';
const router = express.Router();
import * as userController from '../controllers/user-controller.js';
import * as validation from '../middleware/validation.js';
import * as validationJWT from '../middleware/validateJWT.js';

router.post("/", [validation.checkDuplicateEmail,validation.checkDuplicateUsername,validation.validatePassword],userController.addUser);
router.get("/all",[validationJWT.verifyToken,validationJWT.isAdmin], userController.getUsers);
router.get("/",[validationJWT.verifyToken], userController.getUser);
router.put("/email",[validationJWT.verifyToken,validation.checkDuplicateEmail], userController.updateEmail);
router.put("/pass",[validationJWT.verifyToken,validation.validatePassword], userController.updatePassword);
router.delete("/:userId", [validationJWT.verifyToken,validationJWT.isAdmin], userController.deleteAnyUser);
router.delete("/",[validationJWT.verifyToken],userController.deleteUser);
router.post("/login", userController.loginUser);
// For push notifications
router.get("/vapid",[validationJWT.verifyToken],userController.getVAPID);
router.post("/subscribe",[validationJWT.verifyToken],userController.saveVAPIDSubscription)

router.post("/loggedIn", userController.loggedIn);
router.post("/logout",[validationJWT.verifyToken],userController.deleteCookie);

export default router