import DownloadButton from './DownloadButton.jsx';

export default function DocumentList({ documents, onDownload, isLoading, disabled }) {
  if (isLoading) {
    return <p>Carregando documentos...</p>;
  }

  if (!documents.length) {
    return <p>Nenhum documento encontrado.</p>;
  }

  return (
    <section>
      <h2>Documentos</h2>
      <ul>
        {documents.map((document) => (
          <li key={document.id}>
            <div>
              <strong>{document.originalName}</strong>
              <p>{document.mimeType}</p>
              <small>{new Date(document.uploadedAt).toLocaleString('pt-BR')}</small>
            </div>
            <DownloadButton
              document={document}
              onDownload={onDownload}
              disabled={disabled}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
