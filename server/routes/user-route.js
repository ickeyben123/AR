import express from 'express';
const router = express.Router();
import userController from '../controllers/blogController';

router.get("/", userController.getUsers);
router.post("/", blogController.addUser);
router.delete("/:userId", blogController.deleteUser);
router.put("/:userId", blogController.updateUser);

export default router