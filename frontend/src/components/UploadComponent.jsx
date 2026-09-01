import { useRef, useState } from 'react';

export default function UploadComponent({ onUpload, disabled }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile || disabled) {
      return;
    }

    setIsUploading(true);

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      fileInputRef.current.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-violet-600">
          Upload
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">Adicionar documento</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-violet-400 hover:bg-violet-50">
          <span className="text-sm font-medium text-slate-600">Arquivo</span>
          <span className="text-sm text-slate-800">
            {selectedFile ? selectedFile.name : 'Selecione um arquivo'}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
            disabled={disabled}
          />
        </label>

        <button
          type="submit"
          disabled={!selectedFile || disabled || isUploading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}
