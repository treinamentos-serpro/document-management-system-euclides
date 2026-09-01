const fs = require('node:fs');
const documentsService = require('../services/documents.service');

function validateOwner(req, res, next) {
  const ownerId = req.get('X-User-Id')?.trim();

  if (!ownerId) {
    return res.status(400).json({
      error: {
        code: 'MISSING_OWNER',
        message: 'O cabeçalho X-User-Id é obrigatório.',
      },
    });
  }

  req.ownerId = ownerId;
  return next();
}

function uploadDocument(req, res) {
  if (!req.file) {
    return res.status(400).json({
      error: {
        code: 'MISSING_FILE',
        message: 'O campo file é obrigatório.',
      },
    });
  }

  const document = documentsService.createDocument(req.file, req.ownerId, req.documentId);
  return res.status(201).json(document);
}

function listDocuments(req, res) {
  return res.json(documentsService.listDocuments(req.ownerId));
}

function downloadDocument(req, res, next) {
  const document = documentsService.findDocumentForDownload(req.params.id, req.ownerId);

  if (!document) {
    return res.status(404).json({
      error: {
        code: 'DOCUMENT_NOT_FOUND',
        message: 'Documento não encontrado.',
      },
    });
  }

  const documentPath = documentsService.getDocumentPath(document);

  if (!fs.existsSync(documentPath)) {
    return res.status(404).json({
      error: {
        code: 'DOCUMENT_FILE_NOT_FOUND',
        message: 'Arquivo do documento não encontrado.',
      },
    });
  }

  return res.download(documentPath, document.originalName, (error) => {
    if (error && !res.headersSent) {
      next(error);
    }
  });
}

module.exports = {
  validateOwner,
  uploadDocument,
  listDocuments,
  downloadDocument,
};
