export default function DownloadButton({ document, onDownload, disabled }) {
  return (
    <button
      type="button"
      onClick={() => onDownload(document)}
      disabled={disabled}
      className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      Baixar
    </button>
  );
}
