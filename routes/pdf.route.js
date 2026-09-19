import express from 'express'
import { query, uploadFiles } from '../controllers/pdf.controllers.js'
import multer from "multer"
const upload = multer({ dest: 'uploads/',
    //     fileFilter: (req, file, cb) => {
    //     const allowedTypes = [
    //         "application/pdf",
    //         "application/msword",
    //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    //     ];

    //     if (allowedTypes.includes(file.mimetype)) {
    //         cb(null, true);
    //     } else {
    //         cb(new Error("Only PDF and Word documents are allowed"));
    //     }
    // }

 });

const router = express.Router()
router.post('/upload_document',upload.array('uploaded_file', 100), uploadFiles)
router.get('/query_about_product', query)
export default router