import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { blobToDownload, canvasToBlob, drawImageToCanvas, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

function ImageResize() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [aspectRatio, setAspectRatio] = useState(1);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [download, setDownload] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (selected) => {
    setError(''); setDownload(null); setFile(null); setPreview('');
    const validation = validateImageFile(selected);
    if (validation) { setError(validation); return; }
    try {
      const { image, dataUrl } = await loadImageFromFile(selected);
      setFile(selected);
      setPreview(dataUrl);
      setWidth(image.naturalWidth || image.width);
      setHeight(image.naturalHeight || image.height);
      setAspectRatio((image.naturalWidth || image.width) / (image.naturalHeight || image.height));
    } catch (err) {
      setError(err.message);
    }
  };

  const updateWidth = (value) => {
    setWidth(value);
    if (maintainAspect && Number(value) > 0) setHeight(Math.round(Number(value) / aspectRatio));
  };

  const updateHeight = (value) => {
    setHeight(value);
    if (maintainAspect && Number(value) > 0) setWidth(Math.round(Number(value) * aspectRatio));
  };

  const resizeImage = async () => {
    setError(''); setDownload(null);
    if (!file) { setError('Upload an image before resizing.'); return; }
    const targetWidth = Number(width);
    const targetHeight = Number(height);
    if (!targetWidth || !targetHeight || targetWidth < 1 || targetHeight < 1) {
      setError('Width and height must be positive numbers.'); return;
    }
    try {
      setLoading(true);
      const { image } = await loadImageFromFile(file);
      const outputType = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      const canvas = drawImageToCanvas(image, targetWidth, targetHeight, outputType);
      const blob = await canvasToBlob(canvas, outputType, 0.92);
      if (!blob) throw new Error('Resize failed. No output image was created.');
      setDownload({ ...blobToDownload(blob), name: `resized-${file.name.replace(/\.[^.]+$/, '')}.${outputType.split('/')[1]}` });
    } catch (err) {
      setError(err.message || 'Image could not be resized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload image" accept="image/jpeg,image/png,image/webp" onChange={handleFile} helper="JPG, PNG or WEBP up to 20MB" />
      <ErrorMessage message={error} />
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="two-column-form">
        <div><label className="field-title">Width</label><input className="form-input" type="number" min="1" value={width} onChange={(e) => updateWidth(e.target.value)} /></div>
        <div><label className="field-title">Height</label><input className="form-input" type="number" min="1" value={height} onChange={(e) => updateHeight(e.target.value)} /></div>
      </div>
      <label className="inline-check"><input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} /> Maintain aspect ratio</label>
      <div className="tool-button-row"><button className="btn btn-primary" type="button" onClick={resizeImage}>Resize image</button><DownloadButton href={download?.url} filename={download?.name} disabled={!download}>Download resized image</DownloadButton></div>
      {loading && <LoadingSpinner label="Resizing image..." />}
      <div className="preview-grid">{preview && <div><h4>Original preview</h4><img src={preview} alt="Original upload preview" /></div>}{download?.url && <div><h4>Resized preview</h4><img src={download.url} alt="Resized output preview" /><p>{formatBytes(download.size)}</p></div>}</div>
    </div>
  );
}

export default ImageResize;
