import DownloadButton from './DownloadButton.jsx';

export default function DocumentList({ documents }) {
  if (!documents.length) {
    return <p>Nenhum documento encontrado.</p>;
  }

  return (
    <section>
      <h2>Documentos enviados</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeadingStyle}>Nome</th>
            <th style={tableHeadingStyle}>Tamanho</th>
            <th style={tableHeadingStyle}>Data</th>
            <th style={tableHeadingStyle}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} style={{ borderTop: '1px solid #e0e0e0' }}>
              <td style={tableCellStyle}>{document.originalName}</td>
              <td style={tableCellStyle}>{formatBytes(document.size)}</td>
              <td style={tableCellStyle}>{new Date(document.uploadedAt).toLocaleString()}</td>
              <td style={tableCellStyle}>
                <DownloadButton documentId={document.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const tableHeadingStyle = {
  textAlign: 'left',
  padding: '0.75rem 0.5rem',
  fontSize: '0.95rem',
  color: '#333',
};

const tableCellStyle = {
  padding: '0.75rem 0.5rem',
  verticalAlign: 'top',
};

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(1)} ${units[index]}`;
}
