// Serviço de validação de regras de negócio
// Responsabilidade única: validar dados de entrada antes do processamento

class ValidationService {
  // Valida arquivo de upload
  static validateUploadFile(file) {
    if (!file) {
      throw new Error('File is required');
    }

    if (!file.originalname || typeof file.originalname !== 'string') {
      throw new Error('File must have a valid originalname');
    }

    if (typeof file.size !== 'number' || file.size <= 0) {
      throw new Error('File size must be greater than 0');
    }

    if (file.size > 100 * 1024 * 1024) { // 100MB limit
      throw new Error('File size exceeds maximum limit of 100MB');
    }

    if (!file.path) {
      throw new Error('Multer file path is missing');
    }
  }

  // Valida ID de documento
  static validateDocumentId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Document ID must be a non-empty string');
    }

    if (id.length !== 36) { // UUID length
      throw new Error('Invalid document ID format');
    }
  }

  // Valida identificador de usuário (owner)
  static validateOwner(owner) {
    if (!owner || typeof owner !== 'string') {
      throw new Error('Owner must be a non-empty string');
    }
  }
}

module.exports = ValidationService;
