// Serviço de documentos - orquestrador de lógica de negócio
// Responsabilidade única: coordenar operações de documento

const Document = require('../domain/Document');
const ValidationService = require('./ValidationService');
const AuthorizationService = require('./AuthorizationService');

class DocumentService {
  constructor(repository, storageService) {
    if (!repository) {
      throw new Error('Repository is required');
    }
    if (!storageService) {
      throw new Error('StorageService is required');
    }

    this.repository = repository;
    this.storageService = storageService;
  }

  // Faz upload de um novo documento
  async uploadDocument(multerFile, owner) {
    // Validação de entrada
    ValidationService.validateUploadFile(multerFile);
    ValidationService.validateOwner(owner);

    try {
      // Salva arquivo no disco (multer já salvou, apenas valida)
      await this.storageService.saveFile(multerFile);

      // Cria objeto de domínio
      const document = Document.fromUpload(multerFile, owner);

      // Persiste metadados
      this.repository.create(document);

      return document;
    } catch (error) {
      // Limpa arquivo se falhar em salvar metadados
      try {
        await this.storageService.deleteFile(document.id);
      } catch (cleanupError) {
        // Log de erro de cleanup, mas não lança
        console.error('Failed to cleanup file after upload error:', cleanupError);
      }
      throw error;
    }
  }

  // Lista documentos de um usuário
  listDocuments(owner) {
    ValidationService.validateOwner(owner);
    return this.repository.findByOwner(owner);
  }

  // Faz download de um documento
  async downloadDocument(documentId, userId) {
    // Validação de entrada
    ValidationService.validateDocumentId(documentId);
    ValidationService.validateOwner(userId);

    // Busca metadados
    const document = this.repository.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // Verifica autorização
    if (!AuthorizationService.canDownload(userId, document.owner)) {
      throw new Error('Unauthorized: you do not own this document');
    }

    // Retorna stream do arquivo
    return {
      stream: await this.storageService.readFile(documentId),
      document,
    };
  }
}

module.exports = DocumentService;
