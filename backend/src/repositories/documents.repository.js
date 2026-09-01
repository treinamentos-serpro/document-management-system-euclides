class DocumentsRepository {
  constructor() {
    this.documents = [];
  }

  create(document) {
    this.documents.push(document);
    return document;
  }

  findByOwner(ownerId) {
    return this.documents.filter((document) => document.ownerId === ownerId);
  }

  findByIdAndOwner(id, ownerId) {
    return this.documents.find(
      (document) => document.id === id && document.ownerId === ownerId,
    );
  }
}

module.exports = new DocumentsRepository();
