import { useState } from 'react';
import { downloadDocument } from '../services/apiClient.js';

export default function DownloadButton({ documentId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const { blob, filename } = await downloadDocument(documentId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button type="button" onClick={handleDownload} disabled={loading}>
        {loading ? 'Baixando...' : 'Download'}
      </button>
      {error && <span style={{ color: '#d00', marginTop: '0.25rem' }}>{error}</span>}
    </div>
  );
}
