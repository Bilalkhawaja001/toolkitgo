import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import ErrorMessage from '../../components/ErrorMessage';
import { loadImageFromFile, validateImageFile } from './imageUtils';

function ImageOcr() {
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  const handleFile = async (file) => {
    setError('');
    const validation = validateImageFile(file);
    if (validation) { setError(validation); return; }
    const { dataUrl } = await loadImageFromFile(file);
    setPreview(dataUrl);
  };

  return (
    <div className="tool-card tool-card-wide">
      <div className="tool-header"><h2>Image OCR</h2><span className="status-limited">Requires OCR backend/library</span></div>
      <p className="tool-description">Upload preview is available, but this static build does not include an OCR engine. No fake text extraction is shown.</p>
      <FileUploader accept="image/png,image/jpeg,image/webp" label="Upload image for OCR preview" onChange={handleFile} />
      <ErrorMessage message={error} />
      <div className="info-note">Real OCR needs a configured OCR API or client OCR library such as Tesseract.js. Output stays disabled until that exists.</div>
      <div className="preview-grid"><div><h4>Preview</h4>{preview ? <img src={preview} alt="OCR upload preview" /> : <p>No image selected yet.</p>}</div><div><h4>OCR output</h4><p>Not available in this static build.</p></div></div>
    </div>
  );
}

export default ImageOcr;
