// Repositório de metadados de documentos
// Responsabilidade única: persistência de metadados em memória

class DocumentRepository {
  constructor() {
    this.documents = new Map(); // id -> Document
  }

  create(document) {
    if (!document || !document.id) {
      throw new Error('Invalid document object');
    }
    
    if (this.documents.has(document.id)) {
      throw new Error(`Document with ID ${document.id} already exists`);
    }

    this.documents.set(document.id, document);
    return document;
  }

  findById(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    return this.documents.get(id) || null;
  }

  findByOwner(owner) {
    if (!owner) {
      throw new Error('Owner is required');
    }

    const docs = [];
    for (const doc of this.documents.values()) {
      if (doc.owner === owner) {
        docs.push(doc);
      }
    }
    return docs;
  }

  exists(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    return this.documents.has(id);
  }

  delete(id) {
    if (!id) {
      throw new Error('ID is required');
    }

    return this.documents.delete(id);
  }

  getAll() {
    return Array.from(this.documents.values());
  }

  clear() {
    this.documents.clear();
  }
}

module.exports = DocumentRepository;
