const path = require('node:path');

class DocumentRepository {
  constructor({ storageDir }) {
    this.storageDir = storageDir;
    this.documents = [];
  }

  saveMetadata(documentMetadata) {
    this.documents.push(documentMetadata);
    return documentMetadata;
  }

  list() {
    return [...this.documents];
  }

  findById(id) {
    return this.documents.find((document) => document.id === id) || null;
  }

  getStoragePath(storageName) {
    return path.join(this.storageDir, storageName);
  }
}

module.exports = DocumentRepository;
