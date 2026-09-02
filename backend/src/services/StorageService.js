// Serviço de armazenamento de arquivos
// Responsabilidade única: operações de I/O do filesystem

const fs = require('fs').promises;
const path = require('path');

class StorageService {
  constructor(storagePath) {
    if (!storagePath) {
      throw new Error('Storage path is required');
    }
    this.storagePath = storagePath;
  }

  // Retorna o caminho completo para um arquivo armazenado
  getFilePath(documentId) {
    if (!documentId) {
      throw new Error('Document ID is required');
    }

    // Validate document ID format (UUID) to prevent directory traversal
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(documentId)) {
      throw new Error('Invalid document ID format');
    }

    const filePath = path.join(this.storagePath, documentId);
    this._validatePath(filePath);
    return filePath;
  }

  // Salva um arquivo enviado por multer
  async saveFile(multerFile) {
    if (!multerFile) {
      throw new Error('Multer file object is required');
    }

    if (!multerFile.path) {
      throw new Error('Multer file path is missing');
    }

    // Multer já salvou o arquivo no disco
    // Este método valida que ele existe
    try {
      await fs.access(multerFile.path);
      return multerFile.path;
    } catch (error) {
      throw new Error(`Failed to access uploaded file: ${error.message}`);
    }
  }

  // Lê um arquivo para download (retorna stream)
  async readFile(documentId) {
    const filePath = this.getFilePath(documentId);

    try {
      await fs.access(filePath);
      return fs.createReadStream(filePath);
    } catch (error) {
      throw new Error(`File not found or cannot be read: ${error.message}`);
    }
  }

  // Deleta um arquivo do disco
  async deleteFile(documentId) {
    const filePath = this.getFilePath(documentId);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      // Se arquivo não existe, não é erro (idempotente)
      if (error.code !== 'ENOENT') {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
    }
  }

  // Valida o caminho para evitar directory traversal
  _validatePath(filePath) {
    const resolvedPath = path.resolve(filePath);
    const resolvedStoragePath = path.resolve(this.storagePath);

    if (!resolvedPath.startsWith(resolvedStoragePath)) {
      throw new Error('Path traversal detected');
    }
  }
}

module.exports = StorageService;
