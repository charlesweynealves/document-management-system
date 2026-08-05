const { test, before, after } = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs/promises');
const fsSync = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { Blob } = require('node:buffer');

let app;
let server;
let baseUrl;
let tempDir;

before(async () => {
  tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dms-test-'));
  process.env.STORAGE_DIR = path.join(tempDir, 'storage');
  process.env.PORT = '0';

  // Requerir o app após configurar o storage temporário.
  app = require('../src/app');

  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const address = server.address();
      baseUrl = `http://127.0.0.1:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  }

  if (tempDir) {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
});

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('fluxo de upload, listagem e download do documento', async () => {
  const sampleText = 'conteúdo do documento de teste';
  const sampleFilePath = path.join(tempDir, 'sample.txt');
  await fs.writeFile(sampleFilePath, sampleText, 'utf8');

  const formData = new FormData();
  const fileBuffer = await fs.readFile(sampleFilePath);
  const fileBlob = new Blob([fileBuffer], { type: 'text/plain' });
  formData.append('file', fileBlob, 'sample.txt');

  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.strictEqual(uploadResponse.status, 201);
  const uploadedDocument = await uploadResponse.json();
  assert.strictEqual(uploadedDocument.originalName, 'sample.txt');
  assert.ok(uploadedDocument.id, 'document id deve ser retornado');

  const listResponse = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(listResponse.status, 200);
  const documents = await listResponse.json();
  assert.ok(Array.isArray(documents));
  assert.strictEqual(documents.length, 1);
  assert.strictEqual(documents[0].id, uploadedDocument.id);

  const downloadResponse = await fetch(`${baseUrl}/documents/${uploadedDocument.id}/download`);
  assert.strictEqual(downloadResponse.status, 200);
  const downloadedText = await downloadResponse.text();
  assert.strictEqual(downloadedText, sampleText);
  assert.ok(downloadResponse.headers.get('content-disposition').includes('sample.txt'));
});
