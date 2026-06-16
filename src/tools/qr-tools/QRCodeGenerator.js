import React, { useState } from 'react';
import QRCode from 'qrcode';
import { QrCode } from 'lucide-react';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

function QRCodeGenerator() {
  const [value, setValue] = useState('');
  const [size, setSize] = useState(512);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const generateQr = async () => {
    const input = value.trim();
    setError('');
    setQrDataUrl('');
    if (!input) {
      setError('Enter text or a URL before generating a QR code.');
      return;
    }

    try {
      setLoading(true);
      const dataUrl = await QRCode.toDataURL(input, {
        width: Number(size),
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#111827', light: '#ffffff' }
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      setError('QR code could not be generated for this input.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-card">
      <div className="field-stack">
        <label className="field-title">Text or URL</label>
        <textarea className="form-textarea" value={value} onChange={(e) => setValue(e.target.value)} placeholder="https://example.com or any text..." />
      </div>
      <div className="field-stack compact-field">
        <label className="field-title">QR size</label>
        <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="256">256 × 256</option>
          <option value="512">512 × 512</option>
          <option value="768">768 × 768</option>
          <option value="1024">1024 × 1024</option>
        </select>
      </div>
      <ErrorMessage message={error} />
      <div className="tool-button-row"><button type="button" className="btn btn-primary" onClick={generateQr}><QrCode size={16} /> Generate QR</button></div>
      {loading && <LoadingSpinner label="Generating QR code..." />}
      {qrDataUrl && (
        <div className="result-panel centered-result">
          <img src={qrDataUrl} alt="Generated QR code" className="qr-preview" />
          <DownloadButton href={qrDataUrl} filename="qr-code.png">Download PNG</DownloadButton>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
