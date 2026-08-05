const fs = require('node:fs');

class DocumentController {
  constructor({ service }) {
    this.service = service;
  }

  upload(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não informado' });
    }

    try {
      const owner = req.body.owner || 'anonymous';
      const document = this.service.createDocument(req.file, owner);

      return res.status(201).json(document);
    } catch (error) {
      return res.status(500).json({ error: 'Falha ao processar upload' });
    }
  }

  list(req, res) {
    const documents = this.service.listDocuments();
    return res.json(documents);
  }

  download(req, res) {
    try {
      const document = this.service.getDocumentById(req.params.id);
      const absolutePath = this.service.getDocumentPath(document.storageName);

      if (!fs.existsSync(absolutePath)) {
        return res.status(404).json({ error: 'Documento não encontrado' });
      }

      return res.download(absolutePath, document.originalName);
    } catch (error) {
      if (error.code === 'DOCUMENT_NOT_FOUND') {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: 'Falha ao enviar o documento' });
    }
  }
}

module.exports = DocumentController;
