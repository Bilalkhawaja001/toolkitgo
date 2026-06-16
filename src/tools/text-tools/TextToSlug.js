import React, { useState } from 'react';
import { Copy, RotateCcw } from 'lucide-react';

function TextToSlug() {
  const [text, setText] = useState('');
  const slug = text.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return (
    <div>
      <div className="tool-card">
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 16}}>
          <label style={{fontWeight: 600, color: '#374151'}}>Input Text:</label>
          <button onClick={() => setText('')} className="btn btn-secondary btn-sm"><RotateCcw size={14} /> Clear</button>
        </div>
        <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to convert to slug..." className="form-input" />

        <label style={{fontWeight: 600, color: '#374151', display: 'block', margin: '16px 0 8px'}}>URL Slug:</label>
        <div style={{position: 'relative'}}>
          <input type="text" value={slug} readOnly className="form-input" style={{background: '#f9fafb', fontFamily: 'monospace'}} />
          <button onClick={() => navigator.clipboard.writeText(slug)} className="btn btn-secondary btn-sm" style={{position: 'absolute', top: 6, right: 8}}>
            <Copy size={14} /> Copy
          </button>
        </div>

        <div style={{marginTop: 16, padding: '12px 16px', background: '#eff6ff', borderRadius: 8, fontSize: '0.875rem', color: '#2563eb'}}>
          Example: <strong>"Hello World!"</strong> → <strong>hello-world</strong>
        </div>
      </div>
    </div>
  );
}

export default TextToSlug;
