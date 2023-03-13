import express from 'express';
const router = express.Router();
import * as tagController from '../controllers/tag-controller.js';
import * as validationJWT from '../middleware/validateJWT.js';

router.get("/",[validationJWT.verifyToken], tagController.getTags);
router.post("/",[validationJWT.verifyToken], tagController.addTag);
router.delete("/:tagId",[validationJWT.verifyToken], tagController.deleteTag);
router.put("/:tagId",[validationJWT.verifyToken], tagController.updateTag);

export default router