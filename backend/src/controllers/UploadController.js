// Controlador de upload
// Responsabilidade única: tratar entrada/saída HTTP para upload

class UploadController {
  constructor(documentService) {
    if (!documentService) {
      throw new Error('DocumentService is required');
    }
    this.documentService = documentService;
  }

  async upload(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const owner = req.get('X-User-Id') || 'anonymous';
      const document = await this.documentService.uploadDocument(req.file, owner);

      res.status(201).json(document.toJSON());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UploadController;
