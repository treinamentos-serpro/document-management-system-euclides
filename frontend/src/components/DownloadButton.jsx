export default function DownloadButton({ document, onDownload, disabled }) {
  return (
    <button type="button" onClick={() => onDownload(document)} disabled={disabled}>
      Baixar
    </button>
  );
}
