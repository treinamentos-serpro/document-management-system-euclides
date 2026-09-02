async function readErrorMessage(response) {
  try {
    const payload = await response.json();
    return payload?.error?.message || 'Não foi possível concluir a operação.';
  } catch {
    return 'Não foi possível concluir a operação.';
  }
}

export async function fetchDocuments(ownerId) {
  const response = await fetch('/api/documents', {
    headers: {
      'X-User-Id': ownerId,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function uploadDocument(ownerId, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: {
      'X-User-Id': ownerId,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return response.json();
}

export async function downloadDocument(ownerId, documentId, fileName) {
  const response = await fetch(`/api/documents/${documentId}/download`, {
    headers: {
      'X-User-Id': ownerId,
    },
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
