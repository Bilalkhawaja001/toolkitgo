import React, { useState } from 'react';
import FileUploader from '../../components/FileUploader';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { convertOfficeToPdf } from '../../services/apiAdapters';
import { formatBytes } from '../image-tools/imageUtils';

const maxOfficeSize = 20 * 1024 * 1024;

function validateOfficeFile(file, extensions) {
  if (!file) return 'Choose a file first.';
  const lower = file.name.toLowerCase();
  if (!extensions.some((ext) => lower.endsWith(ext))) return `Unsupported file type. Use ${extensions.join(', ')}.`;
  if (file.size > maxOfficeSize) return 'File is too large. Maximum size is 20MB.';
  return '';
}

function OfficeToPdfTool({ type, title, extensions, accept }) {
  const [file, setFile] = useState(null);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = (selected) => {
    setError(''); setOutput(null); setFile(null);
    const validation = validateOfficeFile(selected, extensions);
    if (validation) { setError(validation); return; }
    setFile(selected);
  };

  const convert = async () => {
    setError(''); setOutput(null);
    if (!file) { setError('Upload a supported file before converting.'); return; }
    try {
      setLoading(true);
      const blob = await convertOfficeToPdf(file, type);
      setOutput({ url: URL.createObjectURL(blob), name: `${file.name.replace(/\.[^.]+$/, '')}.pdf`, size: blob.size });
    } catch (err) {
      setError(err.message || 'Office to PDF conversion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <FileUploader label={`Upload ${title} file`} accept={accept} onChange={handleFile} helper={`${extensions.join(', ')} up to 20MB`} />
      <ErrorMessage message={error} />
      {file && <div className="file-meta"><span>{file.name}</span><span>{formatBytes(file.size)}</span></div>}
      <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={convert}>Convert to PDF</button><DownloadButton href={output?.url} filename={output?.name} disabled={!output}>Download PDF</DownloadButton></div>
      {loading && <LoadingSpinner label="Calling Office to PDF backend..." />}
      {output && <div className="info-note">PDF created: <strong>{formatBytes(output.size)}</strong></div>}
      <div className="result-panel"><p>This tool uses a backend adapter for real Office document conversion. It only enables downloads after a real backend PDF response is returned.</p></div>
    </div>
  );
}

export default OfficeToPdfTool;
