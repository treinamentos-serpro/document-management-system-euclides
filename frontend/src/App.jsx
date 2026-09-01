import { useEffect, useState } from 'react';
import UploadComponent from './components/UploadComponent.jsx';
import DocumentList from './components/DocumentList.jsx';
import { downloadDocument, fetchDocuments, uploadDocument } from './services/documentApi.js';

export default function App() {
  const [ownerId, setOwnerId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!ownerId.trim()) {
      setDocuments([]);
      return;
    }

    let ignore = false;

    const loadDocuments = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const documentos = await fetchDocuments(ownerId.trim());
        if (!ignore) {
          setDocuments(documentos);
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setDocuments([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadDocuments();

    return () => {
      ignore = true;
    };
  }, [ownerId]);

  const handleUpload = async (selectedFile) => {
    if (!ownerId.trim()) {
      setErrorMessage('Informe o identificador do usuário antes do upload.');
      return;
    }

    try {
      const createdDocument = await uploadDocument(ownerId.trim(), selectedFile);
      setDocuments((currentDocuments) => [createdDocument, ...currentDocuments]);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleDownload = async (document) => {
    try {
      await downloadDocument(ownerId.trim(), document.id, document.originalName);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>

      <label htmlFor="ownerId" style={{ display: 'block', marginBottom: '1rem' }}>
        Identificador do usuário
        <input
          id="ownerId"
          type="text"
          value={ownerId}
          onChange={(event) => setOwnerId(event.target.value)}
          placeholder="Ex.: usuario-1"
          style={{ display: 'block', width: '100%', marginTop: '0.5rem' }}
        />
      </label>

      {errorMessage && <p style={{ color: 'crimson' }}>{errorMessage}</p>}

      <UploadComponent onUpload={handleUpload} disabled={!ownerId.trim()} />
      <DocumentList
        documents={documents}
        onDownload={handleDownload}
        isLoading={isLoading}
        disabled={!ownerId.trim()}
      />
    </main>
  );
}
