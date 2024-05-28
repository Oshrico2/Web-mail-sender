import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, '../uploads/'); // Corrected destination path
    },
    filename(req, file, cb) {
        cb(
            null,
            `file1${path.extname(file.originalname)}`
        );
    },
});
  

const checkFileType = (file,cb) => {
    const filetypes = /xlsx|csv/;
    const extname = filetypes.test(path.extname(file.originalname)).toLowerCase();
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb({ message: 'xlsx/csv only!' });
    }
}

const upload = multer({
    storage,
});

router.post('/', upload.single('xlsx'), (req, res) => {
    res.send({
        message: 'File uploaded successfully',
        image: `/${req.file.path}`,
    });
});

export default router;
