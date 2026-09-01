// Rotas de documentos
// Responsabilidade única: definição de rotas e montagem de middleware

const express = require('express');
const UploadController = require('../controllers/UploadController');
const DocumentsController = require('../controllers/DocumentsController');
const { upload } = require('../config/multer');

function createDocumentRoutes(documentService) {
  const router = express.Router();
  const uploadController = new UploadController(documentService);
  const documentsController = new DocumentsController(documentService);

  // POST /upload - fazer upload de documento
  router.post(
    '/upload',
    upload.single('file'),
    (req, res, next) => uploadController.upload(req, res, next)
  );

  // GET /documents - listar documentos
  router.get(
    '/documents',
    (req, res, next) => documentsController.list(req, res, next)
  );

  // GET /documents/:id/download - fazer download de documento
  router.get(
    '/documents/:id/download',
    (req, res, next) => documentsController.download(req, res, next)
  );

  return router;
}

module.exports = createDocumentRoutes;
