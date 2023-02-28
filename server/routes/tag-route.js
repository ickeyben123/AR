import express from 'express';
const router = express.Router();
import * as tagController from '../controllers/tag-controller.js';
import * as validation from '../middleware/validateJWT.js';


router.get("/",[validation.verifyToken], tagController.getTags);
router.post("/", tagController.addTag);
router.delete("/:tagId", tagController.deleteTag);
router.put("/:tagId", tagController.updateTag);

export default router