import React, { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function RemoveExtraSpaces() {
  const [text, setText] = useState('');
  const cleaned = text.replace(/\s+/g, ' ').trim();

  return (
    <div>
      <div className="tool-card">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
          <label style={{fontWeight: 600, color: '#374151'}}>Input Text:</label>
          <button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text with extra spaces..." className="form-textarea" style={{minHeight: 150}} />

        <label style={{fontWeight: 600, color: '#374151', display: 'block', margin: '16px 0 8px'}}>Cleaned Text:</label>
        <div style={{position: 'relative'}}>
          <textarea value={cleaned} readOnly className="form-textarea" style={{minHeight: 150, background: '#f9fafb'}} />
          <button onClick={() => navigator.clipboard.writeText(cleaned)} className="btn btn-secondary btn-sm" style={{position: 'absolute', top: 8, right: 8}}>
            <Copy size={14} /> Copy
          </button>
        </div>

        <div style={{display: 'flex', gap: 16, marginTop: 16, padding: '12px 16px', background: '#f0fdf4', borderRadius: 8, fontSize: '0.875rem'}}>
          <span style={{color: '#059669'}}>Original: {text.length} chars</span>
          <span style={{color: '#059669'}}>Cleaned: {cleaned.length} chars</span>
          <span style={{color: '#059669'}}>Removed: {text.length - cleaned.length} chars</span>
        </div>
      </div>
    </div>
  );
}

export default RemoveExtraSpaces;
