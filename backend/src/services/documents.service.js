const path = require('node:path');
const documentsRepository = require('../repositories/documents.repository');

function createDocument(file, ownerId, id) {
  const document = {
    id,
    originalName: file.originalname,
    storedName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    uploadedAt: new Date().toISOString(),
    ownerId,
  };

  return documentsRepository.create(document);
}

function listDocuments(ownerId) {
  return documentsRepository.findByOwner(ownerId);
}

function findDocumentForDownload(id, ownerId) {
  return documentsRepository.findByIdAndOwner(id, ownerId);
}

function getDocumentPath(document) {
  return path.resolve(__dirname, '../../storage', document.storedName);
}

module.exports = {
  createDocument,
  listDocuments,
  findDocumentForDownload,
  getDocumentPath,
};
