import { Router } from "express";
import { upload } from '../middleware/multer.middleware.js';

const router = Router();


import { 
    uploadFile,
    deleteFile,
    getFile,
    downloadFile

 } from "../controllers/file.controller.js";


router.route("/upload").post(
    upload.single('file'),
   uploadFile 
);

router.route("/deletefile/:documentid").delete(deleteFile);
router.route("/getfiles").get(getFile);
router.route("/downloadfile/:documentid").get(downloadFile);



export default router