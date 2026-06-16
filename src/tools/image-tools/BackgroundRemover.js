import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { removeBackground } from '../../services/apiAdapters';
import { blobToDownload, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

function BackgroundRemover() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (selected) => {
    setError(''); setOutput(null); setPreview(''); setFile(null);
    const validation = validateImageFile(selected);
    if (validation) { setError(validation); return; }
    try {
      const { dataUrl } = await loadImageFromFile(selected);
      setFile(selected);
      setPreview(dataUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const runAdapter = async () => {
    setError(''); setOutput(null);
    if (!file) { setError('Upload an image before removing the background.'); return; }
    try {
      setLoading(true);
      const blob = await removeBackground(file);
      setOutput({ ...blobToDownload(blob), name: `background-removed-${file.name.replace(/\.[^.]+$/, '')}.png` });
    } catch (err) {
      setError(err.message || 'Background remover failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload image" accept="image/jpeg,image/png,image/webp" onChange={handleFile} helper="JPG, PNG or WEBP up to 20MB" />
      <ErrorMessage message={error} />
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={runAdapter}>Remove Background</button><DownloadButton href={output?.url} filename={output?.name} disabled={!output}>Download result</DownloadButton></div>
      {loading && <LoadingSpinner label="Calling background remover API..." />}
      <div className="preview-grid"><div><h4>Before preview</h4>{preview ? <img src={preview} alt="Original upload preview" /> : <p>No image selected yet.</p>}</div><div><h4>After preview</h4>{output?.url ? <img src={output.url} alt="Background removed result" /> : <p>API output will appear here after real processing.</p>}</div></div>
    </div>
  );
}

export default BackgroundRemover;
