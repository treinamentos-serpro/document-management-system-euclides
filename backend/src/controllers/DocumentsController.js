// Controlador de documentos
// Responsabilidade única: tratar entrada/saída HTTP para listagem e download

class DocumentsController {
  constructor(documentService) {
    if (!documentService) {
      throw new Error('DocumentService is required');
    }
    this.documentService = documentService;
  }

  list(req, res, next) {
    try {
      const owner = req.get('X-User-Id') || 'anonymous';
      const documents = this.documentService.listDocuments(owner);

      res.json({
        data: documents.map(doc => doc.toJSON()),
        total: documents.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async download(req, res, next) {
    try {
      const userId = req.get('X-User-Id') || 'anonymous';
      const { id } = req.params;

      const { stream, document } = await this.documentService.downloadDocument(id, userId);

      // Configura headers para download
      res.setHeader('Content-Disposition', `attachment; filename="${document.originalName}"`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Length', document.size);

      stream.pipe(res);

      stream.on('error', (error) => {
        res.status(500).json({ error: 'Failed to read file' });
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DocumentsController;
