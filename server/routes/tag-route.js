import express from 'express';
const router = express.Router();
import * as tagController from '../controllers/tag-controller.js';
import * as validationJWT from '../middleware/validateJWT.js';

router.get("/admin",[validationJWT.verifyToken,validationJWT.isAdmin], tagController.getAllTags);
router.get("/",[validationJWT.verifyToken], tagController.getTags);
router.get("/:tagId",[validationJWT.verifyToken], tagController.getTag);
router.post("/",[validationJWT.verifyToken], tagController.addTag);
router.delete("/:tagId",[validationJWT.verifyToken], tagController.deleteTag);
router.put("/:tagId",[validationJWT.verifyToken], tagController.updateTag);


export default router
