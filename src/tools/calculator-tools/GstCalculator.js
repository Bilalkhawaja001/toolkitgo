import React, { useMemo, useState } from 'react';
import ErrorMessage from '../../components/ErrorMessage';
const privacy = 'Your data stays in your browser. Nothing is uploaded.';
const fmt = (v) => Number(v).toLocaleString(undefined, { maximumFractionDigits: 2 });
function GstCalculator() {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState('add');
  const result = useMemo(() => { const a=Number(amount), r=Number(rate); if(a<=0 || r<0) return {error:'Amount positive aur GST rate zero ya positive hona chahiye.'}; if(mode==='add'){ const gst=a*r/100; return {base:a,gst,total:a+gst}; } const base=a/(1+r/100); return {base,gst:a-base,total:a}; }, [amount, rate, mode]);
  return <div className="tool-card simple-tool"><div className="tool-status-line"><span className="status-ready">Working client-side</span><span>{privacy}</span></div><h2>GST Calculator</h2><div className="simple-form-grid"><label>Amount<input className="form-input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} /></label><label>GST rate %<input className="form-input" type="number" step="0.01" value={rate} onChange={e=>setRate(e.target.value)} /></label><label>Mode<select className="form-select" value={mode} onChange={e=>setMode(e.target.value)}><option value="add">Add GST</option><option value="remove">Remove GST</option></select></label></div><ErrorMessage message={result.error} />{!result.error && <div className="result-card-grid"><div><span>Base amount</span><strong>{fmt(result.base)}</strong></div><div><span>GST amount</span><strong>{fmt(result.gst)}</strong></div><div><span>Total amount</span><strong>{fmt(result.total)}</strong></div></div>}</div>;
}
export default GstCalculator;
