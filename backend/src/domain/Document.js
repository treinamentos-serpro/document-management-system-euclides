// Modelo de domínio para documentos
// Responsabilidade única: representar e validar a entidade Document

const crypto = require('crypto');

class Document {
  constructor(id, originalName, size, uploadedAt, owner) {
    this.id = id;
    this.originalName = originalName;
    this.size = size;
    this.uploadedAt = uploadedAt;
    this.owner = owner;
    
    this.validate();
  }

  validate() {
    if (!this.id || typeof this.id !== 'string') {
      throw new Error('Document ID must be a non-empty string');
    }
    if (!this.originalName || typeof this.originalName !== 'string') {
      throw new Error('Document originalName must be a non-empty string');
    }
    if (typeof this.size !== 'number' || this.size < 0) {
      throw new Error('Document size must be a non-negative number');
    }
    if (!this.uploadedAt || typeof this.uploadedAt !== 'string') {
      throw new Error('Document uploadedAt must be a non-empty string (ISO 8601)');
    }
    if (!this.owner || typeof this.owner !== 'string') {
      throw new Error('Document owner must be a non-empty string');
    }
  }

  toJSON() {
    return {
      id: this.id,
      originalName: this.originalName,
      size: this.size,
      uploadedAt: this.uploadedAt,
      owner: this.owner,
    };
  }

  static fromUpload(file, owner) {
    if (!file || !file.originalname || !file.size) {
      throw new Error('Invalid file object');
    }
    if (!owner) {
      throw new Error('Owner is required');
    }

    const id = crypto.randomUUID();
    const uploadedAt = new Date().toISOString();

    return new Document(id, file.originalname, file.size, uploadedAt, owner);
  }
}

module.exports = Document;
