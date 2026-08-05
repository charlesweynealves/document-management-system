export async function uploadDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || 'Falha ao enviar o documento');
  }

  return response.json();
}

export async function listDocuments() {
  const response = await fetch('/api/documents');

  if (!response.ok) {
    throw new Error('Falha ao carregar documentos');
  }

  return response.json();
}

export async function downloadDocument(id) {
  const response = await fetch(`/api/documents/${id}/download`);

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => ({}));
    throw new Error(errorPayload.error || 'Falha ao baixar o documento');
  }

  const blob = await response.blob();
  return {
    blob,
    filename: getFilenameFromDisposition(response.headers.get('content-disposition')) || `${id}`,
  };
}

function getFilenameFromDisposition(contentDisposition) {
  if (!contentDisposition) {
    return null;
  }

  const filenameMatch = /filename="?(.*?)"?(;|$)/i.exec(contentDisposition);
  return filenameMatch ? filenameMatch[1] : null;
}
