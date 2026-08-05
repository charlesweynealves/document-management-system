const { randomUUID } = require('node:crypto');

class DocumentService {
  constructor({ repository }) {
    this.repository = repository;
  }

  createDocument(file, owner = 'anonymous') {
    this.validateFile(file);

    const documentMetadata = this.buildDocumentMetadata(file, owner);
    return this.repository.saveMetadata(documentMetadata);
  }

  listDocuments() {
    return this.repository.list();
  }

  getDocumentById(id) {
    this.validateId(id);

    const document = this.repository.findById(id);
    if (!document) {
      throw this.createDocumentNotFoundError(id);
    }

    return document;
  }

  getDocumentPath(storageName) {
    this.validateStorageName(storageName);
    return this.repository.getStoragePath(storageName);
  }

  buildDocumentMetadata(file, owner) {
    return {
      id: randomUUID(),
      originalName: file.originalname,
      storageName: file.filename,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      owner,
    };
  }

  validateFile(file) {
    if (!file || typeof file.originalname !== 'string' || typeof file.filename !== 'string') {
      throw new Error('Arquivo inválido');
    }
  }

  validateId(id) {
    if (!id || typeof id !== 'string') {
      throw new Error('ID inválido');
    }
  }

  validateStorageName(storageName) {
    if (!storageName || typeof storageName !== 'string' || storageName.includes('/') || storageName.includes('\\')) {
      throw new Error('Nome de arquivo de armazenamento inválido');
    }
  }

  createDocumentNotFoundError(id) {
    const error = new Error(`Documento não encontrado: ${id}`);
    error.code = 'DOCUMENT_NOT_FOUND';
    return error;
  }
}

module.exports = DocumentService;
