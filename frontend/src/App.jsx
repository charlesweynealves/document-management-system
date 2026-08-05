import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent.jsx';
import DocumentList from './components/DocumentList.jsx';
import { uploadDocument, listDocuments } from './services/apiClient.js';

export default function App() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState('Carregando documentos...');

  const loadDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
      setStatus('');
    } catch (error) {
      setStatus(error.message);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (file, setUploadStatus) => {
    setUploadStatus('Enviando arquivo...');

    try {
      await uploadDocument(file);
      setUploadStatus('Upload concluído com sucesso.');
      await loadDocuments();
    } catch (error) {
      setUploadStatus(error.message);
    }
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUpload={handleUpload} />
      {status ? <p>{status}</p> : <DocumentList documents={documents} />}
    </main>
  );
}
