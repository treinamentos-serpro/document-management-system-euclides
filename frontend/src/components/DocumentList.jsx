import DownloadButton from './DownloadButton.jsx';

export default function DocumentList({ documents, onDownload, isLoading, disabled }) {
  if (isLoading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm text-slate-600">Carregando documentos...</p>
      </section>
    );
  }

  if (!documents.length) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Documentos
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Lista vazia</h2>
        </div>
        <p className="text-sm text-slate-600">Nenhum documento encontrado para este usuário.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
            Documentos
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">Arquivos enviados</h2>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {documents.length}
        </span>
      </div>

      <ul className="space-y-3">
        {documents.map((document) => (
          <li
            key={document.id}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <strong className="block truncate text-sm font-semibold text-slate-900">
                {document.originalName}
              </strong>
              <p className="mt-1 text-xs text-slate-500">{document.mimeType}</p>
              <small className="mt-1 block text-xs text-slate-400">
                {new Date(document.uploadedAt).toLocaleString('pt-BR')}
              </small>
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
