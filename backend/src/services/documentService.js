const { randomUUID } = require('node:crypto');

class DocumentService {
  constructor({ repository }) {
    this.repository = repository;
  }

  createDocument(file, owner = 'anonymous') {
    const documentMetadata = {
      id: randomUUID(),
      originalName: file.originalname,
      storageName: file.filename,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      owner,
    };

    return this.repository.saveMetadata(documentMetadata);
  }

  listDocuments() {
    return this.repository.list();
  }

  getDocumentById(id) {
    const document = this.repository.findById(id);

    if (!document) {
      const error = new Error('Documento não encontrado');
      error.code = 'DOCUMENT_NOT_FOUND';
      throw error;
    }

    return document;
  }

  getDocumentPath(storageName) {
    return this.repository.getStoragePath(storageName);
  }
}

module.exports = DocumentService;
