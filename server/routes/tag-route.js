import express from 'express';
const router = express.Router();
import * as tagController from '../controllers/tag-controller.js';
import * as validation from '../middleware/validateJWT.js';


router.get("/",[validation.verifyToken], tagController.getTags);
router.get("/:tagId",[validation.verifyToken], tagController.getTag);
router.post("/",[validation.verifyToken], tagController.addTag);
router.delete("/:tagId",[validation.verifyToken], tagController.deleteTag);
router.put("/:tagId",[validation.verifyToken], tagController.updateTag);

export default router