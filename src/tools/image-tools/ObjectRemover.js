import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import ErrorMessage from '../../components/ErrorMessage';
import { loadImageFromFile, validateImageFile } from './imageUtils';

function ObjectRemover() {
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
      <div className="tool-header"><h2>Object Remover</h2><span className="status-limited">Requires inpainting backend</span></div>
      <p className="tool-description">Object removal needs segmentation/inpainting. This static build shows upload preview only and does not create fake removals.</p>
      <FileUploader accept="image/png,image/jpeg,image/webp" label="Upload image for object-remover preview" onChange={handleFile} />
      <ErrorMessage message={error} />
      <div className="info-note">Connect a real image inpainting API before enabling object removal output.</div>
      <div className="preview-grid"><div><h4>Before</h4>{preview ? <img src={preview} alt="Object remover upload preview" /> : <p>No image selected yet.</p>}</div><div><h4>After</h4><p>Not available in this static build.</p></div></div>
    </div>
  );
}

export default ObjectRemover;
