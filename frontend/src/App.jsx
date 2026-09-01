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
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                Document Management System
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Biblioteca de arquivos
              </h1>
            </div>

            <label htmlFor="ownerId" className="w-full max-w-sm">
              <span className="mb-2 block text-sm font-medium text-slate-600">
                Identificador do usuário
              </span>
              <input
                id="ownerId"
                type="text"
                value={ownerId}
                onChange={(event) => setOwnerId(event.target.value)}
                placeholder="Ex.: usuario-1"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
        </header>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.1fr_1.9fr]">
          <UploadComponent onUpload={handleUpload} disabled={!ownerId.trim()} />
          <DocumentList
            documents={documents}
            onDownload={handleDownload}
            isLoading={isLoading}
            disabled={!ownerId.trim()}
          />
        </div>
      </div>
    </main>
  );
}
