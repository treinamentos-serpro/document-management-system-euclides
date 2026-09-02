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

  // Valida ID de documento (must be valid UUID format)
  static validateDocumentId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('Document ID must be a non-empty string');
    }

    // RFC 4122 UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
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
