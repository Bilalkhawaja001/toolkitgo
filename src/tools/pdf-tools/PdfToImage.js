import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { pdfToImageAdapter } from '../../services/apiAdapters';
import { formatBytes } from '../image-tools/imageUtils';

const maxPdfSize = 20 * 1024 * 1024;

function validatePdf(file) {
  if (!file) return 'Choose a PDF file first.';
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return 'Unsupported file type. Use PDF.';
  if (file.size > maxPdfSize) return 'File is too large. Maximum size is 20MB.';
  return '';
}

function PdfToImage() {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (selected) => {
    setError(''); setOutput(null); setFile(null);
    const validation = validatePdf(selected);
    if (validation) { setError(validation); return; }
    setFile(selected);
  };

  const convert = async () => {
    setError(''); setOutput(null);
    if (!file) { setError('Upload a PDF before converting.'); return; }
    try {
      setLoading(true);
      const blob = await pdfToImageAdapter(file);
      setOutput({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}-page-1.png`, size: blob.size });
    } catch (err) {
      setError(err.message || 'PDF to Image conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label="Upload PDF" accept="application/pdf,.pdf" onChange={handleFile} helper="PDF up to 20MB" />
      <ErrorMessage message={error} />
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={convert}>Convert PDF to Images</button><DownloadButton href={output?.url} filename={output?.name} disabled={!output}>Download image</DownloadButton></div>
      {loading && <LoadingSpinner label="Checking PDF rendering adapter..." />}
      <div className="result-panel"><p>PDF rendering dependency is not installed in this build. This adapter only enables downloads after real page images are produced.</p></div>
    </div>
  );
}

export default PdfToImage;
