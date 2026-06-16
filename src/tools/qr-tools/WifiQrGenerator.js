import React, { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import DownloadButton from '../../components/DownloadButton';
import ErrorMessage from '../../components/ErrorMessage';
import LoadingSpinner from '../../components/LoadingSpinner';

const TOOL_ID = 'wifi-qr-generator';
const privacy = 'Your data stays in your browser. Nothing is uploaded.';
const escapeWifi = (value) => value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');
const copy = (text) => navigator.clipboard?.writeText(text);

function WifiQrGenerator() {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [security, setSecurity] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [size, setSize] = useState(512);
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const payload = useMemo(() => `WIFI:T:${security};S:${escapeWifi(ssid)};P:${security === 'nopass' ? '' : escapeWifi(password)};H:${hidden ? 'true' : 'false'};;`, [ssid, password, security, hidden]);
  const generate = async () => { setError(''); setQr(''); if (!ssid.trim()) { setError('SSID required hai.'); return; } if (security !== 'nopass' && !password) { setError('Password required hai ya security nopass select karein.'); return; } try { setLoading(true); setQr(await QRCode.toDataURL(payload, { width: Number(size), margin: 2, errorCorrectionLevel: 'M' })); } catch { setError('WiFi QR generate nahi ho saka.'); } finally { setLoading(false); } };
  return <div className="tool-card phase1b-tool qr-tool" data-tool={TOOL_ID}><div className="tool-status-line"><span className="status-ready">Working client-side</span><span>{privacy}</span></div><h2>WiFi QR Generator</h2><div className="simple-form-grid"><label>SSID<input className="form-input" value={ssid} onChange={e=>setSsid(e.target.value)} /></label><label>Password<input className="form-input" value={password} onChange={e=>setPassword(e.target.value)} disabled={security==='nopass'} /></label><label>Security<select className="form-select" value={security} onChange={e=>setSecurity(e.target.value)}><option>WPA</option><option>WEP</option><option>nopass</option></select></label><label>QR size<select className="form-select" value={size} onChange={e=>setSize(e.target.value)}><option value="256">256</option><option value="512">512</option><option value="768">768</option><option value="1024">1024</option></select></label></div><label className="inline-check"><input type="checkbox" checked={hidden} onChange={e=>setHidden(e.target.checked)} /> Hidden network</label><textarea className="form-textarea code-area" readOnly value={payload} /><div className="tool-button-row"><button className="btn btn-primary" onClick={generate}>Generate QR</button><button className="btn btn-secondary" onClick={()=>copy(payload)}>Copy payload</button></div><ErrorMessage message={error}/>{loading&&<LoadingSpinner label="Generating WiFi QR..."/>}{qr&&<div className="result-panel centered-result"><img className="qr-preview" src={qr} alt="WiFi QR"/><DownloadButton href={qr} filename="wifi-qr-generator.png">Download PNG</DownloadButton></div>}</div>;
}
export default WifiQrGenerator;
