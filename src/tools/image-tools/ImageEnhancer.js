import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { enhanceImage } from '../../services/apiAdapters';
import { blobToDownload, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

function ImageEnhancer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [options, setOptions] = useState({ sharpen: true, upscale: false, improveQuality: true });
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

  const toggle = (key) => setOptions((current) => ({ ...current, [key]: !current[key] }));

  const runAdapter = async () => {
    setError(''); setOutput(null);
    if (!file) { setError('Upload an image before enhancing it.'); return; }
    try {
      setLoading(true);
      const blob = await enhanceImage(file, options);
      setOutput({ ...blobToDownload(blob), name: `enhanced-${file.name.replace(/\.[^.]+$/, '')}.png` });
    } catch (err) {
      setError(err.message || 'Image enhancer failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload image" accept="image/jpeg,image/png,image/webp" onChange={handleFile} helper="JPG, PNG or WEBP up to 20MB" />
      <ErrorMessage message={error} />
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="option-row"><label className="inline-check"><input type="checkbox" checked={options.sharpen} onChange={() => toggle('sharpen')} /> Sharpen</label><label className="inline-check"><input type="checkbox" checked={options.upscale} onChange={() => toggle('upscale')} /> Upscale</label><label className="inline-check"><input type="checkbox" checked={options.improveQuality} onChange={() => toggle('improveQuality')} /> Improve quality</label></div>
      <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={runAdapter}>Enhance Image</button><DownloadButton href={output?.url} filename={output?.name} disabled={!output}>Download result</DownloadButton></div>
      {loading && <LoadingSpinner label="Calling image enhancer API..." />}
      <div className="preview-grid"><div><h4>Before preview</h4>{preview ? <img src={preview} alt="Original upload preview" /> : <p>No image selected yet.</p>}</div><div><h4>After preview</h4>{output?.url ? <img src={output.url} alt="Enhanced output preview" /> : <p>API output will appear here after real processing.</p>}</div></div>
    </div>
  );
}

export default ImageEnhancer;
