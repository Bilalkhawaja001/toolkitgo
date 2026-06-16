import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { blobToDownload, canvasToBlob, drawImageToCanvas, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

function ImageCompress() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [quality, setQuality] = useState(0.75);
  const [download, setDownload] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (selected) => {
    setError(''); setDownload(null); setPreview(''); setFile(null);
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

  const compressImage = async () => {
    setError(''); setDownload(null);
    if (!file) { setError('Upload an image before compressing.'); return; }
    try {
      setLoading(true);
      const { image } = await loadImageFromFile(file);
      const outputType = file.type === 'image/png' ? 'image/png' : file.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      const canvas = drawImageToCanvas(image, image.naturalWidth || image.width, image.naturalHeight || image.height, outputType);
      const blob = await canvasToBlob(canvas, outputType, Number(quality));
      if (!blob) throw new Error('Compression failed. No output image was created.');
      setDownload({ ...blobToDownload(blob), name: `compressed-${file.name.replace(/\.[^.]+$/, '')}.${outputType.split('/')[1]}` });
    } catch (err) {
      setError(err.message || 'Image could not be compressed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload image" accept="image/jpeg,image/png,image/webp" onChange={handleFile} helper="JPG, PNG or WEBP up to 20MB" />
      <ErrorMessage message={error} />
      <div className="field-stack">
        <label className="field-title">Quality: {Math.round(quality * 100)}%</label>
        <input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(e.target.value)} />
      </div>
      <div className="tool-button-row"><button className="btn btn-primary" type="button" onClick={compressImage}>Compress image</button><DownloadButton href={download?.url} filename={download?.name} disabled={!download}>Download compressed image</DownloadButton></div>
      {loading && <LoadingSpinner label="Compressing image..." />}
      {file && <div className="result-panel"><div className="size-row"><span>Original size</span><strong>{formatBytes(file.size)}</strong></div>{download && <><div className="size-row"><span>Compressed size</span><strong>{formatBytes(download.size)}</strong></div><div className="size-row"><span>Size change</span><strong>{`${(((file.size - download.size) / file.size) * 100).toFixed(1)}%`}</strong></div></>}</div>}
      <div className="preview-grid">{preview && <div><h4>Preview</h4><img src={preview} alt="Uploaded image preview" /></div>}{download?.url && <div><h4>Compressed output</h4><img src={download.url} alt="Compressed output preview" /></div>}</div>
    </div>
  );
}

export default ImageCompress;
