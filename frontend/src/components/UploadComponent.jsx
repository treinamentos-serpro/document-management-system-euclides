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
    <section>
      <h2>Upload de documento</h2>
      <form onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          type="file"
          onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
          disabled={disabled}
        />
        <button type="submit" disabled={!selectedFile || disabled || isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar documento'}
        </button>
      </form>
    </section>
  );
}
