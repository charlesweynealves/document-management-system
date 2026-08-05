import { useState } from 'react';

export default function UploadComponent({ onUpload }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    setFile(event.target.files?.[0] ?? null);
    setStatus('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setStatus('Selecione um arquivo antes de enviar.');
      return;
    }

    onUpload(file, setStatus);
  };

  return (
    <section style={{ marginBottom: '1.5rem' }}>
      <h2>Enviar documento</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleChange} />
        <button type="submit" style={{ marginLeft: '0.75rem' }}>
          Enviar
        </button>
      </form>
      {status && <p style={{ color: '#444', marginTop: '0.75rem' }}>{status}</p>}
    </section>
  );
}
