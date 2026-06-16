import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { blobToDownload, canvasToBlob, drawImageToCanvas, formatBytes, loadImageFromFile, validateImageFile } from './imageUtils';

const outputOptions = [
  { label: 'JPG', mime: 'image/jpeg', ext: 'jpg' },
  { label: 'PNG', mime: 'image/png', ext: 'png' },
  { label: 'WEBP', mime: 'image/webp', ext: 'webp' }
];

function ImageConverter() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [output, setOutput] = useState(outputOptions[0]);
  const [quality, setQuality] = useState(0.9);
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

  const convertImage = async () => {
    setError(''); setDownload(null);
    if (!file) { setError('Upload an image before converting.'); return; }
    try {
      setLoading(true);
      const { image } = await loadImageFromFile(file);
      const canvas = drawImageToCanvas(image, image.naturalWidth || image.width, image.naturalHeight || image.height, output.mime);
      const blob = await canvasToBlob(canvas, output.mime, output.mime === 'image/png' ? undefined : Number(quality));
      if (!blob) throw new Error('Conversion failed. No output image was created.');
      setDownload({ ...blobToDownload(blob), name: `converted-${file.name.replace(/\.[^.]+$/, '')}.${output.ext}` });
    } catch (err) {
      setError(err.message || 'Image could not be converted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload image" accept="image/jpeg,image/png,image/webp" onChange={handleFile} helper="JPG, PNG or WEBP up to 20MB" />
      <ErrorMessage message={error} />
      <div className="two-column-form">
        <div><label className="field-title">Convert to</label><select className="form-select" value={output.mime} onChange={(e) => setOutput(outputOptions.find(item => item.mime === e.target.value))}>{outputOptions.map(item => <option key={item.mime} value={item.mime}>{item.label}</option>)}</select></div>
        {output.mime !== 'image/png' && <div><label className="field-title">Quality: {Math.round(quality * 100)}%</label><input type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(e) => setQuality(e.target.value)} /></div>}
      </div>
      <div className="tool-button-row"><button className="btn btn-primary" type="button" onClick={convertImage}>Convert image</button><DownloadButton href={download?.url} filename={download?.name} disabled={!download}>Download converted image</DownloadButton></div>
      {loading && <LoadingSpinner label="Converting image..." />}
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="preview-grid">{preview && <div><h4>Original preview</h4><img src={preview} alt="Original upload preview" /></div>}{download?.url && <div><h4>Converted preview</h4><img src={download.url} alt="Converted output preview" /><p>{formatBytes(download.size)}</p></div>}</div>
    </div>
  );
}

export default ImageConverter;
