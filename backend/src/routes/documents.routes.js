const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const express = require('express');
const multer = require('multer');
const documentsController = require('../controllers/documents.controller');

const storageDirectory = process.env.STORAGE_DIRECTORY || path.resolve(__dirname, '../../storage');
const maxFileSize = Number(process.env.MAX_FILE_SIZE_BYTES) || 10 * 1024 * 1024;

fs.mkdirSync(storageDirectory, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: storageDirectory,
    filename: (req, file, callback) => {
      const fileId = crypto.randomUUID();
      req.documentId = fileId;
      callback(null, `${fileId}${path.extname(file.originalname)}`);
    },
  }),
  limits: { fileSize: maxFileSize },
});

const router = express.Router();

router.post(
  '/upload',
  documentsController.validateOwner,
  upload.single('file'),
  documentsController.uploadDocument,
);

router.get('/documents', documentsController.validateOwner, documentsController.listDocuments);
router.get(
  '/documents/:id/download',
  documentsController.validateOwner,
  documentsController.downloadDocument,
);

module.exports = router;
