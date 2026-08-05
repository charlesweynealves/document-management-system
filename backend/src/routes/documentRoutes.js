const express = require('express');
const multer = require('multer');
const path = require('node:path');
const DocumentRepository = require('../repositories/documentRepository');
const DocumentService = require('../services/documentService');
const DocumentController = require('../controllers/documentController');

const storageDir = process.env.STORAGE_DIR || path.join(__dirname, '../../storage');

const uploadStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, storageDir);
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const safeName = `${file.fieldname}-${timestamp}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, safeName);
  },
});

const upload = multer({ storage: uploadStorage });

const documentRepository = new DocumentRepository({ storageDir });
const documentService = new DocumentService({ repository: documentRepository });
const documentController = new DocumentController({ service: documentService });

const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => documentController.upload(req, res));
router.get('/documents', (req, res) => documentController.list(req, res));
router.get('/documents/:id/download', (req, res) => documentController.download(req, res));

module.exports = router;
